'use client'

import { Folder, FolderPlus, Star, Hash, X } from 'lucide-react'
import { VaultItem } from '@/types'
import { Button } from '@/components/ui/button'

interface VaultSidebarProps {
  selectedFolder: string | null
  onSelectFolder: (folderId: string | null) => void
  items: VaultItem[]
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

export function VaultSidebar({ selectedFolder, onSelectFolder, items, isOpen = true, onClose, className = '' }: VaultSidebarProps) {
  // Calculate dynamic counts
  const calculateCount = (folderId: string) => {
    switch (folderId) {
      case 'all':
        return items.length
      case 'favorites':
        return items.filter(item => item.isFavorite).length
      case 'work':
        return items.filter(item => item.folderId === 'work').length
      case 'personal':
        return items.filter(item => item.folderId === 'personal').length
      default:
        return 0
    }
  }

  const folders = [
    { id: 'all', name: 'All Items', icon: Hash, count: calculateCount('all') },
    { id: 'favorites', name: 'Favorites', icon: Star, count: calculateCount('favorites') },
    { id: 'work', name: 'Work', icon: Folder, count: calculateCount('work') },
    { id: 'personal', name: 'Personal', icon: Folder, count: calculateCount('personal') }
  ]

  const handleFolderSelect = (folderId: string) => {
    onSelectFolder(folderId === 'all' ? null : folderId)
    // Close mobile drawer after selection
    if (onClose && window.innerWidth < 768) {
      onClose()
    }
  }

  const sidebarContent = (
    <>
      {/* Mobile header */}
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Folders</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      <div className="p-3 sm:p-4">
        <div className="space-y-1 sm:space-y-2">
          {folders.map((folder) => {
            const Icon = folder.icon
            const isSelected = selectedFolder === folder.id || (folder.id === 'all' && !selectedFolder)
            
            return (
              <button
                key={folder.id}
                onClick={() => handleFolderSelect(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-sm sm:text-base ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="font-medium truncate">{folder.name}</span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                  {folder.count}
                </span>
              </button>
            )
          })}
        </div>

        <button className="w-full flex items-center space-x-2 sm:space-x-3 px-3 py-2 mt-3 sm:mt-4 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm sm:text-base">
          <FolderPlus size={16} className="flex-shrink-0" />
          <span className="font-medium">New Folder</span>
        </button>
      </div>
    </>
  )

  // Mobile drawer overlay
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar drawer */}
        <aside className={`fixed left-0 top-0 bottom-0 w-64 sm:w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}>
          {sidebarContent}
        </aside>
      </>
    )
  }

  // Desktop sidebar
  return (
    <aside className={`hidden md:block w-56 lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 ${className}`}>
      {sidebarContent}
    </aside>
  )
}