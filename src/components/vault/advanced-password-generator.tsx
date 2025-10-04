'use client'

import { useState, useEffect } from 'react'
import { generatePassword, calculatePasswordStrength, generatePassphrase, type PasswordOptions, type PassphraseOptions } from '@/lib/password-generator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { Copy, RefreshCw, Eye, EyeOff, Download, Share2, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'

type GeneratorType = 'password' | 'passphrase' | 'pin'

interface PinOptions {
  length: number
  allowRepeats: boolean
}

export function AdvancedPasswordGenerator() {
  const [generatorType, setGeneratorType] = useState<GeneratorType>('password')
  const [showPassword, setShowPassword] = useState(false)
  const [generatedResults, setGeneratedResults] = useState<string[]>([])
  const [currentResult, setCurrentResult] = useState('')
  
  // Password options
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false,
    customChars: ''
  })
  
  // Passphrase options
  const [passphraseOptions, setPassphraseOptions] = useState<PassphraseOptions>({
    wordCount: 4,
    separator: '-',
    includeNumbers: false,
    capitalize: true,
    minWordLength: 3,
    maxWordLength: 8
  })
  
  // PIN options
  const [pinOptions, setPinOptions] = useState<PinOptions>({
    length: 6,
    allowRepeats: true
  })

  const generatePin = (options: PinOptions): string => {
    let pin = ''
    const digits = '0123456789'
    
    if (!options.allowRepeats && options.length > 10) {
      throw new Error('PIN length cannot exceed 10 digits when repeats are not allowed')
    }
    
    const usedDigits = new Set<string>()
    
    for (let i = 0; i < options.length; i++) {
      let digit: string
      do {
        digit = digits[Math.floor(Math.random() * digits.length)]
      } while (!options.allowRepeats && usedDigits.has(digit))
      
      if (!options.allowRepeats) {
        usedDigits.add(digit)
      }
      pin += digit
    }
    
    return pin
  }

  const handleGenerate = () => {
    try {
      let result = ''
      
      switch (generatorType) {
        case 'password':
          result = generatePassword(passwordOptions)
          break
        case 'passphrase':
          result = generatePassphrase(passphraseOptions)
          break
        case 'pin':
          result = generatePin(pinOptions)
          break
        default:
          result = generatePassword(passwordOptions)
      }
      
      setCurrentResult(result)
      setGeneratedResults(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
      toast.success(`${generatorType.charAt(0).toUpperCase() + generatorType.slice(1)} generated!`)
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Failed to generate')
    }
  }

  const handleCopy = async (text: string = currentResult) => {
    if (!text) return
    
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
      
      // Auto-clear after 30 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('')
      }, 30000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const handleDownload = () => {
    if (!currentResult) return
    
    const element = document.createElement('a')
    const file = new Blob([currentResult], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${generatorType}-${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Downloaded!')
  }

  const handleShare = async () => {
    if (!currentResult) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Generated ${generatorType}`,
          text: currentResult
        })
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      handleCopy()
    }
  }

  const generateBatch = () => {
    const batch = []
    for (let i = 0; i < 5; i++) {
      try {
        let result = ''
        switch (generatorType) {
          case 'password':
            result = generatePassword(passwordOptions)
            break
          case 'passphrase':
            result = generatePassphrase(passphraseOptions)
            break
          case 'pin':
            result = generatePin(pinOptions)
            break
        }
        batch.push(result)
      } catch (error) {
        break
      }
    }
    setGeneratedResults(batch)
    if (batch.length > 0) {
      setCurrentResult(batch[0])
      toast.success(`Generated ${batch.length} ${generatorType}s!`)
    }
  }

  const strength = currentResult && generatorType === 'password' 
    ? calculatePasswordStrength(currentResult) 
    : null

  // Generate initial result
  useEffect(() => {
    if (!currentResult) {
      handleGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount

  const getDiceIcon = (count: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const Icon = icons[Math.min(count - 1, 5)]
    return <Icon size={16} />
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Generator Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Advanced Password Generator
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { type: 'password', label: 'Password', desc: 'Random characters' },
            { type: 'passphrase', label: 'Passphrase', desc: 'Easy to remember words' },
            { type: 'pin', label: 'PIN', desc: 'Numeric codes' }
          ].map(({ type, label, desc }) => (
            <button
              key={type}
              onClick={() => setGeneratorType(type as GeneratorType)}
              className={`px-4 py-3 rounded-lg border transition-colors ${
                generatorType === type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <div className="font-medium">{label}</div>
              <div className="text-xs opacity-75">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated Result */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Generated {generatorType.charAt(0).toUpperCase() + generatorType.slice(1)}
          </h2>
          
          <div className="space-y-4">
            {/* Main Result Display */}
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    value={currentResult}
                    readOnly
                    type={showPassword ? 'text' : 'password'}
                    className="font-mono text-sm pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleCopy()} size="sm" variant="outline">
                  <Copy size={14} className="mr-1" />
                  Copy
                </Button>
                <Button onClick={handleGenerate} size="sm">
                  <RefreshCw size={14} className="mr-1" />
                  Generate
                </Button>
                <Button onClick={generateBatch} size="sm" variant="outline">
                  {getDiceIcon(5)}
                  <span className="ml-1">Batch (5)</span>
                </Button>
                <Button onClick={handleDownload} size="sm" variant="outline">
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
                <Button onClick={handleShare} size="sm" variant="outline">
                  <Share2 size={14} className="mr-1" />
                  Share
                </Button>
              </div>
            </div>

            {/* Password Strength */}
            {strength && (
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Strength: {strength.label}</span>
                  <span>{strength.score}/8</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 8) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Recent Results */}
            {generatedResults.length > 1 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Recent Results</Label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {generatedResults.slice(1).map((result, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono truncate">
                        {showPassword ? result : '•'.repeat(result.length)}
                      </code>
                      <button
                        onClick={() => handleCopy(result)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Options Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Options
          </h2>

          {/* Password Options */}
          {generatorType === 'password' && (
            <div className="space-y-4">
              <div>
                <Label className="flex justify-between">
                  <span>Length</span>
                  <span className="font-mono">{passwordOptions.length}</span>
                </Label>
                <input
                  type="range"
                  min="4"
                  max="128"
                  value={passwordOptions.length}
                  onChange={(e) => setPasswordOptions((prev: PasswordOptions) => ({ 
                    ...prev, 
                    length: parseInt(e.target.value) 
                  }))}
                  className="w-full mt-2 accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'includeUppercase', label: 'Uppercase (A-Z)', example: 'ABC' },
                  { key: 'includeLowercase', label: 'Lowercase (a-z)', example: 'abc' },
                  { key: 'includeNumbers', label: 'Numbers (0-9)', example: '123' },
                  { key: 'includeSymbols', label: 'Symbols', example: '!@#' },
                  { key: 'excludeSimilar', label: 'Exclude similar chars', example: 'il1Lo0O' },
                  { key: 'excludeAmbiguous', label: 'Exclude ambiguous', example: '{}[]()' }
                ].map(({ key, label, example }) => (
                  <label key={key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={passwordOptions[key as keyof PasswordOptions] as boolean}
                        onChange={(e) => setPasswordOptions((prev: PasswordOptions) => ({ 
                          ...prev, 
                          [key]: e.target.checked 
                        }))}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{label}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{example}</span>
                  </label>
                ))}
              </div>

              <div>
                <Label>Custom Characters (optional)</Label>
                <Input
                  value={passwordOptions.customChars || ''}
                  onChange={(e) => setPasswordOptions((prev: PasswordOptions) => ({ 
                    ...prev, 
                    customChars: e.target.value 
                  }))}
                  placeholder="Additional characters to include"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Passphrase Options */}
          {generatorType === 'passphrase' && (
            <div className="space-y-4">
              <div>
                <Label className="flex justify-between">
                  <span>Word Count</span>
                  <span className="font-mono">{passphraseOptions.wordCount}</span>
                </Label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={passphraseOptions.wordCount}
                  onChange={(e) => setPassphraseOptions((prev: PassphraseOptions) => ({ 
                    ...prev, 
                    wordCount: parseInt(e.target.value) 
                  }))}
                  className="w-full mt-2 accent-blue-600"
                />
              </div>

              <div>
                <Label>Separator</Label>
                <Input
                  value={passphraseOptions.separator}
                  onChange={(e) => setPassphraseOptions((prev: PassphraseOptions) => ({ 
                    ...prev, 
                    separator: e.target.value 
                  }))}
                  placeholder="-"
                  className="mt-1"
                  maxLength={3}
                />
              </div>

              <div className="space-y-3">
                {[
                  { key: 'includeNumbers', label: 'Include numbers' },
                  { key: 'capitalize', label: 'Capitalize words' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={passphraseOptions[key as keyof PassphraseOptions] as boolean}
                      onChange={(e) => setPassphraseOptions((prev: PassphraseOptions) => ({ 
                        ...prev, 
                        [key]: e.target.checked 
                      }))}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PIN Options */}
          {generatorType === 'pin' && (
            <div className="space-y-4">
              <div>
                <Label className="flex justify-between">
                  <span>Length</span>
                  <span className="font-mono">{pinOptions.length}</span>
                </Label>
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={pinOptions.length}
                  onChange={(e) => setPinOptions((prev: PinOptions) => ({ 
                    ...prev, 
                    length: parseInt(e.target.value) 
                  }))}
                  className="w-full mt-2 accent-blue-600"
                />
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={pinOptions.allowRepeats}
                  onChange={(e) => setPinOptions((prev: PinOptions) => ({ 
                    ...prev, 
                    allowRepeats: e.target.checked 
                  }))}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Allow repeated digits</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}