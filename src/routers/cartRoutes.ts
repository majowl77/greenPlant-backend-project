import express from 'express'

import {
  addToCart,
  deleteCart,
  deleteCartItem,
  getCartItems,
  updateCartItemQuantity,
} from '../controllers/cartController'
import { checkAuth } from '../middlewares/checkAuth'
import { validateCart } from '../validation/validateCarts'

const router = express.Router()

router.post('/addToCart', checkAuth, validateCart, addToCart)

router.get('/getUserCartItems', checkAuth, getCartItems)

router.put('/updateQuantity', checkAuth, updateCartItemQuantity)

router.put('/deleteFromCart', checkAuth, deleteCartItem)

router.delete('/deleteCart/:cartId', deleteCart)

export default router
