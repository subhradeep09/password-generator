import { NextRequest, NextResponse } from 'next/server'
import { devOTPs, devUsers, storeOTP, verifyOTP, createUser, getUser } from '@/lib/dev-storage'

export async function GET() {
  return NextResponse.json({
    success: true,
    storage: {
      otps: {
        count: devOTPs.size,
        keys: Array.from(devOTPs.keys()),
        entries: Array.from(devOTPs.entries())
      },
      users: {
        count: devUsers.size,
        keys: Array.from(devUsers.keys()),
        users: Array.from(devUsers.values()).map(user => ({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt
        }))
      }
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { action, email, otp, password } = await request.json()
    
    switch (action) {
      case 'test-store-otp':
        storeOTP(email, otp || '123456', 'test', 10)
        return NextResponse.json({ success: true, message: 'OTP stored' })
        
      case 'test-verify-otp':
        const result = verifyOTP(email, otp)
        return NextResponse.json({ success: true, result })
        
      case 'test-create-user':
        const user = {
          id: 'test-' + Date.now(),
          email,
          hashedPassword: 'test-hash',
          salt: 'test-salt',
          createdAt: new Date().toISOString()
        }
        createUser(user)
        return NextResponse.json({ success: true, user })
        
      case 'test-get-user':
        const foundUser = getUser(email)
        return NextResponse.json({ success: true, user: foundUser })
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
}