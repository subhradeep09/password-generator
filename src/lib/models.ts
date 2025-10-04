import { connectToDatabase } from './mongodb'
import { ObjectId } from 'mongodb'

// User model for MongoDB
export interface User {
  _id?: ObjectId
  email: string
  hashedPassword?: string
  salt: string
  isVerified: boolean
  verificationToken?: string
  resetToken?: string
  resetTokenExpiry?: Date
  totpSecret?: string
  totpEnabled: boolean
  createdAt: Date
  lastLoginAt?: Date
}

// OTP model for MongoDB
export interface OTPRecord {
  _id?: ObjectId
  email: string
  otp: string
  type: 'registration' | 'password_reset'
  expiresAt: Date
  createdAt: Date
  used: boolean
}

// Vault item model for MongoDB
export interface VaultItem {
  _id?: ObjectId
  userId: ObjectId
  title: string
  username: string
  encryptedPassword: string
  url?: string
  encryptedNotes?: string
  tags: string[]
  folderId?: string
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
}

// Database operations for Users
export class UserModel {
  static async create(userData: Omit<User, '_id' | 'createdAt'>): Promise<User> {
    const { db } = await connectToDatabase()
    const user = {
      ...userData,
      createdAt: new Date()
    }
    const result = await db.collection('users').insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  static async findByEmail(email: string): Promise<User | null> {
    const { db } = await connectToDatabase()
    return await db.collection<User>('users').findOne({ email })
  }

  static async findById(id: string): Promise<User | null> {
    const { db } = await connectToDatabase()
    return await db.collection<User>('users').findOne({ _id: new ObjectId(id) })
  }

  static async updateById(id: string, update: Partial<User>): Promise<boolean> {
    const { db } = await connectToDatabase()
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } }
    )
    return result.modifiedCount > 0
  }

  static async deleteById(id: string): Promise<boolean> {
    const { db } = await connectToDatabase()
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}

// Database operations for OTP
export class OTPModel {
  static async create(otpData: Omit<OTPRecord, '_id' | 'createdAt'>): Promise<OTPRecord> {
    const { db } = await connectToDatabase()
    const otp = {
      ...otpData,
      createdAt: new Date()
    }
    const result = await db.collection('otps').insertOne(otp)
    return { ...otp, _id: result.insertedId }
  }

  static async findValidOTP(email: string, otp: string, type: 'registration' | 'password_reset'): Promise<OTPRecord | null> {
    const { db } = await connectToDatabase()
    return await db.collection<OTPRecord>('otps').findOne({
      email,
      otp,
      type,
      used: false,
      expiresAt: { $gt: new Date() }
    })
  }

  static async markAsUsed(id: ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase()
    const result = await db.collection('otps').updateOne(
      { _id: id },
      { $set: { used: true } }
    )
    return result.modifiedCount > 0
  }

  static async deleteExpired(): Promise<number> {
    const { db } = await connectToDatabase()
    const result = await db.collection('otps').deleteMany({
      expiresAt: { $lt: new Date() }
    })
    return result.deletedCount
  }
}

// Database operations for Vault Items
export class VaultItemModel {
  static async create(itemData: Omit<VaultItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<VaultItem> {
    const { db } = await connectToDatabase()
    const item = {
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const result = await db.collection('vault_items').insertOne(item)
    return { ...item, _id: result.insertedId }
  }

  static async findByUserId(userId: string): Promise<VaultItem[]> {
    const { db } = await connectToDatabase()
    return await db.collection<VaultItem>('vault_items').find({ userId: new ObjectId(userId) }).toArray()
  }

  static async findById(id: string): Promise<VaultItem | null> {
    const { db } = await connectToDatabase()
    return await db.collection<VaultItem>('vault_items').findOne({ _id: new ObjectId(id) })
  }

  static async updateById(id: string, update: Partial<VaultItem>): Promise<boolean> {
    const { db } = await connectToDatabase()
    const result = await db.collection('vault_items').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } }
    )
    return result.modifiedCount > 0
  }

  static async deleteById(id: string): Promise<boolean> {
    const { db } = await connectToDatabase()
    const result = await db.collection('vault_items').deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async deleteByUserId(userId: string): Promise<number> {
    const { db } = await connectToDatabase()
    const result = await db.collection('vault_items').deleteMany({ userId: new ObjectId(userId) })
    return result.deletedCount
  }
}