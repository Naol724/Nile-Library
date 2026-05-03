import express from 'express';
import { body, validationResult } from 'express-validator';
import { BorrowedBook } from '../models/BorrowedBook';
import { Book } from '../models/Book';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req: any, res: express.Response, next: express.NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    req.user = decoded;
    next();
    return;
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
    return;
  }
};

// @route   POST /api/borrow
// @desc    Borrow a book
router.post('/', authenticateToken, [
  body('bookId')
    .notEmpty()
    .withMessage('Book ID is required'),
  body('studentId')
    .optional()
    .trim(),
  body('phoneNumber')
    .optional()
    .trim(),
  body('specialNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Special notes cannot exceed 1000 characters')
], async (req: any, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { bookId, studentId, phoneNumber, specialNotes } = req.body;
    const userId = req.user.userId;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.available <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }

    // Check if user already has this book borrowed
    const existingBorrow = await BorrowedBook.findOne({
      bookId,
      userId,
      status: 'borrowed'
    });

    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book'
      });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create borrowed book record
    const borrowedBook = new BorrowedBook({
      bookId,
      userId,
      borrowerName: user.fullName,
      borrowerEmail: user.email,
      studentId,
      phoneNumber,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      specialNotes
    });

    await borrowedBook.save();

    // Update book availability
    book.available -= 1;
    if (book.available === 0) {
      book.status = 'borrowed';
    }
    await book.save();

    const populatedBorrow = await BorrowedBook.findById(borrowedBook._id)
      .populate('bookId', 'title author')
      .populate('userId', 'fullName username');

    return res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: { borrowedBook: populatedBorrow }
    });

  } catch (error: any) {
    console.error('Borrow book error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/borrow
// @desc    Get borrowed books (for current user or all for admin)
router.get('/', authenticateToken, async (req: any, res: express.Response) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let query: any = {};
    
    // Students can only see their own borrowed books
    if (userRole === 'student') {
      query.userId = userId;
    }

    const borrowedBooks = await BorrowedBook.find(query)
      .populate('bookId', 'title author category coverImage')
      .populate('userId', 'fullName username email')
      .sort({ borrowDate: -1 });

    res.json({
      success: true,
      data: { borrowedBooks }
    });

  } catch (error: any) {
    console.error('Get borrowed books error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/borrow/:id/return
// @desc    Return a borrowed book
router.put('/:id/return', authenticateToken, async (req: any, res: express.Response) => {
  try {
    const borrowedBook = await BorrowedBook.findById(req.params.id);

    if (!borrowedBook) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found'
      });
    }

    // Check if user owns this borrow record or is admin
    if (borrowedBook.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (borrowedBook.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book has already been returned'
      });
    }

    // Update borrow record
    borrowedBook.status = 'returned';
    borrowedBook.returnDate = new Date();
    await borrowedBook.save();

    // Update book availability
    const book = await Book.findById(borrowedBook.bookId);
    if (book) {
      book.available += 1;
      if (book.status === 'borrowed' && book.available > 0) {
        book.status = 'available';
      }
      await book.save();
    }

    const populatedBorrow = await BorrowedBook.findById(borrowedBook._id)
      .populate('bookId', 'title author')
      .populate('userId', 'fullName username');

    return res.json({
      success: true,
      message: 'Book returned successfully',
      data: { borrowedBook: populatedBorrow }
    });

  } catch (error: any) {
    console.error('Return book error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/borrow/stats
// @desc    Get borrowing statistics (admin only)
router.get('/stats', authenticateToken, async (req: any, res: express.Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const totalBorrowed = await BorrowedBook.countDocuments();
    const activeBorrowed = await BorrowedBook.countDocuments({ status: 'borrowed' });
    const overdueBooks = await BorrowedBook.countDocuments({ 
      status: 'borrowed', 
      dueDate: { $lt: new Date() } 
    });
    const returnedBooks = await BorrowedBook.countDocuments({ status: 'returned' });

    return res.json({
      success: true,
      data: {
        totalBorrowed,
        activeBorrowed,
        overdueBooks,
        returnedBooks
      }
    });

  } catch (error: any) {
    console.error('Get borrow stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
