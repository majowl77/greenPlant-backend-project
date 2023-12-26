import { NextFunction, Request, Response } from 'express'

import Cart from '../models/cart'
import ApiError from '../errors/ApiError'
import Order from '../models/order'
import { orderStatus } from '../constants'
import product from '../models/product'
import { deleteCart } from '../services/cartServices'

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find().populate('products.product')
    res.status(200).json(orders)
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
    if (!order) {
      return next(ApiError.notFound('The order cannot be found'))
    }
    res.status(200).json(order)
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const addNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cartId } = req.body

    const cart = await Cart.findById({ _id: cartId })
    if (!cart) {
      return next(ApiError.notFound("Can't checkout, this user dosen't have a cart "))
    }

    const { user, products } = cart

    const order = new Order({
      user: user,
      purchasedAt: new Date(),
      orderStatus: orderStatus.pending,
      products: products,
    })

    await order.save()

    const deletedCart = await deleteCart(user)
    res.status(201).json({
      order,

      message:
        'Success! Your order has been received and is now being processed. Thank you for choosing us!',
    })
  } catch (error: any) {
    next(ApiError.badRequest(error.message))
  }
}

export const acceptOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.orderId

  const order = await Order.findById(orderId)
  if (!order) {
    return next(ApiError.badRequest('order is not found'))
  }
  const products = order.products

  products.forEach((productId) => {
    // Perform some action for each productId
    const productID = productId.toString()
  })

  // Update the order status to "accepted"
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: orderStatus.accepted },
    { new: true }
  )

  if (!updatedOrder) {
    return next(ApiError.badRequest('Failed to update order status'))
  } else {
    res.json({ message: 'Order accepted successfully', updatedOrder })
  }
}

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.orderId

    const order = await Order.findById(orderId)
    if (!order) {
      return next(ApiError.badRequest('order is not found'))
    }

    console.log(order)
    let currentStatus = order.orderStatus

    if (currentStatus === orderStatus.pending) {
      currentStatus = orderStatus.accepted
    } else if (currentStatus === orderStatus.accepted) {
      currentStatus = orderStatus.shipped
    } else {
      currentStatus = orderStatus.delivered
    }
    const newOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: currentStatus },
      { new: true }
    )

    res.status(201).json({
      newOrder,
      msg: 'order status has changed check it out ',
    })
  } catch (error: any) {
    next(ApiError.notFound(error.message))
  }
}

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params

    await Order.deleteOne({ _id: orderId })
    res.status(204).send()
  } catch (error: any) {
    next(ApiError.badRequest("Order Id is invailed or ca't delete the order"))
  }
}
