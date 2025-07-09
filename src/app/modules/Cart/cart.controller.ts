import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { CartServices } from "./cart.service";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../auth/auth.interface";

const getAllCarts = catchAsync(async (req, res) => {
    const result = await CartServices.getAllCartsFromDB();

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "All carts retrieved successfully",
        data: result,
    });
});

const getMyCart = catchAsync(async (req, res) => {
    const result = await CartServices.getMyCartFromDB(req.user as IJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cart retrieved successfully",
        data: result,
    });
});

const getSingleCart = catchAsync(async (req, res) => {
    const { userId } = req.params;

    const result = await CartServices.getSingleCartFromDB(userId);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User cart retrieved successfully",
        data: result,
    });
});

const addItem = catchAsync(async (req, res) => {
    const result = await CartServices.addItemIntoDB(
        req.body,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Item added to cart successfully",
        data: result,
    });
});

const removeItem = catchAsync(async (req, res) => {
    const { productId } = req.body;

    const result = await CartServices.removeItemFromDB(
        productId,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Item removed from cart successfully",
        data: result,
    });
});

const updateItemQuantity = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;

    const result = await CartServices.updateItemQuantityInDB(
        productId,
        quantity,
        req.user as IJwtPayload
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Item quantity updated successfully",
        data: result,
    });
});

const clearCart = catchAsync(async (req, res) => {
    const result = await CartServices.clearCartInDB(req.user as IJwtPayload);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cart cleared successfully",
        data: result,
    });
});

export const cartControllers = {
    getAllCarts,
    getMyCart,
    getSingleCart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
};
