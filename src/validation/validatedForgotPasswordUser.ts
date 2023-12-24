import z, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validatedForgotPasswordUser(req: Request, res: Response, next: NextFunction) {
  const schema = z.object({
    email: z.string().email(),
  })

  try {
    const validatedForgotPasswordUser = schema.parse(req.body)

    req.ForgotPasswordUser = validatedForgotPasswordUser
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
