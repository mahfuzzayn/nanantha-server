import express from 'express'
import { orderControllers } from './order.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'
import validateRequest from '../../middlewares/validateRequest'
import { orderValidationSchema, OrderValidations } from './order.validation'

const router = express.Router()

router.get('/', auth(USER_ROLE.admin), orderControllers.getAllOrders)

router.get('/:userId', auth(USER_ROLE.user), orderControllers.getUserOrders)

router.post(
    '/',
    auth(USER_ROLE.user),
    validateRequest(orderValidationSchema),
    orderControllers.createOrder,
)

router.patch(
    '/:orderId',
    auth(USER_ROLE.admin),
    orderControllers.updateOrderStatusByAdmin,
)

router.patch(
    '/cancel/:orderId',
    auth(USER_ROLE.user),
    orderControllers.updateOrderStatusByUser,
)

router.delete('/:orderId', auth(USER_ROLE.admin), orderControllers.deleteOrder)

router.post(
    '/create-payment-intent',
    auth(USER_ROLE.user),
    validateRequest(OrderValidations.createPaymentIntentValidationSchema),
    orderControllers.createPaymentIntent,
)

router.get('/revenue', orderControllers.generateRevenueOfOrders)

export const OrderRoutes = router
