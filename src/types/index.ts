export interface VaultItem {
  id: string
  title: string
  username: string
  password: string
  url?: string
  notes?: string
  tags: string[]
  folderId?: string
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
}

export interface EncryptedVaultItem {
  id: string
  encryptedData: string
  createdAt: Date
  updatedAt: Date
}

export interface Folder {
  id: string
  name: string
  color: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name?: string
  hashedPassword: string
  salt: string
  totpSecret?: string
  totpEnabled: boolean
  createdAt: Date
  lastLoginAt?: Date
}

export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
}

export interface SearchFilters {
  query: string
  tags: string[]
  folderId?: string
  isFavorite?: boolean
}