'use client'

import { useState, useEffect } from 'react'
import { VaultItem } from '@/types'
import { VaultHeader } from './vault-header'
import { VaultSidebar } from './vault-sidebar'
import { VaultItemsList } from './vault-items-list'
import { VaultItemForm } from './vault-item-form'
import { PasswordGenerator } from './password-generator'
import { AdvancedPasswordGenerator } from './advanced-password-generator'
import { VaultExportImport } from './vault-export-import'
import { getCurrentUser, signOut } from '@/lib/auth'
import { generateId } from '@/lib/helpers'
import { toast } from 'react-hot-toast'

export function VaultDashboard() {
  const [user, setUser] = useState<{ email: string; userId: string } | null>(null)
  const [items, setItems] = useState<VaultItem[]>([])
  const [filteredItems, setFilteredItems] = useState<VaultItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showExportImport, setShowExportImport] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator'>('dashboard')

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      window.location.href = '/'
      return
    }
    setUser({ email: currentUser.email, userId: currentUser.email }) // Use email as userId temporarily
    loadVaultItems()
  }, [])

  useEffect(() => {
    let filtered = items

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedFolder) {
      console.log('🔍 Filtering by folder:', selectedFolder)
      if (selectedFolder === 'favorites') {
        filtered = filtered.filter(item => item.isFavorite)
      } else {
        filtered = filtered.filter(item => item.folderId === selectedFolder)
      }
      console.log('📁 Items in folder:', filtered.length)
    }

    setFilteredItems(filtered)
  }, [items, searchQuery, selectedFolder])

  const loadVaultItems = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch('/api/vault', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to load vault items:', error)
    }
  }

  const saveVaultItems = (newItems: VaultItem[]) => {
    // In a real app, these would be encrypted before storing
    localStorage.setItem('vault_items', JSON.stringify(newItems))
    setItems(newItems)
  }

  const handleAddItem = (item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: VaultItem = {
      ...item,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('💾 Adding new item:', { title: newItem.title, folderId: newItem.folderId })
    
    const newItems = [...items, newItem]
    saveVaultItems(newItems)
    setShowForm(false)
    toast.success(`Item added to ${newItem.folderId === 'work' ? 'Work' : newItem.folderId === 'personal' ? 'Personal' : 'All Items'}`)
  }

  const handleEditItem = (item: VaultItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleUpdateItem = (updatedItem: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingItem) return

    const newItem: VaultItem = {
      ...updatedItem,
      id: editingItem.id,
      createdAt: editingItem.createdAt,
      updatedAt: new Date()
    }

    const newItems = items.map(item => 
      item.id === editingItem.id ? newItem : item
    )
    saveVaultItems(newItems)
    setEditingItem(null)
    setShowForm(false)
    toast.success('Item updated successfully')
  }

  const handleDeleteItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id)
    saveVaultItems(newItems)
    toast.success('Item deleted successfully')
  }

  const handleImport = (importedItems: VaultItem[]) => {
    const newItems = [...items, ...importedItems]
    saveVaultItems(newItems)
    setShowExportImport(false)
  }

  const handleSignOut = () => {
    signOut()
    window.location.href = '/'
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <VaultHeader
        user={user}
        onSignOut={handleSignOut}
        onSearch={setSearchQuery}
        onShowGenerator={() => setShowGenerator(true)}
        onShowAdvancedGenerator={() => setCurrentView('generator')}
        onAddItem={() => setShowForm(true)}
        onShowExportImport={() => setShowExportImport(true)}
        onShowMobileSidebar={() => setShowMobileSidebar(true)}
        currentView={currentView}
        onBackToDashboard={() => setCurrentView('dashboard')}
      />
      
      <div className="flex">
        <VaultSidebar
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          items={items}
          isOpen={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
        />
        
        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6">
          {currentView === 'dashboard' ? (
            <>
              {/* Mobile folder toggle */}
              <div className="md:hidden mb-4">
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-sm font-medium">Browse Folders</span>
                </button>
              </div>
              
              <VaultItemsList
                items={filteredItems}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            </>
          ) : currentView === 'generator' ? (
            <div className="max-w-4xl mx-auto">
              <AdvancedPasswordGenerator />
            </div>
          ) : null}
        </main>
      </div>

      {showGenerator && (
        <PasswordGenerator
          onClose={() => setShowGenerator(false)}
        />
      )}

      {showForm && (
        <VaultItemForm
          item={editingItem}
          onSave={editingItem ? handleUpdateItem : handleAddItem}
          onClose={() => {
            setShowForm(false)
            setEditingItem(null)
          }}
        />
      )}

      {showExportImport && (
        <VaultExportImport
          isOpen={showExportImport}
          onClose={() => setShowExportImport(false)}
          items={items}
          onImport={handleImport}
        />
      )}
    </div>
  )
}