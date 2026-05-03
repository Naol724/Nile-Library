export interface User {
  id: string
  fullName: string
  username: string
  email: string
  role: 'student' | 'admin'
  profileImage?: string
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface Book {
  _id: string
  title: string
  author: string
  category?: string
  isbn?: string
  description?: string
  coverImage: string
  quantity: number
  available: number
  status: 'available' | 'borrowed' | 'maintenance'
  addedBy?: User
  createdAt: string
  updatedAt: string
  isAvailable?: boolean
}

export interface BorrowedBook {
  _id: string
  bookId: Book
  userId: User
  borrowerName: string
  borrowerEmail: string
  studentId?: string
  phoneNumber?: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: 'borrowed' | 'returned' | 'overdue'
  specialNotes?: string
  createdAt: string
  updatedAt: string
  isOverdue?: boolean
  daysRemaining?: number
}

export interface ContactMessage {
  _id: string
  name: string
  email: string
  message: string
  status: 'new' | 'read' | 'replied'
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: User
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: any[]
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  data: {
    [key: string]: T | PaginationData
  }
}
