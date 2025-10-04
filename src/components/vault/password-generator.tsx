'use client'

import { useState } from 'react'
import { generatePassword, calculatePasswordStrength } from '@/lib/password-generator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { Copy, RefreshCw, X } from 'lucide-react'

interface PasswordGeneratorProps {
  onClose: () => void
  onPasswordSelect?: (password: string) => void
}

export function PasswordGenerator({ onClose, onPasswordSelect }: PasswordGeneratorProps) {
  const [options, setOptions] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true
  })
  
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      try {
        const password = generatePassword(options)
        setGeneratedPassword(password)
      } catch (error) {
        toast.error(error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Failed to generate password')
      } finally {
        setIsGenerating(false)
      }
    }, 100)
  }

  const handleCopy = async () => {
    if (!generatedPassword) return
    
    try {
      await navigator.clipboard.writeText(generatedPassword)
      toast.success('Password copied to clipboard')
      
      // Auto-clear after 15 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('')
      }, 15000)
    } catch (error) {
      toast.error('Failed to copy password')
    }
  }

  const handleUsePassword = () => {
    if (onPasswordSelect && generatedPassword) {
      onPasswordSelect(generatedPassword)
      onClose()
    }
  }

  const strength = generatedPassword ? calculatePasswordStrength(generatedPassword) : null

  // Generate initial password
  if (!generatedPassword) {
    handleGenerate()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Password Generator
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Generated Password Display */}
          <div className="space-y-2">
            <Label>Generated Password</Label>
            <div className="flex space-x-2">
              <Input
                value={generatedPassword}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                onClick={handleCopy}
                size="icon"
                variant="outline"
                disabled={!generatedPassword}
              >
                <Copy size={16} />
              </Button>
              <Button
                onClick={handleGenerate}
                size="icon"
                variant="outline"
                disabled={isGenerating}
              >
                <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
              </Button>
            </div>
            
            {strength && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Strength: {strength.label}</span>
                  <span>{strength.score}/8</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${strength.color}`}
                    style={{ width: `${(strength.score / 8) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Password Options */}
          <div className="space-y-3">
            <div>
              <Label>Length: {options.length}</Label>
              <input
                type="range"
                min="8"
                max="50"
                value={options.length}
                onChange={(e) => setOptions(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                className="w-full mt-1"
              />
            </div>

            <div className="space-y-2">
              {[
                { key: 'includeUppercase', label: 'Uppercase (A-Z)' },
                { key: 'includeLowercase', label: 'Lowercase (a-z)' },
                { key: 'includeNumbers', label: 'Numbers (0-9)' },
                { key: 'includeSymbols', label: 'Symbols (!@#$...)' },
                { key: 'excludeSimilar', label: 'Exclude similar (il1Lo0O)' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={options[key as keyof typeof options] as boolean}
                    onChange={(e) => setOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleGenerate} className="flex-1" disabled={isGenerating}>
              Generate New
            </Button>
            {onPasswordSelect && (
              <Button
                onClick={handleUsePassword}
                variant="outline"
                className="flex-1"
                disabled={!generatedPassword}
              >
                Use Password
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}