import mongoose, { Schema } from 'mongoose'
import { TOrder } from './order.interface'

const OrderSchema = new Schema<TOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            title: { type: String, required: true },
            author: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
            _id: { type: String, required: true },
        },
    ],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    transactionId: { type: String, required: true },
    createdAt: { type: String, default: Date.now },
})

export const Order = mongoose.model<TOrder>('Order', OrderSchema)
