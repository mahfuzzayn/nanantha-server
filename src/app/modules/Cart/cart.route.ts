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
    validateRequest(CartValidations.addItemSchema),
    cartControllers.addItem,
)

router.delete(
    '/',
    auth(USER_ROLE.user),
    validateRequest(CartValidations.removeItemSchema),
    cartControllers.removeItem,
)

router.put(
    '/',
    auth(USER_ROLE.user),
    validateRequest(CartValidations.updateQuantitySchema),
    cartControllers.updateItemQuantity,
)

router.delete(
    '/clear',
    auth(USER_ROLE.user),
    validateRequest(CartValidations.clearCartSchema),
    cartControllers.clearCart,
)

export const CartRoutes = router
