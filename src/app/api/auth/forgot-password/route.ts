import { NextRequest, NextResponse } from 'next/server'
import { UserModel, OTPModel } from '@/lib/models'
import { generateOTP, sendEmail, getPasswordResetOTPEmail } from '@/lib/email'
import { isValidEmail } from '@/lib/helpers'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await UserModel.findByEmail(email)
    if (!user) {
      // Don't reveal whether email exists or not for security
      return NextResponse.json({
        message: 'If an account with this email exists, you will receive a password reset code'
      })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP to database
    await OTPModel.create({
      email,
      otp,
      type: 'password_reset',
      expiresAt,
      used: false
    })

    // Send OTP email
    const emailTemplate = getPasswordResetOTPEmail(otp)
    const emailSent = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    })

    return NextResponse.json({
      message: 'If an account with this email exists, you will receive a password reset code'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}