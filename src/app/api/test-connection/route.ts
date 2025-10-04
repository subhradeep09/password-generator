import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic connectivity first
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'No internet connection' 
      }, { status: 500 })
    }

    // Test MongoDB URI format
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      return NextResponse.json({ 
        success: false, 
        error: 'MONGO_URI not found in environment variables' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Basic connectivity test passed',
      hasMongoUri: !!mongoUri,
      mongoUriPrefix: mongoUri.substring(0, 20) + '...'
    })
  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}