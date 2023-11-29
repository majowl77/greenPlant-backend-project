import mongoose, { Document } from 'mongoose'
import { orderStatus } from './constants'

export type OrderStatus = keyof typeof orderStatus
export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
  userId: mongoose.Schema.Types.ObjectId
  orderStatus: OrderStatus
}

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}
