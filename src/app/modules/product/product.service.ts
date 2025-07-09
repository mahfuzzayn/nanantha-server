/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Product } from "./product.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { productSearchableFields } from "./product.const";
import { IProduct } from "./product.interface";
import AppError from "../../errors/appError";
import { StatusCodes } from "http-status-codes";

const validateObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

const createProductIntoDB = async (file: any, payload: IProduct) => {
    if (file && file.path) {
        payload.image = file.path;
    }

    const result = await Product.create(payload);

    if (!result) {
        throw new AppError(StatusCodes.NOT_FOUND, "Failed to create product");
    }

    return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
    const { rating, minPrice, maxPrice, keywords, inStock } = query;

    const filter: Record<string, any> = {};

    // Adding Status "active" for selecing only active products
    filter.status = { $eq: "active" };

    if (inStock !== undefined) {
        filter.inStock = { $eq: inStock === "true" ? true : false };
    }

    if (rating) {
        filter.rating = { $gte: parseFloat(rating as string) };
    }

    const authors = (query?.authors as string)?.split(",") || [];

    if (authors.length) {
        filter.$or = authors.map((name) => ({
            author: { $regex: new RegExp(`^${name}`, "i") },
        }));
    }

    const category = (query?.category as string)?.split(",") || [];

    if (category.length) {
        filter.$or = category.map((ctg) => ({
            category: { $regex: new RegExp(`^${ctg}`, "i") },
        }));
    }

    if (keywords) {
        filter.$or = [
            { author: { $regex: keywords, $options: "i" } },
            { title: { $regex: keywords, $options: "i" } },
            { category: { $regex: keywords, $options: "i" } },
            { description: { $regex: keywords, $options: "i" } },
        ];
    }

    const productsQuery = new QueryBuilder(
        Product.find(filter).populate("reviews"),
        query
    )
        .search(productSearchableFields)
        .sort()
        .paginate()
        .fields()
        .priceRange(Number(minPrice) || 0, Number(maxPrice) || Infinity);

    const products = await productsQuery.modelQuery.lean();
    const meta = await productsQuery.countTotal();

    return {
        meta,
        result: products,
    };
};

const getAllAuthorsFromDB = async () => {
    const result = await Product.aggregate([
        {
            $group: {
                _id: "$author",
                books: {
                    $push: "$title",
                },
            },
        },
        {
            $project: {
                _id: 0,
                name: "$_id",
                books: 1,
            },
        },
        {
            $sort: {
                name: 1,
            },
        },
    ]);

    return result;
};

const getSingleProductFromDB = async (id: string) => {
    if (!validateObjectId(id)) {
        const error = new Error("The provided ID is invalid");
        error.name = "InvalidID";
        throw error;
    }

    const result = await Product.findOne({
        _id: id,
        status: "active",
    }).populate({
        path: "reviews",
        populate: "product user",
    });

    if (!result) {
        const error = new Error(
            "Failed to retrieve the book. The provided ID does not match any existing book"
        );
        error.name = "SearchError";
        throw error;
    }

    return result;
};

const updateProductFromDB = async (
    id: string,
    file: any,
    payload: Partial<IProduct>
) => {
    if (file && file.path) {
        payload.image = file.path;
    }

    payload.inStock = payload.quantity ? true : false;

    const result = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

const updateProductAfterOrderFromDB = async (
    id: string,
    quantity: number,
    productInDB: IProduct
) => {
    const result = await Product.findByIdAndUpdate(id, {
        $inc: { quantity: -quantity },
        $set: {
            inStock:
                productInDB.quantity - quantity <= 0
                    ? false
                    : productInDB.inStock,
        },
    });

    return result;
};

const deleteProductFromDB = async (id: string) => {
    if (!validateObjectId(id)) {
        const error = new Error("The provided ID is invalid");
        error.name = "InvalidID";
        throw error;
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
        throw new Error(
            "Failed to delete the book. The provided ID does not match any existing book."
        );
    }

    const result = await Product.findOneAndUpdate(
        { _id: id },
        { status: "discontinued" },
        {
            new: true,
            runValidators: true,
        }
    );
    return result;
};

export const ProductServices = {
    createProductIntoDB,
    getAllProductsFromDB,
    getAllAuthorsFromDB,
    getSingleProductFromDB,
    updateProductFromDB,
    updateProductAfterOrderFromDB,
    deleteProductFromDB,
};
