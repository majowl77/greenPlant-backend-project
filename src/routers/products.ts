import express from 'express'
const router = express.Router()

import Product from '../models/product'
import Order from '../models/order'
import ApiError from '../errors/ApiError'
import {
  createNewProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  pagination,
  updateProductById,
} from '../controllers/productController'

router.get('/', getAllProducts, pagination)

router.post('/', async (req, res, next) => {
  const { name, description, quantity, image, price, category, variants, sizes  } = req.body

  if (!name || !description ||!image || !price|| !category  ) {
    next(ApiError.badRequest('Name, Description, image, price and category are requried'))
    return
  }
  const product = new Product({
    name,
    description,
    quantity,
    image,
    price,
    category,
    variants,
    sizes
  })

  await product.save()
  res.status(201).json( product)
})

router.delete('/:productId',async(req,res)=>{
  const productId = req.params.productId

  await Product.deleteOne({
    _id: productId,
  })
  res.status(204).send()
})

router.put('/:productId', async (req, res) => {
  const newName = req.body.name
  const newDescription= req.body.description
  const newQuantity= req.body.quantity
  const newImage= req.body.image
  const newPrice= req.body.price
  const newCategory= req.body.category
  const newVariant= req.body.variants
  const newSize=req.body.sizes
  const productId = req.params.productId

  const newProduct = await Product.findByIdAndUpdate(
    productId,
    { name: newName,
      description: newDescription,
      quantity: newQuantity,
      image:newImage,
      price:newPrice,
      category:newCategory,
      variants: newVariant,
      sizes:newSize },
    {
      new: true,
    }
  )

  res.json({
     newProduct
  })
})
export default router
