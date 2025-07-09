import mongoose from "mongoose";
import { Product } from "../product/product.model";
import { IStatus, TOrderStatus } from "./order.interface";
import { Order } from "./order.model";
import QueryBuilder from "../../builder/QueryBuilder";
import createMollieClient from "@mollie/api-client";
import config from "../../config";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { generateMollieId } from "./order.utils";
import { IJwtPayload } from "../auth/auth.interface";
import { Cart } from "../cart/cart.model";
import { User } from "../user/user.model";

// Mollie Client Connection
export const mollieClient = createMollieClient({
    apiKey: config.mollie_client_api as string,
});

export const validStatusTransitions: Record<IStatus, IStatus[]> = {
    [IStatus.PENDING_FOR_PAYMENT]: [
        IStatus.APPROVED,
        IStatus.CANCELLED_BY_USER,
    ],
    [IStatus.APPROVED]: [IStatus.SHIPPED, IStatus.CANCELLED_BY_ADMIN],
    [IStatus.SHIPPED]: [IStatus.DELIVERED],
    [IStatus.DELIVERED]: [],
    [IStatus.CANCELLED_BY_USER]: [],
    [IStatus.CANCELLED_BY_ADMIN]: [],
};

const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
    const ordersQuery = new QueryBuilder(Order.find().populate("user"), query)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await ordersQuery.modelQuery;
    const meta = await ordersQuery.countTotal();

    return {
        meta,
        result,
    };
};

const getSingleOrderFromDB = async (orderId: string) => {
    const result = await Order.findById(orderId).populate("user");

    if (!result) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No order found by the order ID"
        );
    }

    return result;
};

const getOrderByPaymentIdFromDB = async (paymentId: string) => {
    const result = await Order.findOne({ paymentId }).populate("user");

    if (!result) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No order found by the payment ID"
        );
    }

    return result;
};

const getMyOrdersFromDB = async (
    userId: string,
    query: Record<string, unknown>
) => {
    const ordersQuery = new QueryBuilder(
        Order.find({ userId }).populate("user"),
        query
    )
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await ordersQuery.modelQuery;
    const meta = await ordersQuery.countTotal();

    return {
        meta,
        result,
    };
};

const createOrderIntoDB = async (authUser: IJwtPayload) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findById(authUser?.userId);

    if (!user) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User not found.");
    }

    const cart = await Cart.findOne({ user: authUser?.userId });

    if (!cart) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Your cart is empty!");
    }

    try {
        const mollieId = generateMollieId();

        const payment = await mollieClient.payments.create({
            amount: {
                value: parseFloat(cart?.totalPrice?.toString()).toFixed(2),
                currency: "USD",
            },
            description: `${cart?.totalPrice} USD payment created for ${user?.name} by Nanantha`,
            redirectUrl: `${config.base_url}/orders/validate?mollieId=${mollieId}`,
        });

        const paymentData = {
            user: authUser?.userId,
            mollieId,
            items: [...cart.items],
            amount: cart?.totalPrice,
            currency: "USD",
            paymentId: payment.id,
            paymentStatus: payment.status === "open" && "pending",
            expiresAt: payment.expiresAt,
        };

        // Store Payment in MongoDB (Mollie) Collection
        const order = new Order(paymentData);
        await order.save({ session });

        // Clear User Cart
        cart.set({
            totalPrice: 0,
            totalItems: 0,
            items: [],
        });

        await cart.save({ session });

        await session.commitTransaction();

        return {
            checkoutUrl: payment.getCheckoutUrl(),
        };
    } catch (error) {
        await session.abortTransaction();

        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to create an order"
        );
    } finally {
        await session.endSession();
    }
};

const validateOrderIntoDB = async (mollieId: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const order = await Order.findOne({ mollieId });

        if (!order) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                "No order found by the provided mollieId"
            );
        }

        const payment = await mollieClient.payments.get(order?.paymentId);

        if (!payment) {
            throw new AppError(StatusCodes.NOT_FOUND, "Invalid payment");
        }

        await Order.findOneAndUpdate(
            { mollieId },
            {
                status:
                    payment.status === "paid"
                        ? "approved"
                        : payment.status === "open"
                        ? "pending"
                        : "cancelled_by_admin",
                paymentStatus:
                    payment.status === "paid"
                        ? "paid"
                        : payment.status === "open"
                        ? "pending"
                        : "cancelled",
            },
            { new: true }
        );

        for (const item of order.items) {
            const product = await Product.findById(item.productId).session(
                session
            );

            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}`);
            }

            product.quantity -= item.quantity;
            if (product.quantity === 0) {
                product.inStock = false;
            }
            await product.save({ session });
        }

        await session.commitTransaction();

        return {
            success: payment.status === "paid",
            paymentId: payment.id,
        };
    } catch (error) {
        await session.abortTransaction();

        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to validate payment"
        );
    } finally {
        await session.endSession();
    }
};

const updateOrderStatusByUserIntoDB = async (id: string) => {
    const order = await Order.findById(id);

    if (!order) {
        throw new Error("No order found");
    }

    if (order.status === "delivered") {
        throw new Error("Order is already delivered");
    } else if (order.status === "cancelled_by_user") {
        throw new Error("Order is already cancelled by user");
    } else if (order.status === "cancelled_by_admin") {
        throw new Error("Order is already cancelled by admin");
    }

    const result = await Order.findByIdAndUpdate(
        id,
        { status: "cancelled_by_user" },
        { new: true, runValidators: true }
    );

    return result;
};

const updateOrderStatusByAdminIntoDB = async (id: string, status: IStatus) => {
    const order = await Order.findById(id);

    if (!order) {
        throw new Error("No order found");
    }

    if (!validStatusTransitions[order.status]?.includes(status)) {
        throw new Error(
            `Invalid status transition from ${order.status} to ${status}`
        );
    }

    const result = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    return result;
};

const deleteOrderFromDB = async (id: string) => {
    const result = await Order.findByIdAndDelete(id);

    if (!result) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Failed to delete the order"
        );
    }

    return result;
};

const generateOrdersRevenueFromDB = async () => {
    const result = await Order.aggregate([
        {
            $unwind: "$items",
        },
        {
            $addFields: {
                productObjectId: {
                    $toObjectId: "$items.productId",
                },
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "productObjectId",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        {
            $unwind: {
                path: "$productDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                revenue: {
                    $multiply: ["$items.quantity", "$productDetails.price"],
                },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$revenue" },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
            },
        },
    ]);

    return result.length > 0 ? result[0] : { totalRevenue: 0 };
};

export const OrderServices = {
    getAllOrdersFromDB,
    getSingleOrderFromDB,
    getMyOrdersFromDB,
    getOrderByPaymentIdFromDB,
    createOrderIntoDB,
    validateOrderIntoDB,
    updateOrderStatusByUserIntoDB,
    updateOrderStatusByAdminIntoDB,
    deleteOrderFromDB,
    generateOrdersRevenueFromDB,
};
