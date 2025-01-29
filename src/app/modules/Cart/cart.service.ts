import { Cart } from './cart.model'
import { TCartItem } from './cart.interface'
import { Product } from '../Product/product.model'

const getAllCartsFromDB = async () => {
    return await Cart.find()
}

const getSingleCartFromDB = async (userId: string) => {
    const cart = await Cart.findOne({ userId })
    if (!cart) throw new Error('Cart not found')
    return cart
}

const addItemIntoDB = async (
    userId: string,
    itemData: Omit<TCartItem, 'totalPrice' | 'title' | 'author' | 'price'>,
) => {
    const { productId, quantity } = itemData

    const product = await Product.findById(productId)
    if (!product) throw new Error('Product not found')

    const productTitle = product.title
    const productAuthor = product.author
    const productPrice = product.price
    const totalPrice = productPrice * quantity

    let cart = await Cart.findOne({ userId })

    if (!cart) {
        cart = new Cart({
            userId,
            items: [
                {
                    productId,
                    title: productTitle,
                    author: productAuthor,
                    price: productPrice,
                    quantity,
                    totalPrice,
                },
            ],
            totalItems: quantity,
            totalPrice,
        })
    } else {
        const existingItem = cart.items.find(
            item => item.productId.toString() === productId,
        )

        if (existingItem) {
            existingItem.quantity += quantity
            existingItem.totalPrice = existingItem.quantity * existingItem.price
        } else {
            cart.items.push({
                productId,
                title: productTitle,
                author: productAuthor,
                price: productPrice,
                quantity,
                totalPrice,
            })
        }

        cart.totalItems = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0,
        )
        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.totalPrice,
            0,
        )
    }

    return await cart.save()
}

const removeItemFromDB = async (userId: string, productId: string) => {
    const cart = await Cart.findOne({ userId })
    if (!cart) throw new Error('Cart not found')

    cart.items = cart.items.filter(
        item => item.productId.toString() !== productId,
    )

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0)
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.totalPrice, 0)

    return await cart.save()
}

const updateItemQuantityInDB = async (
    userId: string,
    productId: string,
    quantityChange: number,
) => {
    const cart = await Cart.findOne({ userId })
    if (!cart) throw new Error('Cart not found')

    const item = cart.items.find(
        item => item.productId.toString() === productId,
    )
    if (!item) throw new Error('Item not found in cart')

    item.quantity += quantityChange

    if (item.quantity <= 0) {
        cart.items = cart.items.filter(
            i => i.productId.toString() !== productId,
        )
    } else {
        item.totalPrice = item.price * item.quantity
    }

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0)
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.totalPrice, 0)

    return await cart.save()
}

const clearCartInDB = async (userId: string) => {
    const cart = await Cart.findOneAndUpdate(
        { userId },
        { items: [], totalItems: 0, totalPrice: 0 },
        { new: true },
    )
    if (!cart) throw new Error('Cart not found')
    return cart
}

export const CartServices = {
    getAllCartsFromDB,
    getSingleCartFromDB,
    addItemIntoDB,
    removeItemFromDB,
    updateItemQuantityInDB,
    clearCartInDB,
}
