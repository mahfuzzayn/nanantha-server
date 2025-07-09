import mongoose, { Schema } from "mongoose";
import { IOrder, IStatus } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
    {
        mollieId: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
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
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: IStatus,
            default: "pending_for_payment",
        },
        paymentId: { type: String, required: true },
        paymentStatus: {
            type: String,
            enum: ["paid", "pending", "cancelled"],
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model<IOrder>("Order", OrderSchema);
