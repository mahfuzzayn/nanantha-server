import express from 'express'
import { orderControllers } from './order.controller'
const router = express.Router()

router.post('/', orderControllers.orderProduct)

router.get('/revenue', orderControllers.generateRevenueOfOrders)

export const OrderRoutes = router
