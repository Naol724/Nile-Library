import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware
const authenticateToken = (req: any, res: Response, next: NextFunction): any => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as any;

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all users
router.get('/', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const users = await User.find();
    return res.json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET profile
router.get('/profile', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE user
router.delete('/:id', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;