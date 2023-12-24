import { deleteCartItem } from '../controllers/cartController'
import ApiError from '../errors/ApiError'
import Cart from '../models/cart'
import Product from '../models/product'
import { CartDocument, ProductDocument } from '../types'

export const createCart = async (userId: string): Promise<CartDocument> => {
  let cart = await Cart.findOne({ user: userId })
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [] })
  }
  return cart
}

export const addItem = async (
  cart: CartDocument,
  quantity: number,
  product: ProductDocument
): Promise<CartDocument> => {
  const existingCartItem = cart.products.find(
    (p) => p.product.toString() === product._id.toString()
  )
  if (existingCartItem) {
    existingCartItem.quantity += quantity
  } else {
    cart.products.push({ product: product._id, quantity: quantity })
  }
  await cart.save()

  return cart
}

export const calculateTotalPrice = async (cart: CartDocument) => {
  const total = await Promise.all(
    cart.products.map(async (product) => {
      const productFound = await Product.findById(product.product)
      const price = productFound?.price || 0
      return price * product.quantity
    })
  )
  let totalPrice = total.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  return totalPrice
}

export const updateProductQuantity = async (
  userId: string,
  cartItemId: string,
  updateType: string
) => {
  const cart = await Cart.findOne({ user: userId })
  console.log('🚀 ~ file: cartServices.ts:51 ~ cart:', cart)
  if (!cart) {
    throw ApiError.notFound(`Cart not found`)
  }

  const CartItemIndex = cart.products.findIndex((item) => item.product.toString() === cartItemId)
  console.log('🚀 ~ file: cartServices.ts:57 ~ CartItemIndex:', CartItemIndex)
  if (CartItemIndex === -1) {
    throw ApiError.notFound('Product not found in the cart')
  }

  if (updateType === 'dec' && cart.products[CartItemIndex].quantity === 1) {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId, 'products.product': cartItemId },
      { $pull: { products: { product: cartItemId } } },
      { new: true }
    )
    return updatedCart
  }

  if (updateType === 'inc') {
    cart.products[CartItemIndex].quantity += 1
  } else if (updateType === 'dec') {
    cart.products[CartItemIndex].quantity -= 1
  }

  const updatedCart = await cart.save()

  const totalCount = updatedCart.products.reduce((count, product) => count + product.quantity, 0)

  return { updatedCartItem: cart.products[CartItemIndex], totalCount }
}

export const deleteCart = async (userId: string) => {
  const cart = await Cart.findOneAndDelete({ user: userId })
  if (!cart) {
    throw ApiError.notFound(`Cart not found with the ID: ${userId}`)
  }
  return cart
}
