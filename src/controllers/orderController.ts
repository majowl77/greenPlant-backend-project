import { NextFunction, Request, Response } from 'express'

import Order from '../models/order'
import User from '../models/user'


export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find().populate('products')
  res.json(orders)
}

export const addNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { name, products } = req.body

  const order = new Order({
    name,
    products,
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