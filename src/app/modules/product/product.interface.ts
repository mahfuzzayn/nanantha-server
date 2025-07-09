import { Types } from "mongoose";

export interface IProduct {
    title: string;
    author: string;
    price: number;
    category:
        | "Fiction"
        | "Science"
        | "SelfDevelopment"
        | "Poetry"
        | "Religious";
    rating: number;
    reviews: Types.ObjectId[];
    image: string;
    description: string;
    status: "active" | "discontinued";
    quantity: number;
    inStock: boolean;
}
