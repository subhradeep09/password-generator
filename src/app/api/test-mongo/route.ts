import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection...')
    
    // Test MongoDB connection
    const { db } = await connectToDatabase()
    
    // Try to ping the database
    await db.admin().ping()
    
    // Get database stats
    const stats = await db.stats()
    
    console.log('✅ MongoDB connection test successful')
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connected successfully',
      database: {
        name: db.databaseName,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'MongoDB connection failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'create-collections') {
      const { db } = await connectToDatabase()
      
      // Create collections if they don't exist
      const collections = await db.listCollections().toArray()
      const collectionNames = collections.map(c => c.name)
      
      const requiredCollections = ['users', 'otps', 'vault_items']
      const createdCollections = []
      
      for (const collectionName of requiredCollections) {
        if (!collectionNames.includes(collectionName)) {
          await db.createCollection(collectionName)
          createdCollections.push(collectionName)
          console.log(`📦 Created collection: ${collectionName}`)
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Collections checked/created',
        existingCollections: collectionNames,
        createdCollections,
        timestamp: new Date().toISOString()
      })
    }
    
    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ MongoDB operation failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}