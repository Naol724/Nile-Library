import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/stores/authStore'
import { BookOpen, Eye, EyeOff, X, Mail, Lock, User } from 'lucide-react'
import { AuthResponse } from '@/types'

const loginSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const registerSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  username: yup.string().required('Username is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  phone: yup.string().optional(),
  address: yup.string().optional(),
})

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login } = useAuthStore()

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({
    resolver: yupResolver(loginSchema),
  })

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm({
    resolver: yupResolver(registerSchema),
  })

  const loginMutation = useMutation<AuthResponse, Error>(
    async (data) => {
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Login failed')
      }
      
      return response.json()
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          login(data.data.token, data.data.user)
          toast.success('Login successful!')
          onClose()
          onSuccess?.()
          resetLogin()
        } else {
          toast.error(data.message || 'Login failed')
        }
      },
      onError: (error: any) => {
        toast.error(error.message || 'Login failed')
      },
    }
  )

  const registerMutation = useMutation(
    async (data: any) => {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      const response = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          password: data.password,
          phone: data.phone,
          address: data.address
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Registration failed')
      }
      
      return response.json()
    },
    {
      onSuccess: (data) => {
        toast.success('Registration successful!')
        login(data.token, data.user)
        onClose()
        onSuccess?.()
        resetRegister()
      },
      onError: (error: any) => {
        toast.error(error.message || 'Registration failed')
      }
    }
  )

  const onLoginSubmit = (data: any) => {
    loginMutation.mutate(data)
  }

  const onRegisterSubmit = (data: any) => {
    registerMutation.mutate(data)
  }

  const handleClose = () => {
    onClose()
    resetLogin()
    resetRegister()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...registerLogin('email')}
                    type="email"
                    className="input pl-10"
                    placeholder="Enter your email"
                  />
                </div>
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...registerLogin('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginMutation.isLoading}
                className="btn btn-primary w-full"
              >
                {loginMutation.isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...registerRegister('fullName')}
                      className="input pl-10"
                      placeholder="Full name"
                    />
                  </div>
                  {registerErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.fullName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...registerRegister('username')}
                      className="input pl-10"
                      placeholder="Username"
                    />
                  </div>
                  {registerErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.username.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...registerRegister('email')}
                    type="email"
                    className="input pl-10"
                    placeholder="Email address"
                  />
                </div>
                {registerErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{registerErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...registerRegister('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {registerErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{registerErrors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...registerRegister('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {registerErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{registerErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...registerRegister('phone')}
                    className="input"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    {...registerRegister('address')}
                    className="input"
                    placeholder="Address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isLoading}
                className="btn btn-primary w-full"
              >
                {registerMutation.isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Demo Credentials:</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-white rounded border border-gray-200">
                  <p className="font-medium text-red-600">Admin</p>
                  <p>Email: admin@library.com</p>
                  <p>Password: admin123</p>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <p className="font-medium text-green-600">Student</p>
                  <p>Email: student@library.com</p>
                  <p>Password: student123</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
