/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import { Product } from './product.model'
import { TProduct } from './product.interface'
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary'
import QueryBuilder from '../../builder/QueryBuilder'
import { productsSearchableFields } from './product.const'

const validateObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id)
}

const createProductIntoDB = async (file: any, payload: TProduct) => {
    if (file) {
        const imageName = `${payload.title}-${payload?.author}`
        const path = file?.path

        // Ssend image to cloudinary
        const { secure_url } = await sendImageToCloudinary(imageName, path)
        payload.image = secure_url as string
    }

    const result = await Product.create(payload)

    return result
}

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
    const productsQuery = new QueryBuilder(Product.find(), query)
        .search(productsSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields()

    const result = await productsQuery.modelQuery
    const meta = await productsQuery.countTotal()

    return {
        meta,
        result,
    }
}

const getAllAuthorsFromDB = async () => {
    const result = await Product.aggregate([
        {
            $group: {
                _id: '$author',
                books: {
                    $push: '$title',
                },
            },
        },
        {
            $project: {
                _id: 0,
                name: '$_id',
                books: 1,
            },
        },
    ])
    return result
}

const getSingleProductFromDB = async (id: string) => {
    if (!validateObjectId(id)) {
        const error = new Error('The provided ID is invalid')
        error.name = 'InvalidID'
        throw error
    }

    const result = await Product.findById(id)

    if (!result) {
        const error = new Error(
            'Failed to retrieve the book. The provided ID does not match any existing book',
        )
        error.name = 'SearchError'
        throw error
    }

    return result
}

const getOrderProductFromDB = async (id: string) => {
    if (!validateObjectId(id)) {
        const error = new Error('The Product ID is invalid')
        error.name = 'Invalid ProductID'
        throw error
    }

    const result = await Product.findById(id)

    if (!result) {
        const error = new Error(
            'Failed to retrieve the product. The provided ID does not match any existing product',
        )
        error.name = 'SearchError'
        throw error
    }

    return result
}

const updateProductFromDB = async (
    id: string,
    file: any,
    payload: Partial<TProduct>,
) => {
    if (file) {
        const imageName = `${payload.title}-${payload?.author}`
        const path = file?.path

        // Send new updated image to cloudinary
        const { secure_url } = await sendImageToCloudinary(imageName, path)
        payload.image = secure_url as string
    }

    payload.inStock = payload.quantity ? true : false

    const result = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    })

    return result
}

const updateProductAfterOrderFromDB = async (
    id: string,
    quantity: number,
    productInDB: TProduct,
) => {
    const result = await Product.findByIdAndUpdate(id, {
        $inc: { quantity: -quantity },
        $set: {
            inStock:
                productInDB.quantity - quantity <= 0
                    ? false
                    : productInDB.inStock,
        },
    })

    return result
}

const deleteProductFromDB = async (id: string) => {
    if (!validateObjectId(id)) {
        const error = new Error('The provided ID is invalid')
        error.name = 'InvalidID'
        throw error
    }

    const existingProduct = await Product.findById(id)

    if (!existingProduct) {
        throw new Error(
            'Failed to delete the book. The provided ID does not match any existing book.',
        )
    }

    const result = await Product.deleteOne({ _id: id })
    return result
}

export const ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getAllAuthorsFromDB,
    getSingleProductFromDB,
    getOrderProductFromDB,
    updateProductFromDB,
    updateProductAfterOrderFromDB,
    deleteProductFromDB,
}
