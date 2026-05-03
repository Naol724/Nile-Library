import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'

// Layout and Components
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Pages
import Dashboard from '@/pages/Dashboard'
import Books from '@/pages/Books'
import BookDetail from '@/pages/BookDetail'
import Borrow from '@/pages/Borrow'
import Profile from '@/pages/Profile'
import AdminDashboard from '@/pages/AdminDashboard'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})


function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="books/:id" element={<BookDetail />} />
            <Route path="borrow" element={<Borrow />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<AdminDashboard />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
