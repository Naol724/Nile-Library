import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilter?: (filters: any) => void
  placeholder?: string
  showFilters?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilter, 
  placeholder = "Search books...", 
  showFilters = true 
}) => {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      const timer = setTimeout(() => {
        onSearch(searchQuery)
      }, 300)
      return () => clearTimeout(timer)
    },
    [onSearch]
  )

  useEffect(() => {
    const cleanup = debouncedSearch(query)
    return cleanup
  }, [query, debouncedSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 border-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {showFilters && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-3 bg-gray-50 border-l border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
        )}
        
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors"
        >
          Search
        </button>
      </form>
      
      {isExpanded && onFilter && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="academic">Academic</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">All Books</option>
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="date">Date Added</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
