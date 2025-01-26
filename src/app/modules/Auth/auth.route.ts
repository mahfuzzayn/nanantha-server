import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthControllers } from './auth.controller'
import { AuthValidation } from './auth.validation'
import { USER_ROLE } from '../User/user.constant'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser,
)

router.post(
    '/change-password',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    AuthControllers.changePassword,
)

export const AuthRoutes = router
