import { AdvancedPasswordGenerator } from '@/components/vault/advanced-password-generator'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Theme toggle in top right corner */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Password Generator
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
              Generate secure passwords, passphrases, and PINs
            </p>
          </div>
          
          <AdvancedPasswordGenerator />
        </div>
      </div>
    </div>
  )
}