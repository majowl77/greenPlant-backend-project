import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import Order from '../models/order'
import User from '../models/user'

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find()
    res.json(orders)
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
    res.json(order)
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const addNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { products, userId } = req.body

    const order = new Order({
      products,
      userId,
      purchasedAt: new Date(),
    })

    await order.save()
    res.json(order)
  } catch (error: any) {
    next(ApiError.badRequest(error.message))
  }
}

export const updateOrder = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, newProducts } = req.body

    const newOrder = Order.findByIdAndUpdate(orderId, { products: newProducts })

    res.status(201).json(newOrder)
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const deleteOrder = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.body

      const deletedOrder = Order.findOneAndDelete(orderId)

      res.status(201).json(deletedOrder)
    } catch (error: any) {
      next(ApiError.notFound(error.message))
    }
}
