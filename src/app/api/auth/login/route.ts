import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '@/lib/models'
import { getUser } from '@/lib/dev-storage'

export async function POST(request: NextRequest) {
  try {
    console.log(`🔐 Login API called`)
    const { email, password } = await request.json()
    console.log(`📧 Login attempt for: ${email}`)

    if (!email || !password) {
      console.log(`❌ Missing email or password`)
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    let user: any = null
    let useMongoFallback = false

    // Try MongoDB first
    try {
      console.log(`🔍 Looking up user in MongoDB...`)
      user = await UserModel.findByEmail(email)
      
      if (user) {
        console.log(`👤 User found in MongoDB: ${email}`)
      } else {
        console.log(`❌ User not found in MongoDB: ${email}`)
      }
    } catch (mongoError) {
      console.warn('❌ MongoDB lookup failed, using fallback:', mongoError)
      useMongoFallback = true
    }

    // If MongoDB failed or user not found, try fallback storage
    if (useMongoFallback || !user) {
      console.log(`🔍 Looking up user in fallback storage...`)
      const fallbackUser = getUser(email)
      
      if (fallbackUser) {
        console.log(`👤 User found in fallback storage: ${email}`)
        user = fallbackUser
        useMongoFallback = true
      }
    }
    
    if (!user || !user.hashedPassword) {
      console.log(`❌ User not found or no password hash: ${email}`)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log(`👤 User found, verifying password...`)
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword)
    console.log(`🔒 Password verification result: ${isValidPassword}`)
    
    if (!isValidPassword) {
      console.log(`❌ Invalid password for: ${email}`)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log(`✅ User logged in successfully: ${email}`)

    // Update last login if using MongoDB
    if (!useMongoFallback && user._id) {
      try {
        await UserModel.updateById(user._id.toString(), {
          lastLoginAt: new Date()
        })
        console.log(`📅 Last login updated in MongoDB`)
      } catch (updateError) {
        console.warn('⚠️ Failed to update last login:', updateError)
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: useMongoFallback ? user.id : user._id!.toString(), 
        email: user.email 
      },
      process.env.NEXTAUTH_SECRET || 'dev-secret-key',
      { expiresIn: '7d' }
    )

    console.log(`🎫 JWT token generated for: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: useMongoFallback ? user.id : user._id!.toString(),
        email: user.email,
        createdAt: useMongoFallback ? user.createdAt : user.createdAt?.toISOString(),
        isVerified: useMongoFallback ? true : user.isVerified
      },
      token,
      mongoMode: !useMongoFallback,
      fallbackMode: useMongoFallback
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}