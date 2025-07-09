import express from "express";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";
import { UserRole } from "./user.interface";
import { UserControllers } from "./user.controller";
import { UserValidations } from "./user.validation";
import multer from "multer";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middleware/bodyParse";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), UserControllers.getAllUsers);

router.get(
    "/me",
    auth(UserRole.ADMIN, UserRole.USER),
    UserControllers.getMe
);

router.post(
    "/register-user",
    validateRequest(UserValidations.registerUserValidationSchema),
    UserControllers.registerUser
);

router.patch(
    "/update-profile",
    auth(UserRole.ADMIN, UserRole.USER),
    multerUpload.single("image"),
    parseBody,
    validateRequest(UserValidations.updateUserValidationSchema),
    UserControllers.updateUser
);

router.patch(
    "/change-status/:userId",
    auth(UserRole.ADMIN),
    validateRequest(UserValidations.changeStatusValidationSchema),
    UserControllers.changeStatus
);

export const UserRoutes = router;
