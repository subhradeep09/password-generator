import { NextRequest, NextResponse } from 'next/server'
import { generateMockOTP, storeMockOTP } from '@/lib/mock-otp'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = generateMockOTP()
    
    // Store the OTP
    storeMockOTP(email, otp)

    console.log(`🔐 Mock OTP for ${email}: ${otp}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully (check console for development)',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Only show in dev
    })
  } catch (error) {
    console.error('Mock send OTP error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send OTP' 
    }, { status: 500 })
  }
}