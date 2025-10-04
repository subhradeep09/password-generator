'use client'

import { useState } from 'react'
import { Search, Plus, Settings, LogOut, Zap, Home, Download, Upload, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface VaultHeaderProps {
  user: { email: string }
  onSignOut: () => void
  onSearch: (query: string) => void
  onShowGenerator: () => void
  onShowAdvancedGenerator?: () => void
  onAddItem: () => void
  onShowExportImport?: () => void
  onShowMobileSidebar?: () => void
  currentView?: 'dashboard' | 'generator'
  onBackToDashboard?: () => void
}

export function VaultHeader({ 
  user, 
  onSignOut, 
  onSearch, 
  onShowGenerator, 
  onShowAdvancedGenerator, 
  onAddItem, 
  onShowExportImport,
  onShowMobileSidebar,
  currentView = 'dashboard',
  onBackToDashboard 
}: VaultHeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Main header content */}
        <div className="flex items-center justify-between">
          {/* Left section - Logo and search */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            {/* Mobile sidebar toggle */}
            {onShowMobileSidebar && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={onShowMobileSidebar}
              >
                <Menu size={16} />
              </Button>
            )}
            
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              SecureVault
            </h1>
            
            {/* Desktop search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search vault..."
                className="pl-10 w-48 lg:w-64"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
            
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search size={16} />
            </Button>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {currentView === 'generator' ? (
                <Button 
                  onClick={onBackToDashboard}
                  variant="outline"
                  size="sm"
                  className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-600"
                >
                  <Home size={14} className="mr-1" />
                  <span className="hidden lg:inline">Dashboard</span>
                </Button>
              ) : (
                <>
                  {onShowAdvancedGenerator && (
                    <button
                      onClick={onShowAdvancedGenerator}
                      className="inline-flex items-center px-3 lg:px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                    >
                      <Zap size={14} className="mr-1.5" />
                      <span className="hidden lg:inline">Password Generator</span>
                    </button>
                  )}
                  {onShowExportImport && (
                    <Button 
                      onClick={onShowExportImport} 
                      variant="outline" 
                      size="sm"
                      className="bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-600"
                    >
                      <Download size={14} className="mr-1" />
                      <span className="hidden lg:inline">Export</span>
                    </Button>
                  )}
                  <Button onClick={onAddItem} size="sm">
                    <Plus size={16} className="mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                </>
              )}
            </div>
            
            <ThemeToggle />
            
            {/* User menu */}
            <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span className="hidden lg:inline truncate max-w-32">{user.email}</span>
              <Button onClick={onSignOut} variant="ghost" size="icon">
                <LogOut size={16} />
              </Button>
            </div>
            
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={16} /> : <Menu size={16} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile search bar */}
        {showMobileSearch && (
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search vault..."
                className="pl-10 w-full"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="mt-3 sm:hidden border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="space-y-2">
              {currentView === 'generator' ? (
                <Button 
                  onClick={() => {
                    onBackToDashboard?.()
                    setShowMobileMenu(false)
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-600"
                >
                  <Home size={14} className="mr-2" />
                  Dashboard
                </Button>
              ) : (
                <>
                  {onShowAdvancedGenerator && (
                    <Button
                      onClick={() => {
                        onShowAdvancedGenerator()
                        setShowMobileMenu(false)
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border-blue-300 dark:border-blue-600"
                    >
                      <Zap size={14} className="mr-2" />
                      Password Generator
                    </Button>
                  )}
                  {onShowExportImport && (
                    <Button 
                      onClick={() => {
                        onShowExportImport()
                        setShowMobileMenu(false)
                      }}
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-600"
                    >
                      <Download size={14} className="mr-2" />
                      Export/Import
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      onAddItem()
                      setShowMobileMenu(false)
                    }}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Item
                  </Button>
                </>
              )}
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1 mr-2">
                    {user.email}
                  </span>
                  <Button 
                    onClick={() => {
                      onSignOut()
                      setShowMobileMenu(false)
                    }}
                    variant="ghost" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <LogOut size={16} className="mr-1" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}