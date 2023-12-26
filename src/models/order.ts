import mongoose, { Document } from 'mongoose'

import { OrderDocument } from '../types'
import { orderStatus } from '../constants'

// Orders: id, productId, userId, purchasedAt

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    purchasedAt: {
      type: Date,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: orderStatus, //order statuses
      default: 'pending',
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model<OrderDocument>('Order', orderSchema)
