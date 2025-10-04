'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Upload, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { VaultItem } from '@/types'
import { toast } from 'react-hot-toast'

interface VaultExportImportProps {
  isOpen: boolean
  onClose: () => void
  items: VaultItem[]
  onImport: (items: VaultItem[]) => void
}

interface ExportData {
  exported_at: string
  app_name: string
  version: string
  total_items: number
  items: Array<{
    title: string
    username: string
    password: string
    url?: string
    notes?: string
    tags: string[]
    folder: string
    favorite: boolean
    created_at: string
    updated_at: string
  }>
}

interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  duplicates: number
}

export function VaultExportImport({ isOpen, onClose, items, onImport }: VaultExportImportProps) {
  const [activeTab, setActiveTab] = useState('export')
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json')
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      if (exportFormat === 'json') {
        exportAsJSON()
      } else {
        exportAsCSV()
      }
      toast.success(`Exported ${items.length} items successfully!`)
    } catch (error) {
      toast.error('Failed to export vault data')
      console.error('Export error:', error)
    }
  }

  const exportAsJSON = () => {
    const exportData: ExportData = {
      exported_at: new Date().toISOString(),
      app_name: 'SecureVault',
      version: '1.0.0',
      total_items: items.length,
      items: items.map(item => ({
        title: item.title,
        username: item.username,
        password: item.password,
        url: item.url || '',
        notes: item.notes || '',
        tags: item.tags,
        folder: item.folderId || '',
        favorite: item.isFavorite,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString()
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    downloadFile(blob, `securevault-backup-${new Date().toISOString().slice(0, 10)}.json`)
  }

  const exportAsCSV = () => {
    const headers = ['Title', 'Username', 'Password', 'URL', 'Notes', 'Tags', 'Folder', 'Favorite', 'Created', 'Updated']
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        escapeCSV(item.title),
        escapeCSV(item.username),
        escapeCSV(item.password),
        escapeCSV(item.url || ''),
        escapeCSV(item.notes || ''),
        escapeCSV(item.tags.join('; ')),
        escapeCSV(item.folderId || ''),
        item.isFavorite ? 'Yes' : 'No',
        item.createdAt.toISOString(),
        item.updatedAt.toISOString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    downloadFile(blob, `securevault-backup-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const escapeCSV = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setImportResult(null)

    try {
      const content = await file.text()
      let result: ImportResult

      if (file.name.endsWith('.json')) {
        result = await importFromJSON(content)
      } else if (file.name.endsWith('.csv')) {
        result = await importFromCSV(content)
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV files.')
      }

      setImportResult(result)
      
      if (result.success && result.imported > 0) {
        toast.success(`Successfully imported ${result.imported} items!`)
      } else if (result.errors.length > 0) {
        toast.error(`Import completed with ${result.errors.length} errors`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import file')
      setImportResult({
        success: false,
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        duplicates: 0
      })
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const importFromJSON = async (content: string): Promise<ImportResult> => {
    const data = JSON.parse(content)
    const errors: string[] = []
    const importedItems: VaultItem[] = []
    let duplicates = 0

    // Handle different JSON formats
    let itemsToImport: any[] = []
    
    if (data.items && Array.isArray(data.items)) {
      // SecureVault format
      itemsToImport = data.items
    } else if (Array.isArray(data)) {
      // Simple array format
      itemsToImport = data
    } else if (data.entries && Array.isArray(data.entries)) {
      // Bitwarden-like format
      itemsToImport = data.entries
    } else {
      throw new Error('Unsupported JSON format')
    }

    for (let i = 0; i < itemsToImport.length; i++) {
      try {
        const item = itemsToImport[i]
        
        // Check for duplicates
        const exists = items.some(existing => 
          existing.title === item.title && existing.username === item.username
        )
        
        if (exists) {
          duplicates++
          continue
        }

        const newItem: VaultItem = {
          id: generateId(),
          title: item.title || item.name || `Imported Item ${i + 1}`,
          username: item.username || item.login?.username || '',
          password: item.password || item.login?.password || '',
          url: item.url || item.login?.uris?.[0]?.uri || '',
          notes: item.notes || item.notes || '',
          tags: Array.isArray(item.tags) ? item.tags : [],
          folderId: item.folder || item.folderId || '',
          isFavorite: item.favorite || item.isFavorite || false,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          updatedAt: item.updated_at ? new Date(item.updated_at) : new Date()
        }

        importedItems.push(newItem)
      } catch (error) {
        errors.push(`Item ${i + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`)
      }
    }

    if (importedItems.length > 0) {
      onImport(importedItems)
    }

    return {
      success: errors.length === 0,
      imported: importedItems.length,
      errors,
      duplicates
    }
  }

  const importFromCSV = async (content: string): Promise<ImportResult> => {
    const lines = content.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const errors: string[] = []
    const importedItems: VaultItem[] = []
    let duplicates = 0

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i])
        const item: any = {}
        
        headers.forEach((header, index) => {
          item[header.toLowerCase()] = values[index] || ''
        })

        // Check for duplicates
        const exists = items.some(existing => 
          existing.title === item.title && existing.username === item.username
        )
        
        if (exists) {
          duplicates++
          continue
        }

        const newItem: VaultItem = {
          id: generateId(),
          title: item.title || `Imported Item ${i}`,
          username: item.username || '',
          password: item.password || '',
          url: item.url || '',
          notes: item.notes || '',
          tags: item.tags ? item.tags.split(';').map((t: string) => t.trim()) : [],
          folderId: item.folder || '',
          isFavorite: item.favorite?.toLowerCase() === 'yes' || item.favorite === 'true',
          createdAt: item.created ? new Date(item.created) : new Date(),
          updatedAt: item.updated ? new Date(item.updated) : new Date()
        }

        importedItems.push(newItem)
      } catch (error) {
        errors.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Invalid format'}`)
      }
    }

    if (importedItems.length > 0) {
      onImport(importedItems)
    }

    return {
      success: errors.length === 0,
      imported: importedItems.length,
      errors,
      duplicates
    }
  }

  const parseCSVLine = (line: string): string[] => {
    const values: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    values.push(current.trim())
    return values
  }

  const generateId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 sm:p-6 pb-2">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <FileText size={18} className="sm:w-5 sm:h-5" />
            <span>Vault Export & Import</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="export" className="flex items-center space-x-2 text-sm">
                <Download size={14} />
                <span>Export</span>
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center space-x-2 text-sm">
                <Upload size={14} />
                <span>Import</span>
              </TabsTrigger>
            </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Export Your Vault</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Download all your passwords and vault data as a backup file. You can choose between JSON (recommended) or CSV format.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Export Format</Label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="format"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                      className="text-blue-600"
                    />
                    <span className="text-sm">JSON (Recommended)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                      className="text-blue-600"
                    />
                    <span className="text-sm">CSV</span>
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium mb-1">Security Notice</p>
                    <p>The exported file will contain your passwords in plain text. Store it securely and delete it after use.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Total Items: {items.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Export format: {exportFormat.toUpperCase()}
                  </p>
                </div>
                <Button onClick={handleExport} disabled={items.length === 0}>
                  <Download size={16} className="mr-2" />
                  Export Vault
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 dark:text-green-300 mb-2">Import Passwords</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                Import passwords from SecureVault backups, other password managers, or CSV files. Supported formats: JSON, CSV.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Select File</Label>
                <div className="mt-2">
                  <Button 
                    onClick={handleFileSelect} 
                    variant="outline" 
                    disabled={isProcessing}
                    className="w-full"
                  >
                    <Upload size={16} className="mr-2" />
                    {isProcessing ? 'Processing...' : 'Choose File (JSON or CSV)'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {importResult && (
                <div className={`p-4 rounded-lg ${
                  importResult.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
                }`}>
                  <div className="flex items-center space-x-2 mb-3">
                    {importResult.success ? (
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                    )}
                    <h4 className={`font-medium ${
                      importResult.success ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                    }`}>
                      Import {importResult.success ? 'Completed' : 'Failed'}
                    </h4>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p>✅ Successfully imported: {importResult.imported} items</p>
                    {importResult.duplicates > 0 && (
                      <p>⏭️ Skipped duplicates: {importResult.duplicates} items</p>
                    )}
                    {importResult.errors.length > 0 && (
                      <div>
                        <p className="text-red-600 dark:text-red-400 font-medium">❌ Errors:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {importResult.errors.slice(0, 5).map((error, index) => (
                            <li key={index} className="text-red-600 dark:text-red-400">{error}</li>
                          ))}
                          {importResult.errors.length > 5 && (
                            <li className="text-red-600 dark:text-red-400">
                              ... and {importResult.errors.length - 5} more errors
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Supported Formats</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• SecureVault JSON exports</li>
                  <li>• Bitwarden JSON exports</li>
                  <li>• CSV files with headers</li>
                  <li>• Generic JSON arrays</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} className="text-sm">
            <X size={14} className="mr-1 sm:mr-2" />
            Close
          </Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}