// Development storage for when MongoDB is not available
// This simulates a database in memory for testing purposes

export interface DevOTP {
  otp: string
  timestamp: number
  type: string
}

export interface DevUser {
  id: string
  email: string
  hashedPassword: string
  salt: string
  createdAt: string
}

// Use global to persist data across Next.js hot reloads and route compilations
declare global {
  var __devStorage: {
    otps: Map<string, DevOTP>
    users: Map<string, DevUser>
  } | undefined
}

// Initialize global storage if it doesn't exist
if (!global.__devStorage) {
  global.__devStorage = {
    otps: new Map<string, DevOTP>(),
    users: new Map<string, DevUser>()
  }
}

// Export references to the global storage
export const devOTPs = global.__devStorage.otps
export const devUsers = global.__devStorage.users

// Helper functions
export function cleanupExpiredOTPs() {
  for (const [key, data] of devOTPs.entries()) {
    if (Date.now() > data.timestamp) {
      devOTPs.delete(key)
    }
  }
}

export function storeOTP(email: string, otp: string, type: string = 'registration', expirationMinutes: number = 10) {
  const key = email + '_otp'
  const expirationTime = Date.now() + expirationMinutes * 60 * 1000
  
  devOTPs.set(key, {
    otp,
    timestamp: expirationTime,
    type
  })
  
  console.log(`💾 OTP Storage Debug:`)
  console.log(`   Email: ${email}`)
  console.log(`   Key: ${key}`)
  console.log(`   OTP: ${otp}`)
  console.log(`   Expires at: ${new Date(expirationTime).toLocaleString()}`)
  console.log(`   Storage size after storing: ${devOTPs.size}`)
  
  cleanupExpiredOTPs()
}

export function verifyOTP(email: string, otp: string): { valid: boolean; expired?: boolean } {
  const key = email + '_otp'
  const stored = devOTPs.get(key)
  
  console.log(`🔍 OTP Verification Debug:`)
  console.log(`   Email: ${email}`)
  console.log(`   Key: ${key}`)
  console.log(`   Provided OTP: ${otp}`)
  console.log(`   Stored OTP data:`, stored)
  console.log(`   Total OTPs in storage: ${devOTPs.size}`)
  console.log(`   All OTP keys:`, Array.from(devOTPs.keys()))
  
  if (!stored) {
    console.log(`❌ No OTP found for key: ${key}`)
    return { valid: false }
  }
  
  if (Date.now() > stored.timestamp) {
    console.log(`❌ OTP expired. Current time: ${Date.now()}, Expires: ${stored.timestamp}`)
    devOTPs.delete(key)
    return { valid: false, expired: true }
  }
  
  if (stored.otp === otp) {
    console.log(`✅ OTP verification successful!`)
    devOTPs.delete(key) // Remove used OTP
    return { valid: true }
  }
  
  console.log(`❌ OTP mismatch. Expected: ${stored.otp}, Got: ${otp}`)
  return { valid: false }
}

export function userExists(email: string): boolean {
  return devUsers.has(email)
}

export function createUser(user: DevUser) {
  devUsers.set(user.email, user)
  console.log(`👤 User Creation Debug:`)
  console.log(`   Email: ${user.email}`)
  console.log(`   User ID: ${user.id}`)
  console.log(`   Password hash starts with: ${user.hashedPassword.substring(0, 10)}...`)
  console.log(`   Total users in storage: ${devUsers.size}`)
}

export function getUser(email: string): DevUser | undefined {
  const user = devUsers.get(email)
  console.log(`🔍 User Lookup Debug:`)
  console.log(`   Email: ${email}`)
  console.log(`   User found: ${!!user}`)
  console.log(`   Total users in storage: ${devUsers.size}`)
  console.log(`   All user emails:`, Array.from(devUsers.keys()))
  
  if (user) {
    console.log(`   Password hash starts with: ${user.hashedPassword.substring(0, 10)}...`)
  }
  
  return user
}

export function getAllUsers(): DevUser[] {
  return Array.from(devUsers.values())
}