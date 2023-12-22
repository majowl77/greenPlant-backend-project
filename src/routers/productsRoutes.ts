import express from 'express'

import {
  createNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'
import uploadImage from '../middlewares/uploadImage'
import { validateProduct } from '../validation/validateProduct'

const router = express.Router()

router.get('/', getAllProducts)

router.get('/:productId', getProductById)

router.post('/', checkAuth, checkRole('ADMIN'), uploadImage, validateProduct, createNewProduct)

router.put(
  '/:productId',
  checkAuth,
  checkRole('ADMIN'),
  uploadImage,
  validateProduct,
  updateProductById
)

router.delete('/deleteProduct/:productId', checkAuth, checkRole('ADMIN'), deleteProductById)

// i need this later to work on s3 and test it
// router.post('/upload', uploadImage, (req: Request, res: Response) => {
//   res.json({ msg: 'product is created ' })
// })

export default router
