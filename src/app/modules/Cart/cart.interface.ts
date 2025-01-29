import { Types } from 'mongoose'

export type TCartItem = {
    productId: Types.ObjectId
    title: string
    author: string;
    price: number
    quantity: number
    totalPrice: number
}

export type TCart = {
    userId: Types.ObjectId
    items: TCartItem[]
    totalItems: number
    totalPrice: number
}
