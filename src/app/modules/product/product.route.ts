import express, { NextFunction, Request, Response } from "express";
import { productControllers } from "./product.controller";
import { ProductValidations } from "./product.validation";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middleware/bodyParse";

const router = express.Router();

router.post(
    "/create-product",
    auth(UserRole.ADMIN),
    multerUpload.single("image"),
    parseBody,
    validateRequest(ProductValidations.createProductValidationSchema),
    productControllers.createProduct
);

router.get("/", productControllers.getAllProducts);

router.get("/authors", productControllers.getAllAuthors);

router.get("/:productId", productControllers.getSingleProduct);

router.patch(
    "/:productId",
    auth(UserRole.ADMIN),
    multerUpload.single("image"),
    parseBody,
    validateRequest(ProductValidations.updateProductValidationSchema),
    productControllers.updateProduct
);

router.delete(
    "/:productId",
    auth(UserRole.ADMIN),
    productControllers.deleteProduct
);

export const ProductRoutes = router;
