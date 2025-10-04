'use client'

import { useState } from 'react'
import { VaultItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Eye, EyeOff, Folder, Hash, Star } from 'lucide-react'

interface VaultItemFormProps {
  item?: VaultItem | null
  onSave: (item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  onClose: () => void
}

export function VaultItemForm({ item, onSave, onClose }: VaultItemFormProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    username: item?.username || '',
    password: item?.password || '',
    url: item?.url || '',
    notes: item?.notes || '',
    tags: item?.tags || [],
    folderId: item?.folderId || '',
    isFavorite: item?.isFavorite || false
  })

  const [showPassword, setShowPassword] = useState(false)

  // Available folders for selection
  const folders = [
    { id: '', name: '📁 No Folder', icon: Hash },
    { id: 'work', name: '💼 Work', icon: Folder },
    { id: 'personal', name: '👤 Personal', icon: Folder }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, tags }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="e.g., Gmail, Facebook, Work Account"
            />
          </div>

          <div>
            <Label htmlFor="username">Username/Email</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="your@email.com or username"
            />
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Enter password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="folder">Folder</Label>
            <select
              id="folder"
              value={formData.folderId}
              onChange={(e) => setFormData(prev => ({ ...prev, folderId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {folders.map((folder) => {
                return (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                )
              })}
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choose a folder to organize your password
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="work, social, banking"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.isFavorite}
              onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="favorite">Add to favorites</Label>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {item ? 'Update' : 'Save'} Item
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}