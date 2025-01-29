import express from 'express'
import { cartControllers } from './cart.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../User/user.constant'
import { CartValidations } from './cart.validation'
import validateRequest from '../../middlewares/validateRequest'

const router = express.Router()

router.get(
    '/',
    auth(USER_ROLE.admin),
    cartControllers.getAllCarts,
)

router.get(
    '/:userId',
    auth(USER_ROLE.user, USER_ROLE.admin),
    cartControllers.getSingleCart,
)

router.post(
    '/',
    auth(USER_ROLE.user),
    validateRequest(CartValidations.addItemValidationSchema),
    cartControllers.addItem,
)

router.delete(
    '/',
    auth(USER_ROLE.user),
    validateRequest(CartValidations.removeItemValidationSchema),
    cartControllers.removeItem,
)

router.put(
    '/',
    auth(USER_ROLE.user),
    validateRequest(CartValidations.updateQuantityValidationSchema),
    cartControllers.updateItemQuantity,
)

router.delete(
    '/clear',
    auth(USER_ROLE.user),
    validateRequest(CartValidations.clearCartValidationSchema),
    cartControllers.clearCart,
)

export const CartRoutes = router
