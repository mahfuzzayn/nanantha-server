import express from "express";
import { OrderController } from "./order.controller";
import { OrderValidations } from "./order.validation";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), OrderController.getAllOrders);

router.post("/create-order", auth(UserRole.USER), OrderController.createOrder);

router.get("/validate", OrderController.validatePayment);

router.get("/me", auth(UserRole.USER), OrderController.getMyOrders);


router.get(
    "/payments/:paymentId",
    auth(UserRole.USER),
    OrderController.getOrderByPaymentId
);

router.patch(
    "/cancel/:orderId",
    auth(UserRole.USER),
    OrderController.updateOrderStatusByUser
);

router.get("/:orderId", auth(UserRole.USER, UserRole.ADMIN), OrderController.getSingleOrder);

router.patch(
    "/:orderId",
    auth(UserRole.ADMIN),
    validateRequest(OrderValidations.updateOrderStatusByAdminValidationSchema),
    OrderController.updateOrderStatusByAdmin
);

router.delete("/:orderId", auth(UserRole.ADMIN), OrderController.deleteOrder);

router.get("/revenue", OrderController.generateRevenueOfOrders);

export const OrderRoutes = router;
