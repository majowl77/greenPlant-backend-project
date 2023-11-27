import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import Order from '../models/order'
import User from '../models/user'
import Product from '../models/product'
import products from '../routers/products'
import mongoose, { Types } from 'mongoose'

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

    // for (let productId in products) {
    //    reduceProductQtyByOne(productId, next)
    //  }

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

export const AcceptOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orderId= req.params.orderId


  const order= await Order.findById(orderId)
  if(!order){
   return next(ApiError.badRequest('order is not found'))

  }
  const products= order.products
  // for (products) {
  //      reduceProductQtyByOne(productId, next)
  //    }
  const productId = mongoose.Types.ObjectId.toString()
  products.forEach((objectId) => {
      // Perform some action for each productId
     
      reduceProductQtyByOne(productId, next) ;
    });

    //const orderStatus= 
    // if (productId.> 0) {
    //   const updatedProduct = await Product.findOneAndUpdate(
    //     { _id: productId },
    //     { $inc: { quantity: -1 } },
    //     { new: true }
    //   )
  
      // Update the order status to "accepted"
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: orderId, status: 'pending' },
        { $set: { status: 'accepted' } },
        { new: true }
      );
  
      if (!updatedOrder) {
        return next(ApiError.badRequest('Failed to update order status'));
      }
    
}


export const reduceProductQtyByOne = async (productId:string, next: NextFunction) => {
  try {
    const product = await Product.findById(productId)

    if (!product) {
      next(ApiError.notFound(`Product with ID ${productId} not found.`))
      return
    }

    if (product.quantity > 0) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId },
        { $inc: { quantity: -1 } },
        { new: true }
      )

      // Respond with the updated product
      // You might want to send a response to the client here
    } else {
      next(ApiError.unauthorized(`Product is out of stock.`))
    }
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
