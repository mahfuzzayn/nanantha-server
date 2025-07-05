import { Cart } from "./cart.model";
import { TCartItem } from "./cart.interface";
import { Product } from "../product/product.model";
import { IJwtPayload } from "../auth/auth.interface";

const getAllCartsFromDB = async () => {
    return await Cart.find();
};

const getSingleCartFromDB = async (userId: string) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found");
    return cart;
};

const addItemIntoDB = async (
    payload: Omit<
        TCartItem,
        "totalPrice" | "title" | "image" | "author" | "price"
    >,
    authUser: IJwtPayload
) => {
    const { productId, quantity } = payload;

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const {
        title: productTitle,
        author: productAuthor,
        image: productImage,
        price: productPrice,
        quantity: productQuantity,
    } = product;

    if (quantity > productQuantity) {
        throw new Error("No more stock available");
    }

    const totalPrice = parseFloat((productPrice * quantity).toFixed(2));

    let cart = await Cart.findOne({ user: authUser?.userId });

    if (!cart) {
        cart = new Cart({
            user: authUser?.userId,
            items: [
                {
                    productId,
                    title: productTitle,
                    author: productAuthor,
                    image: productImage,
                    price: productPrice,
                    quantity,
                    totalPrice,
                },
            ],
            totalItems: quantity,
            totalPrice,
        });
    } else {
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId.toString()
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > productQuantity) {
                throw new Error("Not available in stock");
            }

            existingItem.quantity = newQuantity;
            existingItem.totalPrice = parseFloat(
                (existingItem.quantity * existingItem.price).toFixed(2)
            );
        } else {
            cart.items.push({
                productId,
                title: productTitle,
                author: productAuthor,
                image: productImage,
                price: productPrice,
                quantity,
                totalPrice,
            });
        }

        cart.totalItems = cart.items.reduce(
            (acc, item) => acc + item.quantity,
            0
        );
        cart.totalPrice = parseFloat(
            cart.items
                .reduce((acc, item) => acc + item.totalPrice, 0)
                .toFixed(2)
        );
    }

    return await cart.save();
};

const removeItemFromDB = async (productId: string, authUser: IJwtPayload) => {
    const cart = await Cart.findOne({ user: authUser?.userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
    );

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.totalPrice,
        0
    );

    return await cart.save();
};

const updateItemQuantityInDB = async (
    productId: string,
    quantityChange: number,
    authUser: IJwtPayload
) => {
    const cart = await Cart.findOne({ user: authUser?.userId });

    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find(
        (item) => item.productId.toString() === productId
    );

    if (!item) throw new Error("Item not found in cart");

    const product = await Product.findById(productId);

    if (!product) throw new Error("Product not found");

    const newQuantity = item.quantity + quantityChange;

    if (quantityChange > 0 && newQuantity > product.quantity) {
        throw new Error("No more stock available");
    }

    if (newQuantity <= 0) {
        cart.items = cart.items.filter(
            (i) => i.productId.toString() !== productId
        );
    } else {
        item.quantity = newQuantity;
        item.totalPrice = parseFloat((item.price * item.quantity).toFixed(2));
    }

    cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = parseFloat(
        cart.items.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2)
    );

    return await cart.save();
};

const clearCartInDB = async (authUser: IJwtPayload) => {
    const cart = await Cart.findOneAndUpdate(
        { user: authUser?.userId },
        { items: [], totalItems: 0, totalPrice: 0 },
        { new: true }
    );

    if (!cart) throw new Error("Cart not found");

    return cart;
};

export const CartServices = {
    getAllCartsFromDB,
    getSingleCartFromDB,
    addItemIntoDB,
    removeItemFromDB,
    updateItemQuantityInDB,
    clearCartInDB,
};
