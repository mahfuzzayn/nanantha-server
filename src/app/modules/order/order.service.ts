import { ProductServices } from '../product/product.service'
import { TOrder } from './order.interface'
import { Order } from './order.model'

const orderProductIntoDB = async (orderData: TOrder) => {
    const { product: productId, quantity, totalPrice } = orderData

    const productInDB = await ProductServices.getOrderProductFromDB(productId)

    if (!productInDB) {
        throw new Error('Product not found')
    }

    if (productInDB.quantity < quantity) {
        throw new Error('Insufficient stock available')
    }

    if (totalPrice > productInDB.price * quantity) {
        throw new Error(
            'The total price provided exceeds the calculated price for this order',
        )
    } else if (totalPrice !== productInDB.price * quantity) {
        throw new Error(
            'The total price provided is insufficient for this order',
        )
    }

    const updatedProduct = await ProductServices.updateProductAfterOrderFromDB(
        productId,
        quantity,
        productInDB,
    )

    if (!updatedProduct) {
        throw new Error('Error updating product stock')
    }

    const result = await Order.create(orderData)

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
    orderProductIntoDB,
    generateOrdersRevenueFromDB,
}
