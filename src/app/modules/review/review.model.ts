import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewsSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Review = model<IReview>("Review", reviewsSchema);
