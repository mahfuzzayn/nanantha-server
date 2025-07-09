import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../user/user.interface";
import validateRequest from "../../middleware/validateRequest";
import { ReviewValidations } from "./review.validation";

const router = Router();

router.post("/give-review", auth(UserRole.USER), ReviewController.giveReview);

router.get(
    "/me",
    auth(UserRole.USER),
    ReviewController.getMyReviews
);

router.get("/", auth(UserRole.ADMIN), ReviewController.getAllReviews);

router.get(
    "/:reviewId",
    auth(UserRole.USER, UserRole.ADMIN),
    ReviewController.getSingleReview
);

router.patch(
    "/:reviewId/change-visibility",
    auth(UserRole.ADMIN),
    validateRequest(ReviewValidations.changeReviewVisibilityByAdminValidation),
    ReviewController.changeReviewVisibilityByAdmin
);

export const ReviewRoutes = router;
