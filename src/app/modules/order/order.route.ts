import express from "express";
import { orderControllers } from "./order.controller";
import { orderValidationSchema, OrderValidations } from "./order.validation";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), orderControllers.getAllOrders);

router.get("/:userId", auth(UserRole.USER), orderControllers.getUserOrders);

router.post(
    "/",
    auth(UserRole.USER),
    validateRequest(orderValidationSchema),
    orderControllers.createOrder
);

router.patch(
    "/:orderId",
    auth(UserRole.ADMIN),
    orderControllers.updateOrderStatusByAdmin
);

router.patch(
    "/cancel/:orderId",
    auth(UserRole.USER),
    orderControllers.updateOrderStatusByUser
);

router.delete("/:orderId", auth(UserRole.ADMIN), orderControllers.deleteOrder);

router.post(
    "/create-payment-intent",
    auth(UserRole.USER),
    validateRequest(OrderValidations.createPaymentIntentValidationSchema),
    orderControllers.createPaymentIntent
);

router.get("/revenue", orderControllers.generateRevenueOfOrders);

export const OrderRoutes = router;
