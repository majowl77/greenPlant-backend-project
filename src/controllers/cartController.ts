import { NextFunction, Request, Response } from 'express'

import Cart from '../models/cart'
import Product from '../models/product'
import ApiError from '../errors/ApiError'
import {
  addItem,
  calculateTotalPrice,
  createCart,
  updateProductQuantity,
} from '../services/cartServices'
import { CartDocument } from '../types'
import { Schema } from 'mongoose'

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedUser.userID
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      throw ApiError.notFound(`Product not found with ID: ${productId}`)
    }

    if (product.quantity === 0) {
      throw ApiError.notFound(`Product is currently out of stock`)
    }

    if (quantity > product.quantity) {
      throw ApiError.notFound(`Oops! The requested quantity exceeds our available stock.`)
    }

    let cart = await createCart(userId)

    cart = await addItem(cart, quantity, product)

    const totalPrice = await calculateTotalPrice(cart)

    res.json({
      message: 'Great choice! Product successfully added to your cart.',
      cart,
      totalPrice,
    })
  } catch (error: any) {
    next(ApiError.badRequest(error.message))
  }
}

export const getCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedUser.userID
    const cart = await Cart.findOne({ user: userId }).populate('products.product')
    console.log('🚀 ~ file: cartController.ts:51 ~ getCartItems ~ cart:', cart)
    if (!cart) {
      throw ApiError.notFound(`Cart not found with userId: ${userId}`)
    }
    const itemsCount = cart.products.reduce((count, product) => count + product.quantity, 0)
    const totalPrice = await calculateTotalPrice(cart)

    res.status(200).json({
      message: 'All cart items returned',
      cartItems: cart.products,
      itemsCount: itemsCount,
      totalPrice: totalPrice,
      cartId: cart._id,
    })
  } catch (error: any) {
    next(ApiError.badRequest(error.message))
  }
}

export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: string = req.decodedUser.userID
    const { productId, updateType } = req.body

    const { updatedCartItem, totalCount } = (await updateProductQuantity(
      userId,
      productId,
      updateType
    )) as {
      updatedCartItem: {
        product: Schema.Types.ObjectId
        quantity: number
      }
      totalCount: number
    }

    res.status(200).json({
      message:
        updateType === 'inc' ? 'Yay, growing your green oasis! 🌱 ' : 'Oops! A bit less magic. 🧙‍♂️',
      updatedCartItem,
      totalCount,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.decodedUser.userID
    const { productId } = req.body
    console.log('🚀 ~ file: cartController.ts:96 ~ deleteCartItem ~ req.body:', req.body)

    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      throw ApiError.notFound(`Cart not found with user ID: ${userId}`)
    }

    const cartItem = cart.products.find((p) => p.product.toString() === productId)

    if (!cartItem) {
      throw ApiError.notFound(`Product with ID: ${productId} is not found in the cart`)
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId, 'products.product': productId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate('products.product')

    res.status(200).json({ meassge: 'Product removed from the cart!😔', updatedCart })
  } catch (error: any) {
    next(ApiError.badRequest(error))
  }
}

export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params

    const cart = await Cart.findOneAndDelete({ user: userId })
    if (!cart) {
      throw ApiError.notFound(`Cart not found with the ID: ${userId}`)
    }

    res.status(200).json({
      message: 'Cart deleted Successfully',
      cart,
    })
  } catch (error: any) {
    next(ApiError.badRequest(error))
  }
}
