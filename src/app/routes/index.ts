import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { UserRoutes } from "../modules/user/user.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { OrderRoutes } from "../modules/order/order.route";
import { ProductRoutes } from "../modules/product/product.route";
import { NewsRoutes } from "../modules/news/news.route";
import { ReviewRoutes } from "../modules/review/review.routes";

const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes,
    },
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/carts",
        route: CartRoutes,
    },
    {
        path: "/orders",
        route: OrderRoutes,
    },
    {
        path: "/products",
        route: ProductRoutes,
    },
    {
        path: "/reviews",
        route: ReviewRoutes,
    },
    {
        path: "/news",
        route: NewsRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
