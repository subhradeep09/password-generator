import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGO_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

const uri = process.env.MONGO_URI

// More robust connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4 only
  retryWrites: true
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  try {
    const client = await clientPromise
    const db = client.db('password_manager')
    
    // Test the connection
    await db.admin().ping()
    console.log('✅ MongoDB connected successfully')
    
    return { client, db }
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    throw error
  }
}

export default clientPromise