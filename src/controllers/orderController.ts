import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import Order from '../models/order'
import User from '../models/user'
import Product from '../models/product'
import products from '../routers/products'
import mongoose, { Types } from 'mongoose'
import { orderStatus } from '../constants'

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

export const addToCart = async (req: Request, res: Response, next: NextFunction) =>{
  //WORKFLOW: 
  //post method i guess
  //the cart is empty array at the begginig 
  // add products (if possible display info) to the cart and quantity of each product default:1
  // calculate the  total price of products
  //when checkout automatically create new order and decrease the products inStock depinding on quantity of each product in the cart 

  //Preparations:
  //create cart model
  
  
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


export const reduceProductQtyByOne = async ( productId:string, next: NextFunction) => {
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
      console.log("yes worked ")
      // Respond with the updated product
      // You might want to send a response to the client here
    } else {
      next(ApiError.unauthorized(`Product is out of stock.`))
    }
  } catch (error: any) {
    next(ApiError.badRequest(error.message))
  }
}
export const acceptOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orderId= req.params.orderId


  const order= await Order.findById(orderId)
  if(!order){
   return next(ApiError.badRequest('order is not found'))
  }
  const products= order.products

  products.forEach((productId ) => {
      // Perform some action for each productId
     const productID = productId.toString()
      reduceProductQtyByOne(productID, next) ;
    });

  
      // Update the order status to "accepted"
      const updatedOrder =await Order.findByIdAndUpdate(orderId, { orderStatus: orderStatus.accepted  },  { new: true }
      )
  
      if (!updatedOrder) {
        return next(ApiError.badRequest('Failed to update order status'));
      }
      else{res.json({ message: 'Order accepted successfully', updatedOrder });}
    
}

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const  updatedStatus = req.body.orderStatus
    const  orderId = req.params.orderId

    const order= await Order.findById(orderId)
    if(!order){
     return next(ApiError.badRequest('order is not found'))
    }
    
    console.log(order)
    const currentStatus = order.orderStatus;

    if (currentStatus !== orderStatus.accepted) {
      return res.status(400).json({ message: 'you should accept order first' });
    }

    const newOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: updatedStatus },{new: true})

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
