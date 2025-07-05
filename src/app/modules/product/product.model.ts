import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            validate: {
                validator: (value: string) => {
                    return /^[a-zA-Z0-9\s.:'-]+$/.test(value);
                },
                message:
                    "{VALUE} --- should only contain alphabetic characters, numbers and spaces",
            },
        },
        author: {
            type: String,
            required: [true, "Author is required"],
            validate: {
                validator: (value: string) => {
                    return /^[a-zA-ZÀ-ÿ\s,.'!-]+$/.test(value);
                },
                message:
                    "{VALUE} --- should only contain alphabetic characters and spaces",
            },
        },
        price: {
            type: Number,
            required: [true, "Price of the Product (Book) is required"],
            validate: {
                validator: (value: number) => value > 0,
                message: "{VALUE} --- should only contain positive number",
            },
        },
        category: {
            type: String,
            enum: [
                "Fiction",
                "Science",
                "SelfDevelopment",
                "Poetry",
                "Religious",
            ],
            required: [true, "Category of the Product (Book) is required"],
        },
        image: {
            type: String,
            required: [true, "Image is required"],
        },
        description: {
            type: String,
            required: [true, "Description of the Product (Book) is required"],
            validate: {
                validator: (value: string) => {
                    return /^[a-zA-ZÀ-ÿ0-9\s,.'’!-():-]+$/.test(value);
                },
                message:
                    "{VALUE} --- should only contain alphabets, numbers, spaces, commas, periods, exclamation points, and other common punctuation",
            },
        },
        quantity: {
            type: Number,
            required: [true, "Quantity of the Product (Book) is required"],
            validate: {
                validator: (value: number) => value >= 0,
                message: "{VALUE} --- should only contain positive number",
            },
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Product = model<IProduct>("Product", productSchema);
