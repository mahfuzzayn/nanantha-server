import mongoose from 'mongoose'
import { Product } from '../Product/product.model'
import { TOrder } from './order.interface'
import { Order } from './order.model'

const orderProductIntoDB = async (orderData: TOrder) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        for (const item of orderData.items) {
            const product = await Product.findById(item.productId).session(
                session,
            )

            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`)
            }

            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}`)
            }

            product.quantity -= item.quantity
            if (product.quantity === 0) {
                product.inStock = false
            }
            await product.save({ session })
        }

        const order = new Order(orderData)
        const savedOrder = await order.save({ session })

        await session.commitTransaction()
        return savedOrder
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

const generateOrdersRevenueFromDB = async () => {
    const result = await Order.aggregate([
        {
            $addFields: {
                productObjectId: { $toObjectId: '$product' },
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productObjectId',
                foreignField: '_id',
                as: 'productDetails',
            },
        },
        {
            $unwind: '$productDetails',
        },
        {
            $project: {
                revenue: {
                    $multiply: ['$quantity', '$productDetails.price'],
                },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$revenue' },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
            },
        },
    ])

    return result.length > 0 ? result[0] : { totalRevenue: 0 }
}

export const OrderServices = {
    orderProductIntoDB,
    generateOrdersRevenueFromDB,
}
