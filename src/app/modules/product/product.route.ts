import express, { NextFunction, Request, Response } from 'express'
import { productControllers } from './product.controller'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

router.post(
    '/',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    productControllers.createProduct,
)

router.get('/', productControllers.getAllProducts)

router.get('/:productId', productControllers.getSingleProduct)

router.put('/:productId', productControllers.updateProduct)

router.delete('/:productId', productControllers.deleteProduct)

export const ProductRoutes = router
