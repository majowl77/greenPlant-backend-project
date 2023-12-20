import z, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validateCategory(req: Request, res: Response, next: NextFunction) {
  const isUpdated = req.method === 'PUT'
  const schema = z.object({
    name: isUpdated
      ? z
          .string()
          .min(3, { message: 'Category name must at least 3 characters' })
          .max(20, { message: 'Category name must be 20 characters or less' })
      : z
          .string()
          .min(3, { message: 'Category name must at least 3 characters' })
          .max(20, { message: 'Category name must be 20 characters or less' }),
  })

  try {
    const validatedCategory = schema.parse(req.body)
    console.log(
      '🚀 ~ file: validateCategory.ts:22 ~ validateCategory ~ validatedCategory:',
      validatedCategory
    )
    req.validatedCategory = validatedCategory
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
