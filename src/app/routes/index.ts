import { Router } from 'express'
import { ProductRoutes } from '../modules/Product/product.route'
import { OrderRoutes } from '../modules/Order/order.route'
import { UserRoutes } from '../modules/User/user.route'
import { AuthRoutes } from '../modules/Auth/auth.route'
import { CartRoutes } from '../modules/Cart/cart.route'

const router = Router()

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/products',
        route: ProductRoutes,
    },
    {
        path: '/orders',
        route: OrderRoutes,
    },
    {
        path: '/carts',
        route: CartRoutes,
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router
