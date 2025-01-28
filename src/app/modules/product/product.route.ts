import express, { NextFunction, Request, Response } from 'express'
import { productControllers } from './product.controller'
import { upload } from '../../utils/sendImageToCloudinary'
import { ProductValidations } from './product.validation'
import validateRequest from '../../middlewares/validateRequest'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'

const router = express.Router()

router.post(
    '/create-product',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(ProductValidations.createProductValidationSchema),
    productControllers.createProduct,
)

router.get('/', productControllers.getAllProducts)

router.get('/:productId', productControllers.getSingleProduct)

router.patch(
    '/:productId',
    auth(USER_ROLE.admin),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        next()
    },
    validateRequest(ProductValidations.updateProductValidationSchema),
    productControllers.updateProduct,
)

router.delete(
    '/:productId',
    auth(USER_ROLE.admin),
    productControllers.deleteProduct,
)

export const ProductRoutes = router
