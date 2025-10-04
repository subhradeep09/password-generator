// Development test script to verify OTP flow
// Run this in the browser console to test the complete flow

async function testOTPFlow() {
  const testEmail = 'test@example.com'
  const testPassword = 'TestPassword123!'
  
  console.log('🧪 Testing OTP Flow...')
  
  try {
    // Step 1: Send OTP
    console.log('📧 Step 1: Sending OTP...')
    const otpResponse = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    })
    
    const otpData = await otpResponse.json()
    console.log('OTP Response:', otpData)
    
    if (!otpData.success) {
      throw new Error(otpData.error || 'Failed to send OTP')
    }
    
    const otp = otpData.otp // In development mode, OTP is returned
    console.log(`📋 Generated OTP: ${otp}`)
    
    // Step 2: Verify OTP and create account
    console.log('✅ Step 2: Verifying OTP and creating account...')
    const verifyResponse = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testEmail, 
        otp: otp, 
        password: testPassword 
      })
    })
    
    const verifyData = await verifyResponse.json()
    console.log('Verify Response:', verifyData)
    
    if (!verifyData.success) {
      throw new Error(verifyData.error || 'Failed to verify OTP')
    }
    
    console.log('🎉 Account created successfully!')
    
    // Step 3: Test login
    console.log('🔐 Step 3: Testing login...')
    const loginResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testEmail, 
        password: testPassword 
      })
    })
    
    const loginData = await loginResponse.json()
    console.log('Login Response:', loginData)
    
    if (!loginData.success) {
      throw new Error(loginData.error || 'Failed to login')
    }
    
    console.log('✅ Complete flow successful!')
    console.log('Summary:')
    console.log('- ✅ OTP sent and received')
    console.log('- ✅ Account created with OTP verification')
    console.log('- ✅ Login successful')
    
    return {
      success: true,
      user: loginData.user,
      token: loginData.token
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Run the test
// testOTPFlow()

console.log('🧪 Test function loaded. Run testOTPFlow() to test the complete OTP flow.')