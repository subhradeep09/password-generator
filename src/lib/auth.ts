// Updated authentication service with API integration

export interface AuthUser {
  id: string
  email: string
  isVerified: boolean
}

export interface SignUpData {
  email: string
  password: string
  otp: string
}

// Send OTP for registration
export async function sendRegistrationOTP(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send OTP')
    }

    return { success: true, message: data.message }
  } catch (error) {
    return { 
      success: false, 
      message: error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Failed to send OTP'
    }
  }
}

// Verify OTP and create account
export async function signUp(signUpData: SignUpData): Promise<{ success: boolean; message: string; user?: AuthUser }> {
  try {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create account')
    }

    return { 
      success: true, 
      message: data.message,
      user: data.user
    }
  } catch (error) {
    return { 
      success: false, 
      message: error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Failed to create account'
    }
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser; token?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to login')
    }

    // Store token and user info
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
    }

    return { 
      success: true, 
      message: data.message,
      user: data.user,
      token: data.token
    }
  } catch (error) {
    return { 
      success: false, 
      message: error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Failed to login'
    }
  }
}

// Send password reset OTP
export async function sendPasswordResetOTP(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send password reset OTP')
    }

    return { success: true, message: data.message }
  } catch (error) {
    return { 
      success: false, 
      message: error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Failed to send password reset OTP'
    }
  }
}

// Reset password with OTP
export async function resetPassword(email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password')
    }

    return { success: true, message: data.message }
  } catch (error) {
    return { 
      success: false, 
      message: error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Failed to reset password'
    }
  }
}

// Sign out
export function signOut(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('vault_key')
  }
}

// Get current user
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('auth_token')
  const userData = localStorage.getItem('user_data')
  
  if (!token || !userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    signOut()
    return null
  }
}