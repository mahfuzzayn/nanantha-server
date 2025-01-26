import { Product } from './product.model'
import { TProduct } from './product.interface'
import mongoose from 'mongoose'

const validateObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id)
}

const createProductIntoDB = async (productData: TProduct) => {
    const result = await Product.create(productData)
    return result
}

const getAllProductsFromDB = async (searchTerm: string) => {
    if (!searchTerm) {
        const result = await Product.find()

        if (result.length === 0) {
            throw new Error('No books were found')
        }

        return result
    } else {
        const result = await Product.find({
            $or: [
                {
                    title: {
                        $regex: searchTerm,
                        $options: 'i',
                    },
                },
                {
                    author: {
                        $regex: searchTerm,
                        $options: 'i',
                    },
                },
                {
                    category: {
                        $regex: searchTerm,
                        $options: 'i',
                    },
                },
            ],
        })

        if (result.length === 0) {
            throw new Error('No books were found with this search term')
        }

        return result
    }
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
    updatedProduct: Partial<TProduct>,
) => {
    let isChangeValid: boolean = true

    if (!validateObjectId(id)) {
        const error = new Error('The provided ID is invalid')
        error.name = 'InvalidID'
        throw error
    }

    const product = await Product.findById(id)

    if (!product) {
        throw new Error('No book found with the provided ID.')
    }

    for (const key in updatedProduct) {
        if (
            updatedProduct[key as keyof Partial<TProduct>] ===
            product[key as keyof TProduct]
        ) {
            isChangeValid = false
        }
    }

    if (!isChangeValid) {
        throw new Error('No updates detected, the book remains unchanged.')
    }

    const result = await Product.updateOne(
        {
            _id: id,
        },
        {
            $set: updatedProduct,
        },
    )

    if (!result.modifiedCount) {
        const error = new Error(
            'Failed to update the book. The provided ID does not match any existing book.',
        )
        error.name = 'SearchError'
        throw error
    }

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
    getSingleProductFromDB,
    getOrderProductFromDB,
    updateProductFromDB,
    updateProductAfterOrderFromDB,
    deleteProductFromDB,
}
