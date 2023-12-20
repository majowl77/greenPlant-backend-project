import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import Product from '../models/product'

type Filter = {
  variants?: string
  sizes?: string
}

interface CustomRequest extends Request {
  filters?: Filter
}

export const filterProductByVariantstoSize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const filters: Filter = {}
  const variants = req.query.variants
  const sizes = req.query.sizes
  if ((variants && typeof variants === 'string') || variants === 'string[]') {
    filters.variants = variants
  }
  if (sizes && typeof sizes === 'string') {
    filters.sizes = sizes
  }
  req.filters = filters
  next()
}

export type SortOrder = 1 | -1

export const getAllProducts = async (req: CustomRequest, res: Response) => {
  const filters = req.filters || {}

  const pageNumber: number = Number(req.query.pageNumber) || 1
  const perPage: number = Number(req.query.perPage) || 4
  const sortField: string = (req.query.sortField as string) || 'price' // Explicitly assert type, we can sort by name or price or other
  const sortOrder: SortOrder = req.query.sortOrder === 'desc' ? -1 : 1
  const sortOptions: { [key: string]: SortOrder } = { [sortField]: sortOrder }
  const search: string = (req.query.search as string) || ''

  try {
    const products = await Product.find(filters)
      .find({ name: { $regex: search, $options: 'i' } })
      .sort(sortOptions)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
      .populate('categories')
    // Use $regex to search for documents where the 'name' field
    // matches the specified pattern (provided by the 'search' variable),
    // and $options: 'i' ensures a case-insensitive match.
    const totalProducts = await Product.countDocuments()
    const totalPages = Math.ceil(totalProducts / perPage)

    res.json({
      pageNumber,
      perPage,
      totalProducts,
      totalPages,
      products,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId

    const product = await Product.findById({
      _id: productId,
    })
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
}

export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, quantity, price, categories, variants, sizes } =
    req.validatedProduct || {}
  const fileName = req.fileName
  try {
    if (!name || !description || !price || !categories) {
      next(ApiError.badRequest('Name, Description, price and category are requried'))
      return
    }

    const product = new Product({
      name,
      description,
      quantity,
      image: `public/images/${fileName}`,
      price,
      categories,
      variants,
      sizes,
    })
    console.log('🚀 ~ file: productController.ts:102 ~ createNewProduct ~ product:', product)

    await product.save()
    res.status(201).json({ product, msg: 'product is created successfully' })
  } catch (error) {
    res.status(400).json({ error, msg: 'product is not created ' })
  }
}

export const deleteProductById = async (req: Request, res: Response) => {
  const productId = req.params.productId

  await Product.deleteOne({
    _id: productId,
  })
  res.status(204).send()
}

export const updateProductById = async (req: Request, res: Response) => {
  // const newName = req.body.name
  // const newDescription = req.body.description
  // const newQuantity = req.body.quantity
  // const newImage = req.body.image
  // const newPrice = req.body.price
  // const newCategory = req.body.category
  // const newVariant = req.body.variants
  // const newSize = req.body.sizes
  const { name, description, quantity, price, categories, variants, sizes } =
    req.validatedProduct || {}
  const productId = req.params.productId
  const fileName = req.fileName

  const newProduct = await Product.findByIdAndUpdate(
    { _id: productId },
    {
      name,
      description,
      quantity,
      image: fileName,
      price,
      categories,
      variants,
      sizes,
    },
    {
      new: true,
    }
  )

  res.json({
    newProduct,
  })
}
