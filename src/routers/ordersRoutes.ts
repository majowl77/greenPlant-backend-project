import express from 'express'
const router = express.Router()

import {
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from '../controllers/orderController'

router.get('/', getOrders)

router.get('/:orderId', getOrderById)

router.put('/:orderId', updateOrder)

router.delete('/:orderId', deleteOrder)



export default router
