import express from 'express'
import { orderControllers } from './order.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'
import validateRequest from '../../middlewares/validateRequest'
import { orderValidationSchema, OrderValidations } from './order.validation'

const router = express.Router()

router.post(
    '/',
    auth(USER_ROLE.user),
    validateRequest(orderValidationSchema),
    orderControllers.orderProduct,
)

router.post(
    '/create-payment-intent',
    auth(USER_ROLE.user),
    validateRequest(OrderValidations.createPaymentIntentValidationSchema),
    orderControllers.createPaymentIntent,
)

router.get('/revenue', orderControllers.generateRevenueOfOrders)

export const OrderRoutes = router
