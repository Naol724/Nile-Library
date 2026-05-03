import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { BookOpen, Users, Book, Calendar } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

const Dashboard = () => {
  const { user } = useAuthStore()

  // Mock data for now - in real app, this would come from API
  const stats = {
    totalBooks: 25,
    borrowedBooks: 8,
    availableBooks: 17,
    overdueBooks: 2
  }

  const recentBooks = [
    { id: '1', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', coverImage: '/book1.jpg' },
    { id: '2', title: 'Clean Code', author: 'Robert C. Martin', coverImage: '/book2.jpg' },
    { id: '3', title: 'Database System Concepts', author: 'Abraham Silberschatz', coverImage: '/book3.jpg' },
    { id: '4', title: 'Web Design with HTML, CSS and JavaScript', author: 'Jon Duckett', coverImage: '/book4.jpg' },
    { id: '5', title: 'React Mastery', author: 'Mike Johnson', coverImage: '/book5.jpg' },
    { id: '6', title: 'Python for Everyone', author: 'Jane Smith', coverImage: '/book6.jpg' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Your Online Platform for Educational Books — Anytime, Anywhere.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 border-t-4 border-t-blue-500">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="card p-6 border-t-4 border-t-green-500">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Borrowed Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.borrowedBooks}</p>
              </div>
            </div>
          </div>

          <div className="card p-6 border-t-4 border-t-yellow-500">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Available Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableBooks}</p>
              </div>
            </div>
          </div>

          <div className="card p-6 border-t-4 border-t-red-500">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdueBooks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/books"
              className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              <Book className="h-12 w-12 text-primary-600 mb-4 group-hover:text-primary-700" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Browse Books</h3>
              <p className="text-gray-600">Explore our collection of educational books</p>
            </Link>

            <Link
              to="/borrow"
              className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              <BookOpen className="h-12 w-12 text-primary-600 mb-4 group-hover:text-primary-700" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Borrow Books</h3>
              <p className="text-gray-600">Borrow books for your studies</p>
            </Link>

            <Link
              to="/profile"
              className="card p-6 hover:shadow-lg transition-shadow duration-200 group"
            >
              <Users className="h-12 w-12 text-primary-600 mb-4 group-hover:text-primary-700" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">My Profile</h3>
              <p className="text-gray-600">Manage your account and borrowing history</p>
            </Link>
          </div>
        </div>

        {/* Recent Books */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recently Added Books</h2>
            <Link
              to="/books"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all books →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBooks.map((book) => (
              <div key={book.id} className="card p-4 hover:shadow-lg transition-shadow duration-200">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-4">by {book.author}</p>
                <Link
                  to={`/books/${book.id}`}
                  className="btn btn-primary w-full"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
