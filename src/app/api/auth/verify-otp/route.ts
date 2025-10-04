import { NextRequest, NextResponse } from 'next/server'
import { generateSalt } from '@/lib/encryption'
import { generateId } from '@/lib/helpers'
import bcrypt from 'bcryptjs'
import { UserModel, OTPModel } from '@/lib/models'
import { verifyOTP, userExists, createUser, getAllUsers } from '@/lib/dev-storage'

export async function POST(request: NextRequest) {
  try {
    console.log(`🔍 Verify OTP API called`)
    const { email, otp, password } = await request.json()
    console.log(`📧 Email: ${email}`)
    console.log(`🔢 OTP provided: ${otp}`)
    console.log(`🔒 Password length: ${password?.length}`)

    if (!email || !otp || !password) {
      console.log(`❌ Missing required fields`)
      return NextResponse.json(
        { error: 'Email, OTP, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      console.log(`❌ Password too short`)
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    let useMongoFallback = false
    let otpValid = false

    // Try MongoDB first for OTP verification
    try {
      console.log(`🔍 Verifying OTP in MongoDB...`)
      const otpRecord = await OTPModel.findValidOTP(email, otp, 'registration')
      if (otpRecord) {
        console.log(`✅ Valid OTP found in MongoDB`)
        otpValid = true
        
        // Mark OTP as used
        await OTPModel.markAsUsed(otpRecord._id!)
        console.log(`✅ OTP marked as used in MongoDB`)
      } else {
        console.log(`❌ Invalid or expired OTP in MongoDB`)
        return NextResponse.json(
          { error: 'Invalid or expired OTP' },
          { status: 400 }
        )
      }
    } catch (mongoError) {
      console.warn('❌ MongoDB OTP verification failed, using fallback:', mongoError)
      useMongoFallback = true
      
      // Use fallback storage for OTP verification
      console.log(`🔍 About to verify OTP in fallback storage...`)
      const otpResult = verifyOTP(email, otp)
      console.log(`📊 Fallback OTP verification result:`, otpResult)
      
      if (!otpResult.valid) {
        if (otpResult.expired) {
          console.log(`❌ OTP expired in fallback storage for ${email}`)
          return NextResponse.json(
            { error: 'OTP has expired. Please request a new OTP.' },
            { status: 400 }
          )
        } else {
          console.log(`❌ Invalid OTP in fallback storage for ${email}`)
          return NextResponse.json(
            { error: 'Invalid OTP. Please try again.' },
            { status: 400 }
          )
        }
      }
      otpValid = true
    }

    if (!otpValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Check if user already exists
    let userAlreadyExists = false
    
    if (useMongoFallback) {
      userAlreadyExists = userExists(email)
      console.log(`👤 User exists check (fallback): ${userAlreadyExists}`)
    } else {
      try {
        const existingUser = await UserModel.findByEmail(email)
        userAlreadyExists = !!existingUser
        console.log(`👤 User exists check (MongoDB): ${userAlreadyExists}`)
      } catch (mongoError) {
        console.warn('❌ MongoDB user check failed, using fallback:', mongoError)
        userAlreadyExists = userExists(email)
        useMongoFallback = true
      }
    }

    if (userAlreadyExists) {
      console.log(`❌ User already exists during verification: ${email}`)
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    console.log(`🔒 Hashing password...`)
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(`✅ Password hashed successfully`)

    // Create user
    const userId = generateId()
    
    if (useMongoFallback) {
      // Use fallback storage
      const user = {
        id: userId,
        email,
        hashedPassword,
        salt: generateSalt(),
        createdAt: new Date().toISOString()
      }

      console.log(`👤 Creating user in fallback storage...`)
      createUser(user)
      console.log(`✅ User account created successfully in fallback: ${email}`)
      console.log(`📊 Total users in fallback storage: ${getAllUsers().length}`)
      
      return NextResponse.json({
        success: true,
        message: 'Account created successfully (fallback mode)',
        user: {
          id: userId,
          email,
          createdAt: user.createdAt
        },
        fallbackMode: true
      })
    } else {
      // Use MongoDB
      try {
        console.log(`👤 Creating user in MongoDB...`)
        const user = await UserModel.create({
          email,
          hashedPassword,
          salt: generateSalt(),
          isVerified: true,
          totpEnabled: false
        })

        console.log(`✅ User account created successfully in MongoDB: ${email}`)

        return NextResponse.json({
          success: true,
          message: 'Account created successfully',
          user: {
            id: user._id!.toString(),
            email: user.email,
            isVerified: user.isVerified
          },
          mongoMode: true
        })
      } catch (mongoError) {
        console.error('❌ MongoDB user creation failed:', mongoError)
        
        // Fallback to development storage
        const user = {
          id: userId,
          email,
          hashedPassword,
          salt: generateSalt(),
          createdAt: new Date().toISOString()
        }

        console.log(`👤 Creating user in fallback storage (MongoDB failed)...`)
        createUser(user)
        console.log(`✅ User account created successfully in fallback: ${email}`)
        
        return NextResponse.json({
          success: true,
          message: 'Account created successfully (fallback mode)',
          user: {
            id: userId,
            email,
            createdAt: user.createdAt
          },
          fallbackMode: true
        })
      }
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP and create account' },
      { status: 500 }
    )
  }
}