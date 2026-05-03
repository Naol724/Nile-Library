import mongoose, { Document, Schema } from 'mongoose';

export interface IBorrowedBook extends Document {
  bookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  borrowerName: string;
  borrowerEmail: string;
  studentId?: string;
  phoneNumber?: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned' | 'overdue';
  specialNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const borrowedBookSchema = new Schema<IBorrowedBook>({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  borrowerName: {
    type: String,
    required: [true, 'Borrower name is required'],
    trim: true,
    maxlength: [255, 'Borrower name cannot exceed 255 characters']
  },
  borrowerEmail: {
    type: String,
    required: [true, 'Borrower email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  studentId: {
    type: String,
    trim: true,
    maxlength: [50, 'Student ID cannot exceed 50 characters']
  },
  phoneNumber: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  borrowDate: {
    type: Date,
    required: [true, 'Borrow date is required'],
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(this: IBorrowedBook, value: Date) {
        return value > this.borrowDate;
      },
      message: 'Due date must be after borrow date'
    }
  },
  returnDate: {
    type: Date,
    validate: {
      validator: function(this: IBorrowedBook, value: Date) {
        return !value || value >= this.borrowDate;
      },
      message: 'Return date must be after borrow date'
    }
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  specialNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Special notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Virtual to check if book is overdue
borrowedBookSchema.virtual('isOverdue').get(function(this: IBorrowedBook) {
  return this.status === 'borrowed' && new Date() > this.dueDate;
});

// Virtual for days remaining
borrowedBookSchema.virtual('daysRemaining').get(function(this: IBorrowedBook) {
  if (this.status === 'returned') return 0;
  const today = new Date();
  const diffTime = this.dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Indexes for better performance
borrowedBookSchema.index({ bookId: 1 });
borrowedBookSchema.index({ userId: 1 });
borrowedBookSchema.index({ status: 1 });
borrowedBookSchema.index({ dueDate: 1 });
borrowedBookSchema.index({ borrowDate: -1 });
borrowedBookSchema.index({ borrowerEmail: 1 });

// Auto-update status to overdue if due date passes
borrowedBookSchema.pre('save', function(next: any) {
  if (this.status === 'borrowed' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  next();
});

export const BorrowedBook = mongoose.model<IBorrowedBook>('BorrowedBook', borrowedBookSchema);
