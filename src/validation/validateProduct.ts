import { NextFunction, Request, Response } from 'express'
import zod, { ZodError } from 'zod'

import ApiError from '../errors/ApiError'

export function validateProduct(req: Request, res: Response, next: NextFunction) {
  const isUpdated = req.method === 'PUT'
  const schema = zod.object({
    name: isUpdated ? zod.string().min(3).max(100).optional() : zod.string().min(3).max(100),
    description: isUpdated
      ? zod
          .string()
          .min(10, { message: 'Product description must at least 3 characters' })
          .max(400, { message: 'Product description must be 400 characters or less' })
          .optional()
      : zod
          .string()
          .min(10, { message: 'Product description must at least 3 characters' })
          .max(400, { message: 'Product description must be 400 characters or less' }),
    quantity: isUpdated
      ? zod.preprocess((val) => {
          if (typeof val === 'string') {
            return Number(val.replace(/^['"]|['"]$/g, ''))
          }
          return val
        }, zod.number().nonnegative({ message: 'Quantity must be nonnegative number' }).optional())
      : zod.preprocess((val) => {
          if (typeof val === 'string') {
            return Number(val.replace(/^['"]|['"]$/g, ''))
          }
          return val
        }, zod.number().nonnegative({ message: 'Quantity must be nonnegative number' })),
    price: isUpdated
      ? zod.preprocess((val) => {
          if (typeof val === 'string') {
            return Number(val.replace(/^['"]|['"]$/g, ''))
          }
          return val
        }, zod.number().nonnegative({ message: 'Product price must be nonnegative number' }).optional())
      : zod.preprocess((val) => {
          if (typeof val === 'string') {
            return Number(val.replace(/^['"]|['"]$/g, ''))
          }
          return val
        }, zod.number().nonnegative({ message: 'Product price must be nonnegative number' })),
    categories: isUpdated
      ? zod.array(zod.string()).min(1, { message: 'Please enter at least one variant' }).optional()
      : zod.array(zod.string()).min(1, { message: 'Please enter at least one category' }),

    variants: isUpdated
      ? zod.preprocess((val) => {
          if (typeof val === 'string') {
            return JSON.parse(val.replace(/^['"]|['"]$/g, ''))
          }
          return val
        }, zod.array(zod.string()).min(1, { message: 'Please enter at least one size' }).optional())
      : zod.preprocess((val) => {
          if (typeof val === 'string') {
            return JSON.parse(val.replace(/^['"]|['"]$/g, ''))
          }
          return val
        }, zod.array(zod.string()).min(1, { message: 'Please enter at least one size' })),
    sizes: isUpdated
      ? zod.preprocess((val) => {
          if (typeof val === 'string') {
            return JSON.parse(val.replace(/^['"]|['"]$/g, ''))
          }
          return val
        }, zod.array(zod.string()).min(1, { message: 'Please enter at least one size' }).optional())
      : zod.preprocess((val) => {
          if (typeof val === 'string') {
            return JSON.parse(val)
          }
          return val
        }, zod.array(zod.string()).min(1, { message: 'Please enter at least one size' })),
  })

  try {
    const validatedProduct = schema.parse(req.body)
    req.validatedProduct = validatedProduct
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
