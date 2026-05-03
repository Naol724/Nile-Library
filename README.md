# NileLibrary Management System

A full-stack library management system migrated from PHP/MySQL to React/Node.js/MongoDB.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form handling
- **React Query** for state management

### Backend
- **Node.js** with Express
- **TypeScript**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-validator** for input validation
- **cors** for cross-origin requests

### Database
- **MongoDB Atlas** (cloud-based)
- Connection string: `mongodb+srv://gonfanaol39_db_user:<password>@cluster0.gmbxwiz.mongodb.net/?appName=Cluster0`

## Project Structure

```
modern-library/
├── frontend/                 # React + TypeScript frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript types
│   │   └── config/         # Configuration files
│   ├── package.json
│   └── tsconfig.json
├── shared/                   # Shared types and utilities
├── docs/                     # Documentation
└── README.md
```

## Features

### User Features
- User registration and authentication
- Browse books by category
- Search and filter books
- View book details
- Borrow and return books
- View borrowing history
- Profile management

### Admin Features
- Admin dashboard with statistics
- Book management (CRUD operations)
- User management
- Borrowing system oversight
- Contact message management

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account
- Git

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run the development servers

Detailed setup instructions in each directory's README.

## Migration Status

- [x] Project structure setup
- [ ] Backend API development
- [ ] Frontend components development
- [ ] Database schema design
- [ ] Authentication system
- [ ] Testing and deployment
