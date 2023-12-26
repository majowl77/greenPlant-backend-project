import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import ApiError from '../errors/ApiError'
import User from '../models/user'
import { generateActivationToken, sendForgotPasswordEmail } from '../utils/email'

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.ForgotPasswordUser

  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    return next(ApiError.notFound("Sorry, we couldn't find any user with that email address"))
  }
  if (existingUser && !existingUser.isActive) {
    return next(
      ApiError.forbidden(
        'Your account is not yet activated. Please activate your account to proceed. '
      )
    )
  }
  const forgotPasswordCode = generateActivationToken()

  try {
    const firstName = existingUser?.firstName

    await User.updateOne({ email }, { forgotPasswordCode })

    await sendForgotPasswordEmail(email, forgotPasswordCode, firstName)

    res.status(201).json({
      msg: "We've send you a link, Check your email to reset your password ",
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong with the forgot password proccess'))
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, forgotPasswordCode } = req.validatedRestPassword
  console.log('🚀 ~ file: passwordController.ts:41 ~ resetPassword ~ newPassword:', password)
  console.log(
    '🚀 ~ file: passwordController.ts:42 ~ resetPassword ~ forgotPasswordCode:',
    forgotPasswordCode
  )
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await User.findOne({ forgotPasswordCode })
    console.log('🚀 ~ file: passwordController.ts:50 ~ resetPassword ~ user:', user)
    if (!user) {
      return res.status(404).json({ msg: "Password couldn't rest" })
    }

    user.password = hashedPassword
    user.forgotPasswordCode = undefined

    await user.save()
    res.status(201).json({
      msg: 'Yay, your password has been changed successfully. ',
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong with the resting the new password proccess'))
  }
}
