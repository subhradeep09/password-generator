import CryptoJS from 'crypto-js'

// Generate a secure encryption key from master password
export function deriveKey(masterPassword: string, salt: string): string {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256 / 32,
    iterations: 10000
  }).toString()
}

// Encrypt data with AES
export function encrypt(data: string, key: string): string {
  const encrypted = CryptoJS.AES.encrypt(data, key).toString()
  return encrypted
}

// Decrypt data with AES
export function decrypt(encryptedData: string, key: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted
  } catch (error) {
    throw new Error('Failed to decrypt data - invalid key or corrupted data')
  }
}

// Generate a random salt
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(256 / 8).toString()
}

// Generate a secure random string
export function generateSecureRandom(length: number = 32): string {
  return CryptoJS.lib.WordArray.random(length).toString()
}