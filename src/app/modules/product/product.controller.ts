import { ProductServices } from './product.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'
import httpStatus from 'http-status'

const createProduct = catchAsync(async (req, res) => {
    const { product: productData } = req.body

    const result = await ProductServices.createProductIntoDB(
        req.file,
        productData,
    )

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book created successfully',
        data: result,
    })
})

const getAllProducts = catchAsync(async (req, res) => {
    const result = await ProductServices.getAllProductsFromDB(req.query)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Books retrieved successfully',
        meta: result.meta,
        data: result.result,
    })
})

const getAllAuthors = catchAsync(async (req, res) => {
    const result = await ProductServices.getAllAuthorsFromDB()

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Authors retrieved successfully',
        data: result,
    })
})

const getSingleProduct = catchAsync(async (req, res) => {
    const { productId } = req.params

    const result = await ProductServices.getSingleProductFromDB(productId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book retrieved successfully',
        data: result,
    })
})

const updateProduct = catchAsync(async (req, res) => {
    const { productId } = req.params
    const { product: updatedProduct } = req.body

    const result = await ProductServices.updateProductFromDB(
        productId,
        req.file,
        updatedProduct,
    )
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book updated successfully',
        data: result,
    })
})

const deleteProduct = catchAsync(async (req, res) => {
    const { productId } = req.params

    const result = await ProductServices.deleteProductFromDB(productId)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Book deleted successfully',
        data: result,
    })
})

export const productControllers = {
    createProduct,
    getAllProducts,
    getAllAuthors,
    getSingleProduct,
    updateProduct,
    deleteProduct,
}
