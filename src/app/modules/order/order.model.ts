import { model, Schema } from 'mongoose'
import { TOrder } from './order.interface'
import validator from 'validator'

const orderSchema = new Schema<TOrder>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            validate: {
                validator: (value: string) => {
                    return validator.isEmail(value)
                },
                message: 'Invalid email format',
            },
        },
        product: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            minlength: [3, 'Product name must be at least 3 characters long'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
            validate: {
                validator: function (value: number) {
                    return Number.isInteger(value)
                },
                message: 'Quantity must be a valid integer',
            },
        },
        totalPrice: {
            type: Number,
            required: [true, 'Total price is required'],
            min: [0, 'Total price must be a positive value'],
        },
    },
    {
        timestamps: true,
    },
)

export const Order = model<TOrder>('Order', orderSchema)
