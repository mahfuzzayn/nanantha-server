import { Types } from 'mongoose'

export interface ICartItem {
    productId: Types.ObjectId
    title: string
    author: string;
    image: string;
    price: number
    quantity: number
    totalPrice: number
}

export interface ICart  {
    user: Types.ObjectId
    items: ICartItem[]
    totalItems: number
    totalPrice: number
}
