import ApiError from '../errors/ApiError'
import Product from '../models/product'
import { NextFunction, Request, Response } from 'express'

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const pageNumber: number = Number(req.query.pageNumber) || 1
  const perPage: number = Number(req.query.perPage) || 2

  const products = await Product.find()
    .skip((pageNumber - 1) * perPage)
    .limit(perPage)
    .populate('category')

  const totalProducts = await Product.countDocuments()
  const totalPage = Math.ceil(totalProducts / perPage)

  res.json({
    pageNumber,
    perPage,
    totalProducts,
    totalPage,
    products,
  })
}

export const getProductById = async (req: Request, res: Response) => {
  const productId = req.params.productId

  const product = await Product.findById({
    _id: productId,
  })
  res.status(200).json(product)
}

export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, quantity, image, price, category, variants, sizes } = req.body

  if (!name || !description || !image || !price || !category) {
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
    sizes,
  })

  await product.save()
  res.status(201).json(product)
}

export const deleteProductById = async (req: Request, res: Response) => {
  const productId = req.params.productId

  await Product.deleteOne({
    _id: productId,
  })
  res.status(204).send()
}

export const updateProductById = async (req: Request, res: Response) => {
  const newName = req.body.name
  const newDescription = req.body.description
  const newQuantity = req.body.quantity
  const newImage = req.body.image
  const newPrice = req.body.price
  const newCategory = req.body.category
  const newVariant = req.body.variants
  const newSize = req.body.sizes
  const productId = req.params.productId

  const newProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name: newName,
      description: newDescription,
      quantity: newQuantity,
      image: newImage,
      price: newPrice,
      category: newCategory,
      variants: newVariant,
      sizes: newSize,
    },
    {
      new: true,
    }
  )

  res.json({
    newProduct,
  })
}

export const pagination = async (req: Request, res: Response, next: NextFunction) => {}
