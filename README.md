# SecureVault - Advanced Password Manager

A privacy-first password manager built with Next.js, TypeScript, and MongoDB, featuring client-side encryption, OTP-based authentication, password generation, and a clean, minimal interface.

## 🚀 Live Demo

**[Try SecureVault Live](https://password-generator-gold-one-27.vercel.app/)**

Experience the full functionality of SecureVault with our live demo.

## ✨ **Latest Features (Updated)**

### 🔐 **Enhanced Authentication System**
- **OTP-Based Registration**: Email verification with 6-digit codes
- **Forgot Password**: Secure password reset via OTP
- **MongoDB Integration**: Real user management and secure storage
- **JWT Authentication**: Secure session management
- **Email Verification**: Account verification before access

### 👁️ **Password Visibility Controls**
- **Eye Icon Toggle**: Show/hide passwords with intuitive icons
- **Secure Copy**: Auto-clearing clipboard functionality
- **Visual Feedback**: Clear indicators for password visibility state

### 📧 **Email Integration**
- **OTP Delivery**: Professional email templates for verification codes
- **Password Reset**: Secure email-based password recovery
- **Account Notifications**: Email confirmations for security actions

## Features

### ✅ **Must-haves (Implemented)**
- **Password Generator**: Customizable length slider, character type options, exclude similar characters
- **OTP Authentication**: Email + password + OTP verification for registration
- **Vault Management**: Store items with title, username, password, URL, and notes
- **Client-side Encryption**: All vault data encrypted before storage (AES-256 + PBKDF2)
- **Copy to Clipboard**: Auto-clearing clipboard after 15 seconds
- **Search & Filter**: Find items by title, username, URL, or notes
- **Folder Organization**: Organize items in folders (All, Favorites, Work, Personal)
- **Forgot Password**: OTP-based password recovery system

### ⭐ **Enhanced Features**
- **Dark Mode**: Full dark/light theme support
- **Tags System**: Organize items with custom tags
- **Password Strength Indicator**: Real-time password strength analysis
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Clean, minimal interface with Tailwind CSS
- **Eye Icons**: Toggle password visibility with beautiful icons
- **MongoDB Atlas**: Cloud database integration for scalability

### 🔒 **Advanced Security Features**
- **Client-side encryption** using AES-256 with PBKDF2 key derivation (10,000 iterations)
- **No plaintext storage** - all sensitive data encrypted before saving to MongoDB
- **Secure password hashing** with bcrypt (12 rounds) + unique salts
- **JWT authentication** with secure token management
- **Auto-clearing clipboard** to prevent data leaks
- **OTP verification** for enhanced account security
- **Email-based recovery** without compromising security

## Quick Start

### 1. **Prerequisites**
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Valid email credentials for OTP sending (optional for demo)

### 2. **Installation**
```bash
# Clone or download the project
cd password-manager

# Install dependencies
npm install
```

### 3. **Environment Setup**
Update `.env.local` with your configurations:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-32-chars-minimum
ENCRYPTION_KEY=your-encryption-key-32-characters-minimum-change-this
MONGO_URI=your-mongodb-connection-string

# Optional: For real email sending
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. **Start Development Server**
```bash
npm run dev
```

### 5. **Open Application**
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### 🚀 **Getting Started**
1. **Visit** the application homepage
2. **Sign Up** with your email address
3. **Check Email** for 6-digit verification code
4. **Enter OTP** and create your master password
5. **Login** with your credentials
6. **Start Managing** your passwords securely

### 🔑 **Registration Process**
1. Click "Don't have an account? Sign up"
2. Enter your email and create a strong password
3. Click "Send Verification Code"
4. Check your email for the 6-digit OTP
5. Enter the OTP and confirm your password
6. Account created - you can now login!

### 🔄 **Password Recovery**
1. Click "Forgot your password?" on login screen
2. Enter your email address
3. Click "Send Reset Code"
4. Check email for password reset OTP
5. Enter OTP and set new password
6. Login with your new credentials

### 👁️ **Password Visibility**
- **Eye Icon**: Click to toggle password visibility
- **Secure by Default**: Passwords hidden with bullets (••••••••)
- **Quick Toggle**: Easy switch between hidden/visible states
- **Copy Function**: Copy passwords without revealing them

### 🏗️ **Vault Management**
- **Add Items**: Click "Add Item" to store new credentials
- **Edit Items**: Click edit icon to modify existing entries
- **Delete Items**: Remove items you no longer need
- **Search**: Type in search bar for instant filtering
- **Organize**: Use folders and tags for better organization

### 🔐 **Password Generator**
- **Length Control**: Adjust from 8-50 characters
- **Character Types**: Toggle uppercase, lowercase, numbers, symbols
- **Exclude Similar**: Avoid confusing characters (il1Lo0O)
- **Strength Meter**: Real-time security assessment
- **One-Click Copy**: Secure clipboard with auto-clear

## Technology Stack

### **Backend**
- **Next.js 14**: Full-stack React framework with API routes
- **MongoDB**: Document database with Atlas cloud hosting
- **JWT**: Secure token-based authentication
- **bcryptjs**: Password hashing with salt
- **CryptoJS**: Client-side encryption (AES-256, PBKDF2)

### **Frontend**
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon system
- **React Hot Toast**: Elegant notifications

### **Security**
- **Client-Side Encryption**: AES-256 encryption before database storage
- **PBKDF2 Key Derivation**: 10,000 iterations for key strengthening
- **bcrypt Hashing**: 12 rounds for password security
- **OTP Verification**: 6-digit codes with 10-minute expiry
- **JWT Tokens**: Secure session management

## Security Architecture

### **Zero-Knowledge Design**
1. **Master Password**: Never stored, used only for key derivation
2. **Client Encryption**: All data encrypted in browser before transmission
3. **Server Storage**: Only encrypted blobs stored in MongoDB
4. **Key Management**: Encryption keys never leave client device

### **Authentication Flow**
1. **Registration**: Email → OTP → Password → Account Creation
2. **Login**: Email + Password → JWT Token → Vault Access
3. **Password Reset**: Email → OTP → New Password → Updated Account
4. **Session**: JWT validation on all protected routes

### **Data Protection**
- **At Rest**: All vault data encrypted in MongoDB
- **In Transit**: HTTPS for all communications
- **In Memory**: Sensitive data cleared after use
- **Clipboard**: Auto-clearing after 15 seconds

## Project Structure

```
src/
├── app/                    # Next.js 14 app router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   │   ├── send-otp/    # OTP generation and sending
│   │   │   ├── verify-otp/  # OTP verification
│   │   │   ├── login/       # User login
│   │   │   ├── forgot-password/ # Password reset OTP
│   │   │   └── reset-password/  # Password reset confirmation
│   │   └── vault/         # Vault management
│   ├── layout.tsx         # Root application layout
│   ├── page.tsx          # Login/signup page
│   └── vault/page.tsx    # Main vault dashboard
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   └── vault/            # Vault management components
├── lib/                  # Core utilities and services
│   ├── mongodb.ts        # MongoDB connection
│   ├── models.ts         # Database models and operations
│   ├── auth.ts           # Authentication service
│   ├── email.ts          # Email service and templates
│   ├── encryption.ts     # Client-side encryption
│   ├── password-generator.ts # Password generation
│   └── helpers.ts        # Utility functions
├── types/                # TypeScript type definitions
└── styles/               # Global styles and themes
```

## API Documentation

### **Authentication Endpoints**

#### POST `/api/auth/send-otp`
Send OTP for registration
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/verify-otp`
Verify OTP and create account
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "SecurePassword123!"
}
```

#### POST `/api/auth/login`
User login
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### POST `/api/auth/forgot-password`
Send password reset OTP
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/reset-password`
Reset password with OTP
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

### **Vault Endpoints**

#### GET `/api/vault`
Fetch user's vault items (requires Bearer token)

#### POST `/api/vault`
Create new vault item (requires Bearer token)
```json
{
  "title": "Gmail Account",
  "username": "user@gmail.com",
  "password": "password123",
  "url": "https://gmail.com",
  "notes": "Personal email",
  "tags": ["email", "personal"],
  "encryptionKey": "user-encryption-key"
}
```

## Troubleshooting

### **Common Issues**

#### "Cannot connect to MongoDB"
- Verify `MONGO_URI` in `.env.local`
- Check network access in MongoDB Atlas
- Ensure database user has correct permissions

#### "OTP not received"
- Check email spam folder
- Verify email configuration
- Look for OTP in server console (development mode)

#### "Invalid credentials"
- Ensure account is verified (check `users` collection)
- Try password reset if forgotten
- Check for typos in email/password

#### "Token expired"
- Clear browser localStorage
- Login again to get fresh token
- Check JWT secret configuration

### 🚀 **Live Features**
- **Registration**: Email → OTP → Account Creation
- **Login**: Email + Password authentication
- **Password Recovery**: Email-based reset with OTP
- **Vault Management**: Create, read, update, delete vault items
- **Password Generator**: Advanced options with strength indicator
- **Search & Filter**: Real-time vault item filtering
- **Copy Protection**: Auto-clearing clipboard for security
