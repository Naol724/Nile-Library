import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { User, Camera, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import AuthModal from '@/components/AuthModal'
import toast from 'react-hot-toast'

const Profile: React.FC = () => {
  const { user, token, updateUser, isAuthenticated } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  const updateMutation = useMutation(
    async (data: typeof formData) => {
      const response = await fetch('http://localhost:5002/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      updateUser(result.user)
      return result
    },
    {
      onSuccess: () => {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile')
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAuthSuccess = () => {
    // Refresh the page after successful authentication
    window.location.reload()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view and manage your profile information.</p>
            <Button onClick={() => setShowAuthModal(true)}>
              Sign In to View Profile
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <Button
              variant={isEditing ? 'secondary' : 'primary'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Edit2 className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.fullName}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Student'}
                </span>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateMutation.isLoading}
                    >
                      {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Full Name</h3>
                      <p className="text-gray-900">{user?.fullName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Email</h3>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Phone Number</h3>
                    <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Address</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">{user?.address || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
