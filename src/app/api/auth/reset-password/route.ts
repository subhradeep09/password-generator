import { NextRequest, NextResponse } from 'next/server'
import { UserModel, OTPModel } from '@/lib/models'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Verify OTP
    const otpRecord = await OTPModel.findValidOTP(email, otp, 'password_reset')
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Find user
    const user = await UserModel.findByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update user password
    await UserModel.updateById(user._id!.toString(), {
      hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined
    })

    // Mark OTP as used
    await OTPModel.markAsUsed(otpRecord._id!)

    return NextResponse.json({
      message: 'Password reset successfully'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}