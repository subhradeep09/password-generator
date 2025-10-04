'use client'

import { useEffect } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Theme toggle in top right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-400 dark:text-red-500 mb-4">
            Oops!
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We&apos;re sorry, but an unexpected error occurred. Please try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors mr-4"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}