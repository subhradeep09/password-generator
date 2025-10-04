// Password generation utilities

export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous?: boolean
  customChars?: string
}

export interface PassphraseOptions {
  wordCount: number
  separator: string
  includeNumbers: boolean
  capitalize: boolean
  minWordLength?: number
  maxWordLength?: number
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const SIMILAR_CHARS = 'il1Lo0O'
const AMBIGUOUS_CHARS = '{}[]()/<>\'"'

const WORD_LIST = [
  'apple', 'beach', 'cloud', 'dance', 'eagle', 'flame', 'grape', 'house',
  'island', 'jungle', 'knight', 'lemon', 'mountain', 'night', 'ocean', 'peace',
  'queen', 'river', 'storm', 'tiger', 'universe', 'valley', 'winter', 'youth',
  'zebra', 'anchor', 'bridge', 'castle', 'dragon', 'energy', 'forest', 'garden',
  'horizon', 'journey', 'kingdom', 'liberty', 'mystery', 'nature', 'orange',
  'planet', 'puzzle', 'rainbow', 'shadow', 'thunder', 'unique', 'victory',
  'wisdom', 'galaxy', 'harmony', 'crystal', 'emerald', 'diamond', 'sapphire',
  'golden', 'silver', 'bronze', 'marble', 'velvet', 'silk', 'cotton', 'wool'
]

export function generatePassword(options: PasswordOptions): string {
  let charset = ''
  
  if (options.includeUppercase) charset += UPPERCASE
  if (options.includeLowercase) charset += LOWERCASE
  if (options.includeNumbers) charset += NUMBERS
  if (options.includeSymbols) charset += SYMBOLS
  if (options.customChars) charset += options.customChars
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('')
  }
  
  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('')
  }
  
  if (charset === '') {
    throw new Error('At least one character type must be selected')
  }
  
  // Use crypto-secure random if available
  let password = ''
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(options.length)
    window.crypto.getRandomValues(array)
    for (let i = 0; i < options.length; i++) {
      password += charset[array[i] % charset.length]
    }
  } else {
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
  }
  
  return password
}

export function generatePassphrase(options: PassphraseOptions): string {
  if (options.wordCount < 2) {
    throw new Error('Passphrase must contain at least 2 words')
  }
  
  const selectedWords: string[] = []
  const availableWords = options.minWordLength || options.maxWordLength 
    ? WORD_LIST.filter(word => {
        const minLength = options.minWordLength || 1
        const maxLength = options.maxWordLength || 20
        return word.length >= minLength && word.length <= maxLength
      })
    : WORD_LIST
  
  if (availableWords.length < options.wordCount) {
    throw new Error('Not enough words available with the specified length constraints')
  }
  
  // Select random words
  const usedIndices = new Set<number>()
  while (selectedWords.length < options.wordCount) {
    const randomIndex = Math.floor(Math.random() * availableWords.length)
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex)
      let word = availableWords[randomIndex]
      
      if (options.capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1)
      }
      
      if (options.includeNumbers && Math.random() > 0.5) {
        word += Math.floor(Math.random() * 100)
      }
      
      selectedWords.push(word)
    }
  }
  
  return selectedWords.join(options.separator)
}

export function calculatePasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
    noRepeats: !/(.)\1{2,}/.test(password),
    noCommon: !isCommonPassword(password)
  }
  
  score = Object.values(checks).filter(Boolean).length
  
  if (password.length >= 16) score += 1
  if (password.length >= 20) score += 1
  
  let label = 'Very Weak'
  let color = 'bg-red-500'
  
  if (score >= 7) {
    label = 'Very Strong'
    color = 'bg-green-500'
  } else if (score >= 5) {
    label = 'Strong'
    color = 'bg-blue-500'
  } else if (score >= 3) {
    label = 'Medium'
    color = 'bg-yellow-500'
  } else if (score >= 1) {
    label = 'Weak'
    color = 'bg-orange-500'
  }
  
  return { score: Math.min(score, 8), label, color }
}

function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ]
  return commonPasswords.includes(password.toLowerCase())
}