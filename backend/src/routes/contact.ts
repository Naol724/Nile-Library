import express from 'express';
import { body, validationResult } from 'express-validator';
import { ContactMessage } from '../models/ContactMessage';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT token (optional for contact form)
const authenticateToken = (req: any, res: express.Response, next: express.NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    req.user = null; // Allow anonymous contact submissions
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null; // Allow anonymous contact submissions even with invalid token
    next();
  }
};

// @route   POST /api/contact
// @desc    Submit a contact message
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, message } = req.body;

    // Create contact message
    const contactMessage = new ContactMessage({
      name,
      email,
      message
    });

    await contactMessage.save();

    return res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: { contactMessage }
    });

  } catch (error: any) {
    console.error('Submit contact error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin only)
router.get('/', authenticateToken, async (req: any, res: express.Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    // Build query
    let query: any = {};
    if (status && ['new', 'read', 'replied'].includes(status)) {
      query.status = status;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactMessage.countDocuments(query);

    return res.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error: any) {
    console.error('Get contact messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact message status (admin only)
router.put('/:id/status', authenticateToken, [
  body('status')
    .isIn(['new', 'read', 'replied'])
    .withMessage('Status must be new, read, or replied')
], async (req: any, res: express.Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;
    const messageId = req.params.id;

    const message = await ContactMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    message.status = status;
    await message.save();

    return res.json({
      success: true,
      message: 'Contact message status updated successfully',
      data: { message }
    });

  } catch (error: any) {
    console.error('Update contact status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a contact message (admin only)
router.delete('/:id', authenticateToken, async (req: any, res: express.Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });

  } catch (error: any) {
    console.error('Delete contact message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/contact/stats
// @desc    Get contact message statistics (admin only)
router.get('/stats', authenticateToken, async (req: any, res: express.Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const totalMessages = await ContactMessage.countDocuments();
    const newMessages = await ContactMessage.countDocuments({ status: 'new' });
    const readMessages = await ContactMessage.countDocuments({ status: 'read' });
    const repliedMessages = await ContactMessage.countDocuments({ status: 'replied' });

    return res.json({
      success: true,
      data: {
        totalMessages,
        newMessages,
        readMessages,
        repliedMessages
      }
    });

  } catch (error: any) {
    console.error('Get contact stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
