import { Types } from "mongoose";
import { IProduct } from "../product/product.interface";

export interface IReview {
    _id: Types.ObjectId;
    product: IProduct;
    user: Types.ObjectId;
    isVisible: boolean;
    rating: number;
    comment: string;
}
