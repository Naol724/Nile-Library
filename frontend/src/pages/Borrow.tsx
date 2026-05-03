import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { Calendar, Book, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/stores/authStore'
import AuthModal from '@/components/AuthModal'
import toast from 'react-hot-toast'

interface BookItem {
  id: string
  title: string
  author: string
  category: string
  coverImage: string
  available: number
  quantity: number
  status: 'available' | 'borrowed'
}

const Borrow: React.FC = () => {
  const { isAuthenticated, token } = useAuthStore()
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null)
  const [borrowDate, setBorrowDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { data: books, isLoading } = useQuery<BookItem[]>(
    'books',
    async () => {
      const response = await fetch('http://localhost:5002/api/books')
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      return response.json()
    }
  )

  const borrowMutation = useMutation(
    async (bookId: string) => {
      const response = await fetch('http://localhost:5002/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId,
          borrowDate,
          dueDate
        })
      })

      if (!response.ok) {
        throw new Error('Failed to borrow book')
      }

      return response.json()
    },
    {
      onSuccess: () => {
        toast.success('Book borrowed successfully!')
        setSelectedBook(null)
        setBorrowDate('')
        setDueDate('')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to borrow book')
      }
    }
  )

  const availableBooks = books?.filter(book => book.status === 'available') || []

  const handleBorrow = () => {
    if (!selectedBook || !borrowDate || !dueDate) {
      toast.error('Please select a book and fill in all dates')
      return
    }

    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    borrowMutation.mutate(selectedBook.id)
  }

  const handleAuthSuccess = () => {
    if (selectedBook && borrowDate && dueDate) {
      borrowMutation.mutate(selectedBook.id)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Borrow Books</h1>
          <p className="text-gray-600 mt-2">Select available books to borrow from our library</p>
          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AlertCircle className="inline h-4 w-4 mr-2" />
                Please sign in to borrow books. You can browse books without authentication, but borrowing requires an account.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book Selection */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Books</h2>
              
              {availableBooks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                  <p>No books are currently available for borrowing.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {availableBooks.map(book => (
                    <div
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedBook?.id === book.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{book.title}</h3>
                          <p className="text-sm text-gray-600">by {book.author}</p>
                          <p className="text-sm text-green-600">
                            {book.available} available
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Borrow Form */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Borrow Details</h2>
              
              {selectedBook ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Selected Book</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedBook.coverImage}
                        alt={selectedBook.title}
                        className="w-20 h-24 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{selectedBook.title}</p>
                        <p className="text-sm text-gray-600">by {selectedBook.author}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Borrow Date
                    </label>
                    <input
                      type="date"
                      value={borrowDate}
                      onChange={(e) => setBorrowDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <Button
                    onClick={handleBorrow}
                    disabled={borrowMutation.isLoading}
                    className="w-full"
                  >
                    {borrowMutation.isLoading ? 'Borrowing...' : 'Borrow Book'}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Book className="h-12 w-12 mx-auto mb-4" />
                  <p>Please select a book to borrow</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default Borrow
