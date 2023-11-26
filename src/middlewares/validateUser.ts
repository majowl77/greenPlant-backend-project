import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'
import ApiError from '../errors/ApiError'
export function ValidateUser(req: Request, res: Response, next: NextFunction) {
  // Zod schema for user data validation
  const userSchemaValidator = z.object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8),
  })
  try {
    userSchemaValidator.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      next(ApiError.badRequest('Invalid user data. Please check your input.'))
      return
    }
    // Handle other types of errors here...
    next(ApiError.internal('Something went wrong while creating the user.'))
  }
}
