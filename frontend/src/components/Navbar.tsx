import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BookOpen, User, Settings, Library } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-secondary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Library className="h-8 w-8" />
            <span className="font-bold text-xl">NileLibrary</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-secondary-700 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/books"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/books')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-secondary-700 hover:text-white'
              }`}
            >
              Books
            </Link>
            <Link
              to="/borrow"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/borrow')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-secondary-700 hover:text-white'
              }`}
            >
              Borrow
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-secondary-700 hover:text-white'
              }`}
            >
              <User className="h-4 w-4 inline mr-1" />
              Profile
            </Link>
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-secondary-700 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-1" />
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white focus:outline-none focus:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

              </div>
    </nav>
  )
}

export default Navbar
