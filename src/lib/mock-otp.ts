// Mock OTP service for development when MongoDB is not available
const mockOTPs = new Map<string, { otp: string; timestamp: number }>()

export function storeMockOTP(email: string, otp: string): void {
  // Store in mock memory (valid for 5 minutes)
  mockOTPs.set(email, { 
    otp, 
    timestamp: Date.now() + 5 * 60 * 1000 // 5 minutes from now
  })

  // Clean up expired OTPs
  for (const [storedEmail, data] of mockOTPs.entries()) {
    if (Date.now() > data.timestamp) {
      mockOTPs.delete(storedEmail)
    }
  }
}

export function verifyMockOTP(email: string, otp: string): boolean {
  const stored = mockOTPs.get(email)
  if (!stored) return false
  
  if (Date.now() > stored.timestamp) {
    mockOTPs.delete(email)
    return false
  }
  
  return stored.otp === otp
}

export function generateMockOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}