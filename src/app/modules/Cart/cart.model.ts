import mongoose, { Schema, model } from 'mongoose'
import { TCart, TCartItem } from './cart.interface'

const cartItemSchema = new Schema<TCartItem>({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
})

const cartSchema = new Schema<TCart>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
        totalItems: { type: Number, required: true, default: 0 },
        totalPrice: { type: Number, required: true, default: 0 },
    },
    { timestamps: true },
)

export const Cart = model<TCart>('Cart', cartSchema)
