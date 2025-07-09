import express from "express";
import { cartControllers } from "./cart.controller";
import { CartValidations } from "./cart.validation";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { UserRole } from "../user/user.interface";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), cartControllers.getAllCarts);

router.get("/me", auth(UserRole.USER), cartControllers.getMyCart);

router.get("/:userId", auth(UserRole.ADMIN), cartControllers.getSingleCart);

router.post(
    "/",
    auth(UserRole.USER),
    validateRequest(CartValidations.addItemValidationSchema),
    cartControllers.addItem
);

router.delete(
    "/",
    auth(UserRole.USER),
    validateRequest(CartValidations.removeItemValidationSchema),
    cartControllers.removeItem
);

router.put(
    "/",
    auth(UserRole.USER),
    validateRequest(CartValidations.updateQuantityValidationSchema),
    cartControllers.updateItemQuantity
);

router.delete("/clear", auth(UserRole.USER), cartControllers.clearCart);

export const CartRoutes = router;
