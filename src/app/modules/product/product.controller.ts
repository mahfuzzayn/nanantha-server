/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { ProductServices } from './product.service'

const createProduct = async (req: Request, res: Response) => {
    try {
        const productData = req.body

        const result = await ProductServices.createProductIntoDB(productData)

        res.status(200).json({
            message: 'Book created successfully',
            success: true,
            data: result,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
                stack: error.stack,
            },
        })
    }
}

const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { searchTerm } = req.query

        const result = await ProductServices.getAllProductsFromDB(
            searchTerm as string,
        )

        res.status(200).json({
            message: 'Books retrieved successfully',
            status: true,
            data: result,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
                stack: error.stack,
            },
        })
    }
}

const getSingleProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params

        const result = await ProductServices.getSingleProductFromDB(productId)

        res.status(200).json({
            message: 'Book retrieved successfully',
            status: true,
            data: result,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
                stack: error.stack,
            },
        })
    }
}

const updateProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params
        const updatedProduct = req.body

        const result = await ProductServices.updateProductFromDB(
            productId,
            updatedProduct,
        )

        res.status(200).json({
            message: 'Book updated successfully',
            status: true,
            data: result,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
                stack: error.stack,
            },
        })
    }
}

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params

        const result = await ProductServices.deleteProductFromDB(productId)

        res.status(200).json({
            message: 'Book deleted successfully',
            status: true,
            data: result,
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
                stack: error.stack,
            },
        })
    }
}

export const productControllers = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
}
