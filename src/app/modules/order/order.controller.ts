/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { OrderServices } from './order.service'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'
import Stripe from 'stripe'
import catchAsync from '../../utils/catchAsync'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const orderProduct = catchAsync(async (req, res) => {
    const { order: orderData } = req.body
    
    const result = await OrderServices.orderProductIntoDB(orderData)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Order created successfully',
        data: result,
    })
})

const createPaymentIntent = catchAsync(async (req, res) => {
    const { amount, currency } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency || 'usd',
        payment_method_types: ['card'],
    })

    const result = { clientSecret: paymentIntent.client_secret }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment intent created successfully',
        data: result,
    })
})

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
    createPaymentIntent,
}
