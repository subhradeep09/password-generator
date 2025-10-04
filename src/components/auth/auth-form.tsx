'use client'

import { useState } from 'react'
import { signIn, sendRegistrationOTP, signUp, sendPasswordResetOTP, resetPassword } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'

type FormMode = 'login' | 'register' | 'otp-verification' | 'forgot-password' | 'reset-password'

export function AuthForm() {
  const [mode, setMode] = useState<FormMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      switch (mode) {
        case 'login':
          const loginResult = await signIn(formData.email, formData.password)
          if (loginResult.success) {
            toast.success('Welcome back!')
            window.location.href = '/vault'
          } else {
            toast.error(loginResult.message)
          }
          break

        case 'register':
          if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
          }
          const otpResult = await sendRegistrationOTP(formData.email)
          if (otpResult.success) {
            toast.success('OTP sent to your email!')
            setMode('otp-verification')
          } else {
            toast.error(otpResult.message)
          }
          break

        case 'otp-verification':
          const signUpResult = await signUp({
            email: formData.email,
            password: formData.password,
            otp: formData.otp
          })
          if (signUpResult.success) {
            toast.success('Account created successfully!')
            setMode('login')
            setFormData(prev => ({ ...prev, otp: '', password: '', confirmPassword: '' }))
          } else {
            toast.error(signUpResult.message)
          }
          break

        case 'forgot-password':
          const forgotResult = await sendPasswordResetOTP(formData.email)
          if (forgotResult.success) {
            toast.success('Password reset code sent to your email!')
            setMode('reset-password')
          } else {
            toast.error(forgotResult.message)
          }
          break

        case 'reset-password':
          const resetResult = await resetPassword(formData.email, formData.otp, formData.password)
          if (resetResult.success) {
            toast.success('Password reset successfully!')
            setMode('login')
            setFormData({ email: '', password: '', confirmPassword: '', otp: '' })
          } else {
            toast.error(resetResult.message)
          }
          break
      }
    } catch (error) {
      toast.error(error && typeof error === 'object' && 'message' in error ? String(error.message) : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In'
      case 'register': return 'Create Account'
      case 'otp-verification': return 'Verify Email'
      case 'forgot-password': return 'Forgot Password'
      case 'reset-password': return 'Reset Password'
      default: return 'SecureVault'
    }
  }

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Welcome back to SecureVault'
      case 'register': return 'Start securing your passwords today'
      case 'otp-verification': return `Enter the 6-digit code sent to ${formData.email}`
      case 'forgot-password': return 'Enter your email to receive a reset code'
      case 'reset-password': return 'Enter the code and your new password'
      default: return 'Your privacy-first password manager'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg w-full">
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          {(mode === 'otp-verification' || mode === 'reset-password') && (
            <button
              onClick={() => setMode(mode === 'otp-verification' ? 'register' : 'forgot-password')}
              className="mr-2 sm:mr-3 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
          )}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {getTitle()}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {getSubtitle()}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Email Field */}
        {(mode === 'login' || mode === 'register' || mode === 'forgot-password' || mode === 'reset-password') && (
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="your@email.com"
                className="pl-10"
                disabled={mode === 'reset-password'}
              />
            </div>
          </div>
        )}

        {/* OTP Field */}
        {(mode === 'otp-verification' || mode === 'reset-password') && (
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              value={formData.otp}
              onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
              required
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
          </div>
        )}

        {/* Password Field */}
        {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
          <div>
            <Label htmlFor="password">
              {mode === 'reset-password' ? 'New Password' : 'Password'}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Your secure password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Confirm Password Field */}
        {(mode === 'register' || mode === 'reset-password') && (
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                placeholder="Confirm your password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : 
           mode === 'login' ? 'Sign In' :
           mode === 'register' ? 'Send Verification Code' :
           mode === 'otp-verification' ? 'Create Account' :
           mode === 'forgot-password' ? 'Send Reset Code' :
           'Reset Password'}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        {mode === 'login' && (
          <>
            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
            >
              Forgot your password?
            </button>
            <div>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Don&apos;t have an account? Sign up
              </button>
            </div>
          </>
        )}

        {(mode === 'register' || mode === 'forgot-password') && (
          <button
            type="button"
            onClick={() => setMode('login')}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Already have an account? Sign in
          </button>
        )}

        {mode === 'otp-verification' && (
          <button
            type="button"
            onClick={() => sendRegistrationOTP(formData.email)}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Didn&apos;t receive code? Resend
          </button>
        )}

        {mode === 'reset-password' && (
          <button
            type="button"
            onClick={() => sendPasswordResetOTP(formData.email)}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Didn&apos;t receive code? Resend
          </button>
        )}
      </div>
    </div>
  )
}