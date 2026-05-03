import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  category?: string;
  isbn?: string;
  description?: string;
  coverImage: string;
  quantity: number;
  available: number;
  status: 'available' | 'borrowed' | 'maintenance';
  addedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [255, 'Author name cannot exceed 255 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters'],
    default: 'General'
  },
  isbn: {
    type: String,
    trim: true,
    maxlength: [50, 'ISBN cannot exceed 50 characters'],
    match: [/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  coverImage: {
    type: String,
    default: 'default-book.jpg'
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 1
  },
  available: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Available quantity cannot be negative'],
    default: 1
  },
  status: {
    type: String,
    enum: ['available', 'borrowed', 'maintenance'],
    default: 'available'
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual to check if book is available for borrowing
bookSchema.virtual('isAvailable').get(function(this: IBook) {
  return this.available > 0 && this.status === 'available';
});

// Indexes for better performance
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ addedBy: 1 });
bookSchema.index({ createdAt: -1 });

// Ensure available doesn't exceed quantity
bookSchema.pre('save', function(next: any) {
  if (this.available > this.quantity) {
    this.available = this.quantity;
  }
  next();
});

export const Book = mongoose.model<IBook>('Book', bookSchema);
