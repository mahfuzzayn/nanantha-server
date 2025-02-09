import { Types } from 'mongoose'
export type TOrder = {
    _id: Types.ObjectId
    userId: Types.ObjectId
    items: TOrderItem[]
    total: number
    status: TOrderStatus
    transactionId: string
    createdAt?: string
}

export type TOrderItem = {
    _id: Types.ObjectId
    productId: Types.ObjectId
    title: string
    author: string
    image: string
    price: number
    quantity: number
    totalPrice: number
}

export type TOrderStatus =
    | 'pending'
    | 'approved'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
