import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { UserControllers } from './user.controller'
import { UserValidations } from './user.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'

const router = express.Router()

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUsers)

router.get(
    '/me/:userId',
    auth(USER_ROLE.admin, USER_ROLE.user),
    UserControllers.getMe,
)

router.post(
    '/register-user',
    validateRequest(UserValidations.registerUserValidationSchema),
    UserControllers.registerUser,
)

router.post(
    '/change-status/:id',
    auth(USER_ROLE.admin),
    validateRequest(UserValidations.changeStatusValidationSchema),
    UserControllers.changeStatus,
)

export const UserRoutes = router
