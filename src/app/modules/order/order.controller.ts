/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { OrderServices } from "./order.service";
import sendResponse from "../../utils/sendResponse";
import Stripe from "stripe";
import catchAsync from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import config from "../../config";

const stripe = new Stripe(config.stripe_secret_key as string);

const getAllOrders = catchAsync(async (req, res) => {
    const result = await OrderServices.getAllOrdersFromDB(req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Orders retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getUserOrders = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await OrderServices.getSingleUserOrdersFromDB(
        userId,
        req.query
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Orders retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const createOrder = catchAsync(async (req, res) => {
    const result = await OrderServices.createOrderIntoDB(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order created successfully",
        data: result,
    });
});

const updateOrderStatusByUser = catchAsync(async (req, res) => {
    const { orderId } = req.params;

    const result = await OrderServices.updateOrderStatusByUserIntoDB(orderId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
});

const updateOrderStatusByAdmin = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const result = await OrderServices.updateOrderStatusByAdminIntoDB(
        orderId,
        status
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
});

const deleteOrder = catchAsync(async (req, res) => {
    const { orderId } = req.params;

    const result = await OrderServices.deleteOrderFromDB(orderId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order deleted successfully",
        data: result,
    });
});

const createPaymentIntent = catchAsync(async (req, res) => {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency || "usd",
        payment_method_types: ["card"],
    });

    const result = { clientSecret: paymentIntent.client_secret };

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Payment intent created successfully",
        data: result,
    });
});

const generateRevenueOfOrders = async (req: Request, res: Response) => {
    try {
        const result = await OrderServices.generateOrdersRevenueFromDB();

        res.status(200).json({
            message: "Revenue calculated successfully",
            status: true,
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Failed to calculate revenue",
            status: false,
            error: {
                name: error.name,
                errors: error.errors,
                stack: error.stack,
            },
        });
    }
};

export const orderControllers = {
    getAllOrders,
    getUserOrders,
    createOrder,
    updateOrderStatusByUser,
    updateOrderStatusByAdmin,
    deleteOrder,
    createPaymentIntent,
    generateRevenueOfOrders,
};
