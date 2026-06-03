import mongoose, { Schema, Document } from 'mongoose'

export interface IArticle extends Document {
  title: string
  content: string
  category: 'nutrition' | 'hygiene' | 'mental-health' | 'mother-child' | 'chronic-disease'
  language: string
  readTime: number
  imageUrl: string
  isVideo: boolean
  videoUrl?: string
  bookmarkedBy: string[]
  createdAt: Date
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['nutrition', 'hygiene', 'mental-health', 'mother-child', 'chronic-disease'], required: true },
    language: { type: String, default: 'en' },
    readTime: { type: Number, default: 5 },
    imageUrl: { type: String, default: '' },
    isVideo: { type: Boolean, default: false },
    videoUrl: { type: String },
    bookmarkedBy: [{ type: String }],
  },
  { timestamps: true },
)

export default mongoose.model<IArticle>('Article', ArticleSchema)
