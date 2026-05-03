import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { ArrowLeft, Calendar, User, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  isbn: string
  coverImage: string
  quantity: number
  available: number
  status: 'available' | 'borrowed' | 'maintenance'
  addedBy?: string
  createdAt: string
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: book, isLoading, error } = useQuery<Book>(
    ['book', id],
    async () => {
      const response = await fetch(`http://localhost:5002/api/books/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch book')
      }
      return response.json()
    },
    {
      enabled: !!id,
    }
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Book</h2>
          <p className="text-gray-600 mb-4">Please try again later.</p>
          <Button onClick={() => navigate('/books')}>Back to Books</Button>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
          <p className="text-gray-600 mb-4">The book you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/books')}>Back to Books</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-lg text-gray-600 mb-1">by {book.author}</p>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    book.status === 'available' ? 'bg-green-100 text-green-800' :
                    book.status === 'borrowed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {book.status === 'available' ? 'Available' :
                     book.status === 'borrowed' ? 'Borrowed' : 'Maintenance'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{book.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ISBN:</span>
                    <span className="font-medium">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium">{book.available} of {book.quantity}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Book Description and Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </Card>

            {book.status === 'available' && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Borrow This Book</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Borrow Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <Button className="w-full">Borrow Book</Button>
                </div>
              </Card>
            )}

            {book.status === 'borrowed' && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Currently Borrowed</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    This book is currently borrowed and will be available again soon.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
