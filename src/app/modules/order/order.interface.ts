import { Types } from 'mongoose'

export type TOrder = {
    userId: Types.ObjectId
    items: TOrderItem[]
    total: number
    status: TOrderStatus
    transactionId: string
    createdAt?: string
}

export type TOrderItem = {
    productId: Types.ObjectId
    title: string
    author: string
    image: string
    price: number
    quantity: number
    totalPrice: number
    _id: string
}

export type TOrderStatus =
    | 'pending'
    | 'approved'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
