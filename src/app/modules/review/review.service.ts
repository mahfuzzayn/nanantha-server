import mongoose, { ClientSession, Types } from "mongoose";
import { IReview } from "./review.interface";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";
import { IJwtPayload } from "../auth/auth.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { Review } from "./review.model";
import { User } from "../user/user.model";
import { Product } from "../product/product.model";

const calculateProductAverageRating = async (
    productId: Types.ObjectId,
    session?: ClientSession
) => {
    const result = await Review.aggregate([
        {
            $match: { product: new mongoose.Types.ObjectId(productId) },
        },
        {
            $group: {
                _id: null,
                rating: { $avg: "$rating" },
                reviewCount: { $sum: 1 },
            },
        },
    ]).session(session!);

    if (result.length === 0) {
        return { rating: 0, reviewCount: 0 };
    }

    return {
        rating: parseFloat(result[0].rating.toFixed(2)) || 0,
        reviewCount: Number(result[0].reviewCount) || 0,
    };
};

const giveReviewIntoDB = async (payload: IReview, authUser: IJwtPayload) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await User.findById(authUser?.userId);

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
        }

        const product = await Product.findById(payload?.product);

        if (!product) {
            throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
        }

        const isUserReviewExists = await Review.findOne({
            product: product?._id,
            user: user?._id,
        });

        if (isUserReviewExists) {
            throw new AppError(
                StatusCodes.NOT_FOUND,
                "You already gave a review to this product!"
            );
        }

        payload.user = user?._id;
        const reviewCreated = new Review(payload);
        await reviewCreated.save({ session });

        const userReviews = [...user.reviewsGiven];

        userReviews.push(reviewCreated?._id);

        await User.findOneAndUpdate(
            { _id: user?._id },
            { reviewsGiven: userReviews },
            { new: true, session }
        );

        // Update Product's Overall Rating
        const { rating } = await calculateProductAverageRating(
            product?._id,
            session
        );

        product.rating = rating as number;
        product.reviews.push(reviewCreated?._id);
        await product.save({ session });

        await session.commitTransaction();

        return reviewCreated;
    } catch (error: any) {
        await session.abortTransaction();

        throw new AppError(StatusCodes.BAD_REQUEST, error?.message);
    } finally {
        await session.endSession();
    }
};

const getSingleReviewFromDB = async (id: string) => {
    const review = await Review.findById(id).populate("user product");

    if (!review) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No review were found by the provided ID!"
        );
    }

    return review;
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
    const reviewsQuery = new QueryBuilder(
        Review.find().populate("user product"),
        query
    )
        .sort()
        .paginate()
        .fields();
    const reviews = await reviewsQuery.modelQuery;
    const meta = await reviewsQuery.countTotal();

    if (!reviews) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No reviews were found by the student ID!"
        );
    }

    return {
        meta,
        result: reviews,
    };
};

const getMyReviewsFromDB = async (
    authUser: IJwtPayload,
    query: Record<string, unknown>
) => {
    const user = await User.findById(authUser?.userId);

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "No reviews were found!");
    }

    const reviewsQuery = new QueryBuilder(
        Review.find({ user: user?._id, isVisible: true }).populate(
            "user product"
        ),
        query
    )
        .sort()
        .paginate()
        .fields();

    const reviews = await reviewsQuery.modelQuery;
    const meta = await reviewsQuery.countTotal();

    if (!reviews) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No reviews were found by the student ID!"
        );
    }

    return {
        meta,
        result: reviews,
    };
};

// Admin Services
const changeReviewVisibilityByAdminIntoDB = async (
    reviewId: string,
    payload: Partial<IReview>
) => {
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new AppError(StatusCodes.NOT_FOUND, "Review not found.");
    }

    const { product, user, rating, comment, ...filteredPayload } = payload;

    const updatedData: any = {
        ...filteredPayload,
    };

    const updatedReview = await Review.findOneAndUpdate(
        { _id: reviewId },
        updatedData,
        { new: true }
    );

    return updatedReview;
};

export const ReviewServices = {
    giveReviewIntoDB,
    getSingleReviewFromDB,
    getAllReviewsFromDB,
    getMyReviewsFromDB,

    // Admin Services
    changeReviewVisibilityByAdminIntoDB,
};
