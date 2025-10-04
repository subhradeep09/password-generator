import { NextRequest, NextResponse } from 'next/server'
import { VaultItemModel } from '@/lib/models'
import { encrypt, decrypt } from '@/lib/encryption'
import jwt from 'jsonwebtoken'

// Get user from token
function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    throw new Error('No token provided')
  }
  
  const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'default-secret') as any
  return decoded.userId
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserFromToken(request)
    
    const items = await VaultItemModel.findByUserId(userId)
    
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Get vault items error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vault items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserFromToken(request)
    const { title, username, password, url, notes, tags, folderId, isFavorite, encryptionKey } = await request.json()

    if (!title || !password || !encryptionKey) {
      return NextResponse.json(
        { error: 'Title, password, and encryption key are required' },
        { status: 400 }
      )
    }

    // Encrypt sensitive data
    const encryptedPassword = encrypt(password, encryptionKey)
    const encryptedNotes = notes ? encrypt(notes, encryptionKey) : undefined

    const item = await VaultItemModel.create({
      userId,
      title,
      username: username || '',
      encryptedPassword,
      url,
      encryptedNotes,
      tags: tags || [],
      folderId,
      isFavorite: isFavorite || false
    })

    return NextResponse.json({ 
      message: 'Vault item created successfully',
      item: {
        ...item,
        _id: item._id?.toString()
      }
    })
  } catch (error) {
    console.error('Create vault item error:', error)
    return NextResponse.json(
      { error: 'Failed to create vault item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserFromToken(request)
    const { id, title, username, password, url, notes, tags, folderId, isFavorite, encryptionKey } = await request.json()

    if (!id || !title || !encryptionKey) {
      return NextResponse.json(
        { error: 'ID, title, and encryption key are required' },
        { status: 400 }
      )
    }

    // Verify item belongs to user
    const existingItem = await VaultItemModel.findById(id)
    if (!existingItem || existingItem.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      )
    }

    // Encrypt sensitive data if provided
    const updateData: any = {
      title,
      username: username || '',
      url,
      tags: tags || [],
      folderId,
      isFavorite: isFavorite || false
    }

    if (password) {
      updateData.encryptedPassword = encrypt(password, encryptionKey)
    }

    if (notes) {
      updateData.encryptedNotes = encrypt(notes, encryptionKey)
    }

    const updated = await VaultItemModel.updateById(id, updateData)

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update vault item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Vault item updated successfully'
    })
  } catch (error) {
    console.error('Update vault item error:', error)
    return NextResponse.json(
      { error: 'Failed to update vault item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserFromToken(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Verify item belongs to user
    const existingItem = await VaultItemModel.findById(id)
    if (!existingItem || existingItem.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Vault item not found' },
        { status: 404 }
      )
    }

    const deleted = await VaultItemModel.deleteById(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete vault item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Vault item deleted successfully'
    })
  } catch (error) {
    console.error('Delete vault item error:', error)
    return NextResponse.json(
      { error: 'Failed to delete vault item' },
      { status: 500 }
    )
  }
}