'use client'

import { VaultItem } from '@/types'
import { Copy, Edit, Trash2, Eye, EyeOff, Globe, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface VaultItemsListProps {
  items: VaultItem[]
  onEdit: (item: VaultItem) => void
  onDelete: (id: string) => void
}

export function VaultItemsList({ items, onEdit, onDelete }: VaultItemsListProps) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())

  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisiblePasswords(newVisible)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
      
      // Auto-clear after 15 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('')
      }, 15000)
    } catch (error) {
      toast.error(`Failed to copy ${label.toLowerCase()}`)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="text-gray-400 mb-4">
          <Globe size={40} className="mx-auto sm:w-12 sm:h-12" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          No items found
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Add your first password to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe size={16} className="sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {item.title}
                  </h3>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block"
                    >
                      {item.url}
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                {item.username && (
                  <div className="flex items-center justify-between py-1 min-w-0">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-1">
                      <User size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span className="truncate">{item.username}</span>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(item.username, 'Username')}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0 ml-2"
                    >
                      <Copy size={12} className="sm:w-3.5 sm:h-3.5" />
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between py-1 min-w-0">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-1">
                    <span className="text-xs sm:text-sm">Password:</span>
                    <span className="font-mono text-xs sm:text-sm truncate">
                      {visiblePasswords.has(item.id) ? item.password : '••••••••'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                    <Button
                      onClick={() => togglePasswordVisibility(item.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                    >
                      {visiblePasswords.has(item.id) ? 
                        <EyeOff size={12} className="sm:w-3.5 sm:h-3.5" /> : 
                        <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                      }
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(item.password, 'Password')}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                    >
                      <Copy size={12} className="sm:w-3.5 sm:h-3.5" />
                    </Button>
                  </div>
                </div>

                {item.notes && (
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {item.notes}
                  </div>
                )}

                {/* Mobile tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 sm:hidden">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons - responsive layout */}
            <div className="flex sm:flex-col items-center space-x-2 sm:space-x-0 sm:space-y-2 sm:ml-4 mt-3 sm:mt-0">
              <Button
                onClick={() => onEdit(item)}
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none h-8 sm:h-9"
              >
                <Edit size={12} className="sm:w-3.5 sm:h-3.5 mr-1 sm:mr-0" />
                <span className="sm:hidden">Edit</span>
              </Button>
              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this item?')) {
                    onDelete(item.id)
                  }
                }}
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700 h-8 sm:h-9"
              >
                <Trash2 size={12} className="sm:w-3.5 sm:h-3.5 mr-1 sm:mr-0" />
                <span className="sm:hidden">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}