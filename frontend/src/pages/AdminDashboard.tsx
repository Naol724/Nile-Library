import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  BarChart3
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import AuthModal from '@/components/AuthModal'

interface DashboardStats {
  totalUsers: number
  totalBooks: number
  borrowedBooks: number
  availableBooks: number
  recentRegistrations: number
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Mock stats data - in real app, this would come from API
  const { data: stats } = useQuery<DashboardStats>(
    'admin-stats',
    async () => {
      const response = await fetch('http://localhost:5002/api/admin/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      return response.json()
    }
  )

  const { data: recentActivity } = useQuery(
    'recent-activity',
    async () => {
      const response = await fetch('http://localhost:5002/api/admin/activity')
      if (!response.ok) {
        throw new Error('Failed to fetch activity')
      }
      return response.json()
    }
  )

  const handleAuthSuccess = () => {
    // Refresh the page after successful authentication
    window.location.reload()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in with an admin account to access the admin dashboard.</p>
            <Button onClick={() => setShowAuthModal(true)}>
              Sign In as Admin
            </Button>
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page. Admin access required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.fullName}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalBooks || 0}</p>
                <p className="text-sm text-gray-600">Total Books</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.borrowedBooks || 0}</p>
                <p className="text-sm text-gray-600">Borrowed Books</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.availableBooks || 0}</p>
                <p className="text-sm text-gray-600">Available Books</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity?.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Button className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Manage Books
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
