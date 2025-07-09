import { Types } from "mongoose";

export interface IOrder {
    _id: Types.ObjectId;
    mollieId: string;
    user: Types.ObjectId;
    items: IOrderItem[];
    amount: number;
    status: TOrderStatus;
    paymentId: string;
    paymentStatus: "paid" | "pending" | "cancelled";
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IOrderItem {
    _id: Types.ObjectId;
    productId: Types.ObjectId;
    title: string;
    author: string;
    image: string;
    price: number;
    quantity: number;
    totalPrice: number;
}

export type TOrderStatus =
    | "pending_for_payment"
    | "approved"
    | "cancelled_by_user"
    | "cancelled_by_admin"
    | "shipped"
    | "delivered";

export enum IStatus {
    PENDING_FOR_PAYMENT = "pending_for_payment", // Default
    APPROVED = "approved", // System 1
    CANCELLED_BY_USER = "cancelled_by_user", // User 1
    CANCELLED_BY_ADMIN = "cancelled_by_admin", // Admin 1
    SHIPPED = "shipped", // Admin 2
    DELIVERED = "delivered", // Admin 3
}
