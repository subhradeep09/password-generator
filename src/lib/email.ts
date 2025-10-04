// Email service for sending OTPs and notifications

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// For demo purposes, we'll simulate email sending
// In production, integrate with services like SendGrid, AWS SES, etc.
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Log email content for development
    console.log('📧 Email would be sent:')
    console.log('To:', options.to)
    console.log('Subject:', options.subject)
    console.log('Content:', options.text || options.html)
    
    // In production, replace this with actual email service
    // Example with nodemailer:
    /*
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    })
    */
    
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

// Template for registration OTP email
export function getRegistrationOTPEmail(otp: string): { subject: string; html: string; text: string } {
  return {
    subject: 'SecureVault - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SecureVault</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p style="color: #666; line-height: 1.6;">
            Welcome to SecureVault! To complete your registration, please enter the following verification code:
          </p>
          <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p style="color: #666; line-height: 1.6;">
            This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            SecureVault - Your Privacy-First Password Manager
          </p>
        </div>
      </div>
    `,
    text: `
      SecureVault - Verify Your Email
      
      Welcome to SecureVault! To complete your registration, please enter the following verification code:
      
      ${otp}
      
      This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
      
      SecureVault - Your Privacy-First Password Manager
    `
  }
}

// Template for password reset OTP email
export function getPasswordResetOTPEmail(otp: string): { subject: string; html: string; text: string } {
  return {
    subject: 'SecureVault - Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SecureVault</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p style="color: #666; line-height: 1.6;">
            You requested to reset your password. Please enter the following code to continue:
          </p>
          <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p style="color: #666; line-height: 1.6;">
            This code will expire in 10 minutes. If you didn't request a password reset, please ignore this email.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            SecureVault - Your Privacy-First Password Manager
          </p>
        </div>
      </div>
    `,
    text: `
      SecureVault - Password Reset Code
      
      You requested to reset your password. Please enter the following code to continue:
      
      ${otp}
      
      This code will expire in 10 minutes. If you didn't request a password reset, please ignore this email.
      
      SecureVault - Your Privacy-First Password Manager
    `
  }
}