/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { OrderServices } from './order.service'

const orderProduct = async (req: Request, res: Response) => {
    try {
        const orderData = req.body

        const result = await OrderServices.orderProductIntoDB(orderData)

        res.status(200).json({
            message: 'Order created successfully',
            status: true,
            data: result,
        })
    } catch (error: any) {
        res.status(404).json({
            message: error.message,
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
                stack: error.stack,
            },
        })
    }
}

const generateRevenueOfOrders = async (req: Request, res: Response) => {
    try {
        const result = await OrderServices.generateOrdersRevenueFromDB()

        res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: result,
        })
    } catch (error: any) {
        res.status(500).json({
            message: 'Failed to calculate revenue',
            status: false,
            error: {
                name: error.name,
                errors: error.errors,
                stack: error.stack,
            },
        })
    }
}

export const orderControllers = {
    orderProduct,
    generateRevenueOfOrders,
}
