import express, { Request, Response } from 'express'

import {
  createNewProduct,
  deleteProductById,
  filterProductByVariantstoSize,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'
import uploadImage from '../middlewares/uploadImage'
import { validateProduct } from '../validation/validateProduct'

const router = express.Router()

router.get('/', filterProductByVariantstoSize, getAllProducts)

router.get('/:productId', getProductById)

router.post('/', checkAuth, checkRole('USER'), uploadImage, validateProduct, createNewProduct)

router.put('/:productId', checkAuth, checkRole('ADMIN'), updateProductById)

router.delete('/:productId', checkAuth, checkRole('ADMIN'), deleteProductById)

// i need this later to work on s3 and test it 
// router.post('/upload', uploadImage, (req: Request, res: Response) => {
//   res.json({ msg: 'product is created ' })
// })
//Implement a route to handle GET requests with query parameters for filtering items
//or products based on specific criteria (e.g., by category, price range).

export default router
