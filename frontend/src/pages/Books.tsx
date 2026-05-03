import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Search, Filter, Grid, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import bookCover1 from '@/assets/images/books/lifeBook.jpg'
import bookCover2 from '@/assets/images/books/magicBig.png'
import bookCover3 from '@/assets/images/categories/DarkSychology.jpeg'
import bookCover4 from '@/assets/images/categories/HumanBrain.jpeg'
import bookCover5 from '@/assets/images/categories/NeuralMind.jpeg'
import bookCover6 from '@/assets/images/categories/Hacker.jpeg'

// Mock data - in real app, this would come from API
const mockBooks = [
  {
    id: '1',
    title: 'Life Book',
    author: 'Various Authors',
    category: 'Self-Help',
    description: 'A comprehensive guide to personal development and growth',
    coverImage: bookCover1,
    quantity: 5,
    available: 3,
    status: 'available' as const
  },
  {
    id: '2',
    title: 'Magic of Thinking Big',
    author: 'George S. Clason',
    category: 'Psychology',
    description: 'A guide to systematic thinking and problem-solving',
    coverImage: bookCover2,
    quantity: 3,
    available: 2,
    status: 'available' as const
  },
  {
    id: '3',
    title: 'Dark Psychology',
    author: 'Robert Greene',
    category: 'Psychology',
    description: 'Understanding human nature and social dynamics',
    coverImage: bookCover3,
    quantity: 4,
    available: 1,
    status: 'available' as const
  },
  {
    id: '4',
    title: 'The Human Brain',
    author: 'David Eagle',
    category: 'Science',
    description: 'A journey into the complexities of the human brain',
    coverImage: bookCover4,
    quantity: 2,
    available: 2,
    status: 'available' as const
  },
  {
    id: '5',
    title: 'Neural Networks',
    author: 'Christopher Bishop',
    category: 'Technology',
    description: 'Pattern recognition and machine learning',
    coverImage: bookCover5,
    quantity: 6,
    available: 4,
    status: 'available' as const
  },
  {
    id: '6',
    title: 'Hacking: The Art of Exploitation',
    author: 'Jon Erickson',
    category: 'Technology',
    description: 'Understanding cybersecurity and ethical hacking',
    coverImage: bookCover6,
    quantity: 3,
    available: 0,
    status: 'borrowed' as const
  }
]

const categories = ['All', 'Self-Help', 'Psychology', 'Science', 'Technology']

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter books based on search and category
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Group books by category
  const booksByCategory = selectedCategory === 'All' 
    ? { 'All': filteredBooks }
    : filteredBooks.reduce((acc, book) => {
        const category = book.category || 'Uncategorized'
        if (!acc[category]) acc[category] = []
        acc[category].push(book)
        return acc
      }, {} as Record<string, typeof mockBooks>)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Library Books</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="flex items-center"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCategory === 'All' ? (
          // Show all books in grid/list view
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredBooks.map(book => (
              <Card key={book.id} hover>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-1">by {book.author}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      book.status === 'available' ? 'bg-green-100 text-green-800' :
                      book.status === 'borrowed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {book.status === 'available' ? 'Available' : 
                       book.status === 'borrowed' ? 'Borrowed' : 'Maintenance'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {book.available} of {book.quantity} available
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{book.description}</p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1">
                      {book.status === 'available' ? 'Borrow' : 'View Details'}
                    </Button>
                    <Button variant="outline" size="sm">
                      {viewMode === 'grid' ? <BookOpen className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Show books grouped by category
          <div className="space-y-8">
            {Object.entries(booksByCategory).map(([category, books]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="h-6 w-6 mr-2" />
                  {category}
                  <span className="text-sm text-gray-500 ml-2">({books.length} books)</span>
                </h2>
                
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                  {books.map(book => (
                    <Card key={book.id} hover>
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                        loading="lazy"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                        <p className="text-gray-600 mb-1">by {book.author}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            book.status === 'available' ? 'bg-green-100 text-green-800' :
                            book.status === 'borrowed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {book.status === 'available' ? 'Available' : 
                             book.status === 'borrowed' ? 'Borrowed' : 'Maintenance'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {book.available} of {book.quantity} available
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{book.description}</p>
                        <div className="flex gap-2">
                          <Button variant="primary" size="sm" className="flex-1">
                            {book.status === 'available' ? 'Borrow' : 'View Details'}
                          </Button>
                          <Button variant="outline" size="sm">
                            {viewMode === 'grid' ? <BookOpen className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Books
