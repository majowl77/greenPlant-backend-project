import z, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validateResetPassword(req: Request, res: Response, next: NextFunction) {
  const schema = z.object({
    password: z.string().min(8),
    forgotPasswordCode: z.string(),
  })

  try {
    const validatedResetPassword = schema.parse(req.body)
    req.validatedRestPassword = validatedResetPassword
    next()
  } catch (error) {
    const err = error
    if (err instanceof ZodError) {
      next(ApiError.badRequestValidation(err.errors))
      return
    }
    next(ApiError.internal('Something went wrong'))
  }
}
