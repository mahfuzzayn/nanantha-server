import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'
import { CartServices } from './cart.service'

const getAllCarts = catchAsync(async (req, res) => {
    const result = await CartServices.getAllCartsFromDB()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All carts retrieved successfully',
        data: result,
    })
})

const getSingleCart = catchAsync(async (req, res) => {
    const { userId } = req.params

    const result = await CartServices.getSingleCartFromDB(userId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User cart retrieved successfully',
        data: result,
    })
})

const addItem = catchAsync(async (req, res) => {
    const { item } = req.body
    const { userId, ...itemData } = item

    const result = await CartServices.addItemIntoDB(userId, itemData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Item added to cart successfully',
        data: result,
    })
})

const removeItem = catchAsync(async (req, res) => {
    const { userId, productId } = req.body

    const result = await CartServices.removeItemFromDB(
        userId as string,
        productId,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Item removed from cart successfully',
        data: result,
    })
})

const updateItemQuantity = catchAsync(async (req, res) => {
    const { userId, productId, quantity } = req.body

    const result = await CartServices.updateItemQuantityInDB(
        userId as string,
        productId,
        quantity,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Item quantity updated successfully',
        data: result,
    })
})

const clearCart = catchAsync(async (req, res) => {
    const { userId } = req.body

    const result = await CartServices.clearCartInDB(userId as string)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cart cleared successfully',
        data: result,
    })
})

export const cartControllers = {
    getAllCarts,
    getSingleCart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
}
