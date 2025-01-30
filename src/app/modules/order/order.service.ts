import mongoose from 'mongoose'
import { Product } from '../Product/product.model'
import { TOrder, TOrderStatus } from './order.interface'
import { Order } from './order.model'

const validStatusTransitions: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
}

const getAllOrdersFromDB = async () => {
    const result = await Order.find()

    return result
}

const getSingleUserOrdersFromDB = async (userId: string) => {
    const result = await Order.find({ userId })

    return result
}

const createOrderIntoDB = async (orderData: TOrder) => {
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

const updateOrderStatusByUserIntoDB = async (id: string) => {
    const order = await Order.findById(id)

    if (!order) {
        throw new Error('No order found')
    }

    if (order.status === 'delivered') {
        throw new Error('Order is already delivered')
    } else if (order.status === 'cancelled') {
        throw new Error('Order is already cancelled')
    }

    const result = await Order.findByIdAndUpdate(
        id,
        { status: 'cancelled' },
        { new: true, runValidators: true },
    )

    return result
}

const updateOrderStatusByAdminIntoDB = async (
    id: string,
    status: TOrderStatus,
) => {
    const order = await Order.findById(id)

    if (!order) {
        throw new Error('No order found')
    }

    if (!validStatusTransitions[order.status]?.includes(status)) {
        throw new Error(
            `Invalid status transition from ${order.status} to ${status}`,
        )
    }

    const result = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true },
    )

    return result
}

const deleteOrderFromDB = async (id: string) => {
    const result = await Order.findByIdAndDelete(id)

    return result
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
    getAllOrdersFromDB,
    getSingleUserOrdersFromDB,
    createOrderIntoDB,
    updateOrderStatusByUserIntoDB,
    updateOrderStatusByAdminIntoDB,
    deleteOrderFromDB,
    generateOrdersRevenueFromDB,
}
