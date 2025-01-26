import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import { ProductRoutes } from './app/modules/product/product.route'
import { OrderRoutes } from './app/modules/order/order.route'
import path from 'path'
import fs from 'fs'
const app: Application = express()

// parser
app.use(express.json())
app.use(cors())

// application routes
app.use('/api/products', ProductRoutes)
app.use('/api/orders', OrderRoutes)

// homepage routes
app.get('/', (req: Request, res: Response) => {
    const filePath = path.join(
        __dirname,
        'app/config',
        'homepage.json',
    )

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error loading homepage data',
                success: false,
                error: err.message,
            })
        }

        const jsonData = JSON.parse(data)
        res.status(200).json(jsonData)
    })
})

export default app
