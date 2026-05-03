import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

import connectDB from './config/database';
import authRoutes from './routes/auth';
import bookRoutes from './routes/books';
import userRoutes from './routes/users';
import borrowRoutes from './routes/borrow';
import contactRoutes from './routes/contact';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Helper function to find an available port
async function findAvailablePort(startPort: number): Promise<number> {
  const net = require('net');
  
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port;
      server.close(() => resolve(port));
    });
    
    server.on('error', async () => {
      // Port is in use, try the next one
      const nextPort = await findAvailablePort(startPort + 1);
      resolve(nextPort);
    });
  });
}

// Get port with fallback handling
async function getPort(): Promise<number> {
  const envPort = parseInt(process.env.PORT || '');
  const startPort = envPort && !isNaN(envPort) ? envPort : 5000;
  
  try {
    return await findAvailablePort(startPort);
  } catch (error) {
    console.warn(`Could not find an available port starting from ${startPort}, using fallback`);
    return 5002; // Final fallback
  }
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Logging
app.use(limiter); // Rate limiting
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((error: any) => error.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Default error
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start server with port conflict handling
async function startServer() {
  try {
    const port = await getPort();
    
    app.listen(port, () => {
      console.log(`\ud83d\ude80 Server running on port ${port}`);
      console.log(`\ud83c\udf0d Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Log if we had to use a different port than requested
      const envPort = parseInt(process.env.PORT || '');
      const requestedPort = envPort && !isNaN(envPort) ? envPort : 5000;
      if (port !== requestedPort) {
        console.log(`\u26a0\ufe0f Port ${requestedPort} was busy, automatically switched to port ${port}`);
      }
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
