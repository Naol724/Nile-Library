import express, { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Book } from '../models/Book';
import { BorrowedBook } from '../models/BorrowedBook';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware
const authenticateToken = (req: any, res: Response, next: NextFunction): any => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as any;

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// GET all books
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const books = await Book.find();
    return res.json({ success: true, data: books });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET categories
router.get('/categories', async (req: Request, res: Response): Promise<any> => {
  try {
    const categories = await Book.distinct('category');
    return res.json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET book by ID
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// CREATE book
router.post('/', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const book = new Book(req.body);
    await book.save();

    return res.status(201).json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE book
router.put('/:id', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json({ success: true, data: book });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE book
router.delete('/:id', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;