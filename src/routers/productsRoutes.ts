import express from 'express'

import {
  createNewProduct,
  deleteProductById,
  getAllAdminProducts,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'
import uploadImage from '../middlewares/uploadImage'
import uploadImageS3 from '../middlewares/uploadImageToS3'
import { validateProduct } from '../validation/validateProduct'

const router = express.Router()

router.get('/', getAllProducts)

router.get('/admin', getAllAdminProducts)

router.get('/:productId', getProductById)

router.post('/', checkAuth, checkRole('ADMIN'), uploadImageS3, validateProduct, createNewProduct)

router.put(
  '/:productId',
  checkAuth,
  checkRole('ADMIN'),
  uploadImageS3,
  validateProduct,
  updateProductById
)

router.delete('/deleteProduct/:productId', checkAuth, checkRole('ADMIN'), deleteProductById)

// i need this later to work on s3 and test it

export default router
