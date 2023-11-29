import z, { ZodError } from 'zod'
import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

export function validateCategory(req: Request, res: Response, next: NextFunction) {
  const schema = z.object({
    name: z
      .string()
      .min(3, { message: 'Category name must at least 3 characters' })
      .max(30, { message: 'Category name must be 20 characters or less' }),
  })

  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      const validationErrorMessages = error.errors.map((error) => error.message)
      next(ApiError.badRequest(`Validation error: ${validationErrorMessages.join(', ')}`))
      return
    }

    // Handle other types of errors
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
