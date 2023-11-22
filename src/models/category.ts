import mongoose, { Document } from 'mongoose'

export type CategoryDocument = Document & {
  name: string
}

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,'Category required'],
    // UNIQUE INDEX
    unique:[true, 'Category must be unique'],
    minlength:[3,'product title be at least 3 character long'],
    maxlength:[20,'product title be at most 20 character long']
  },

}, {timestamps: true}
);

export default mongoose.model<CategoryDocument>('Category', categorySchema)
