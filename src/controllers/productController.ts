import { NextFunction, Request, Response } from 'express'
import Category from '../models/category'

import ApiError from '../errors/ApiError'
import Product from '../models/product'
import { findAllProducts } from '../services/productService'

export type SortOrder = 1 | -1

export const getAllProducts = async (req: Request, res: Response) => {
  let pageNumber: number = Number(req.query.pageNumber) || 1
  console.log('🚀 ~ file: productController.ts:12 ~ getAllProducts ~ pageNumber:', pageNumber)
  const initialPerPage: number = Number(req.query.perPage) || 3
  const perPage: number = initialPerPage
  const sortBy = req.query.sortBy?.toString()
  const category = req.query.category?.toString()
  const searchText = req.query.searchText?.toString() || ''
  try {
    const totalProducts = await Product.countDocuments()

    const totalPages = Math.ceil(totalProducts / perPage)
    pageNumber = Math.min(pageNumber, totalPages)

    let sortQuery = {}
    if (sortBy === 'newest') {
      sortQuery = { createdAt: -1 }
    } else if (sortBy === 'asc') {
      sortQuery = { price: 1 }
    } else if (sortBy === 'desc') {
      sortQuery = { price: -1 }
    }

    const regexSearch = new RegExp(searchText, 'i')

    // Construct the query
    const query: Record<string, any> = {}

    // Add category condition if category is provided and foundCategory is not null
    // if (category && foundCategory) {
    //   query.categories = { $in: [foundCategory._id] }
    // }
    if (category) {
      query.categories = category // Assuming category is the ID
    }
    // Add searchText condition if searchText is provided
    if (searchText) {
      query.name = regexSearch
    }
    const products = await Product.find(query)
      .populate('categories')
      .sort(sortQuery)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
    // .find(category ? { categories: { $in: foundCategory } } : {})
    // .find({ name: { $regex: searchText, $options: 'i' } })
    console.log('Total Products:', totalProducts)
    console.log('Products Returned after Search:', products.length)
    console.log('Calculated Total Pages:', totalPages)
    if (products.length === 0) {
      throw ApiError.notFound('There are no products')
    }

    res.status(200).json({ products, totalPages, pageNumber, totalProducts })
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
