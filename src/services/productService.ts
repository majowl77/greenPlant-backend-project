import Product from '../models/product'
import Category from '../models/category'
import ApiError from '../errors/ApiError'

//** Service:- Find All Products */
export const findAllProducts = async (
  pageNumber = 1,
  sortBy = '',
  searchText = '',
  category = ''
) => {
  const perPage = 6
  const totalProducts = await Product.countDocuments()
  const totalPages = Math.ceil(totalProducts / perPage)
  const currentPage = Math.min(pageNumber, totalPages)

  let sortQuery = {}
  if (sortBy === 'newest') {
    sortQuery = { createdAt: -1 }
  } else if (sortBy === 'lowestPrice') {
    sortQuery = { price: 1 }
  } else if (sortBy === 'highestPrice') {
    sortQuery = { price: -1 }
  }

  const foundCategory = await Category.findOne({
    name: { $regex: `${category}`, $options: 'i' },
  })

  if (!foundCategory) {
    throw ApiError.notFound('There are no category')
  }
  const findBySearchQuery = (searchText: string, searchKey: string) => {
    return searchText ? { $or: [{ [searchKey]: { $regex: searchText, $options: 'i' } }] } : {}
  }
  const products = await Product.find()
    .populate('reviews')
    .sort(sortQuery)
    .find(findBySearchQuery(searchText, 'name'))
    .find(findBySearchQuery(searchText, 'description'))
    .find(category ? { categories: { $in: foundCategory } } : {})
    .skip((pageNumber - 1) * perPage)
    .limit(perPage)

  if (products.length === 0) {
    throw ApiError.notFound('There are no products')
  }

  return { products, totalPages, currentPage }
}
