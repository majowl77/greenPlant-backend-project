import { NextFunction, Request, Response } from 'express'

import Order from '../models/order'
import User from '../models/user'

export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find()
  res.json(orders)
}

export const getOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params
  const order = await Order.findById(orderId)
  res.json(order)
}

export const addNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { name, products, userId } = req.body

  const order = new Order({
    name,
    products,
    userId,
    purchasedAt: new Date(),
  })
  console.log('orderId:', order._id)

  const user = new User({
    name: 'Walter',
    order: order._id,
  })

  await order.save()
  await user.save()
  res.json(order)
}

export const updateOrder = (req: Request, res: Response) => {
  const { orderId, newProducts } = req.body

  const newOrder = Order.findByIdAndUpdate(orderId, { products: newProducts })

  res.status(201).json(newOrder)
}

export const deleteOrder = (req: Request, res: Response) => {
  const { orderId } = req.body

  const deletedOrder = Order.findOneAndDelete(orderId)

  res.status(201).json(deletedOrder)
}
