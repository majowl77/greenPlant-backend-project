import express from 'express'

import { forgotPassword, resetPassword } from '../controllers/passwordController'
import { validatedForgotPasswordUser } from '../validation/validatedForgotPasswordUser'
import { validateResetPassword } from '../validation/validateResetPassword'

const router = express.Router()

router.post('/forgotPassword', validatedForgotPasswordUser, forgotPassword)

router.post('/resetPassword', validateResetPassword, resetPassword)

export default router
