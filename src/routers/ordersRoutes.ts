import express from 'express'

import {
  acceptOrder,
  addNewOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'

const router = express.Router()

// ---- Admin routes ---- Private routes------
router.get('/', checkAuth, checkRole('ADMIN'), getOrders)

router.put('/admin/orders/updatestatus/:orderId', checkAuth, checkRole('ADMIN'), updateOrderStatus)

router.put('/admin/orders/:orderId', checkAuth, checkRole('ADMIN'), acceptOrder)

router.delete('/:orderId', checkAuth, checkRole('ADMIN'), deleteOrder)

router.get('/:orderId', getOrderById)

router.post('/createNewOrder', addNewOrder)

export default router
