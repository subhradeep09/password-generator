import { NextRequest, NextResponse } from 'next/server'
import { generateOTP } from '@/lib/email'
import { isValidEmail } from '@/lib/helpers'
import { UserModel, OTPModel } from '@/lib/models'
import { userExists, storeOTP } from '@/lib/dev-storage'

export async function POST(request: NextRequest) {
  try {
    console.log(`📨 Send OTP API called`)
    const { email } = await request.json()
    console.log(`📧 Email: ${email}`)

    if (!email || !isValidEmail(email)) {
      console.log(`❌ Invalid email provided`)
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    let useMongoFallback = false

    try {
      // Try MongoDB first
      console.log(`🔍 Checking if user exists in MongoDB...`)
      const existingUser = await UserModel.findByEmail(email)
      if (existingUser) {
        console.log(`❌ User already exists in MongoDB: ${email}`)
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 409 }
        )
      }
      console.log(`✅ MongoDB connection successful, user doesn't exist`)
    } catch (mongoError) {
      console.warn('❌ MongoDB connection failed, using fallback mode:', mongoError)
      useMongoFallback = true
      
      // Check development storage as fallback
      if (userExists(email)) {
        console.log(`❌ User already exists in fallback storage: ${email}`)
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 409 }
        )
      }
    }

    // Generate OTP
    const otp = generateOTP()
    console.log(`🔢 Generated OTP: ${otp} for ${email}`)

    if (useMongoFallback) {
      // Use development storage fallback
      storeOTP(email, otp, 'registration', 10)
      console.log(`💾 OTP stored in fallback storage`)
    } else {
      // Use MongoDB
      try {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        await OTPModel.create({
          email,
          otp,
          type: 'registration',
          expiresAt,
          used: false
        })
        console.log(`💾 OTP stored in MongoDB`)
      } catch (mongoError) {
        console.warn('❌ MongoDB OTP storage failed, using fallback:', mongoError)
        storeOTP(email, otp, 'registration', 10)
        console.log(`💾 OTP stored in fallback storage`)
        useMongoFallback = true
      }
    }

    console.log(`🔐 Development OTP for ${email}: ${otp} (expires in 10 minutes)`)
    
    return NextResponse.json({
      success: true,
      message: useMongoFallback 
        ? 'OTP sent successfully (fallback mode - check console)'
        : 'OTP sent successfully (check console for development)',
      devMode: true,
      fallbackMode: useMongoFallback,
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}