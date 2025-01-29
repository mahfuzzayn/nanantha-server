import { Types } from 'mongoose'

export type TOrder = {
    userId: Types.ObjectId
    items: TOrderItem[]
    total: number
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
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
