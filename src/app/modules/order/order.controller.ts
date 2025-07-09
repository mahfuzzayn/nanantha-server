/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { OrderServices } from "./order.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import { IJwtPayload } from "../auth/auth.interface";

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

const getSingleOrder = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const result = await OrderServices.getSingleOrderFromDB(orderId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order retrieved successfully",
        data: result,
    });
});

const getOrderByPaymentId = catchAsync(async (req, res) => {
    const { paymentId } = req.params;
    const result = await OrderServices.getOrderByPaymentIdFromDB(paymentId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order retrieved successfully",
        data: result,
    });
});

const getMyOrders = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await OrderServices.getMyOrdersFromDB(userId, req.query);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Orders retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const createOrder = catchAsync(async (req, res) => {
    const result = await OrderServices.createOrderIntoDB(
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order created successfully",
        data: result,
    });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const { mollieId } = req.query;
    const result = await OrderServices.validateOrderIntoDB(mollieId as string);

    if (result.success) {
        res.redirect(
            301,
            `${config.client_url}/payment-success?paymentId=${result.paymentId}`
        );
    } else {
        res.redirect(
            301,
            `${config.client_url}/payment-failed?paymentId=${result.paymentId}`
        );
    }
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

export const OrderController = {
    getAllOrders,
    getSingleOrder,
    getOrderByPaymentId,
    getMyOrders,
    createOrder,
    validatePayment,
    updateOrderStatusByUser,
    updateOrderStatusByAdmin,
    deleteOrder,
    generateRevenueOfOrders,
};
