import { AuthForm } from '@/components/auth/auth-form'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 dark:from-violet-900 dark:via-purple-900 dark:to-blue-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/30 via-transparent to-cyan-500/30 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      {/* Theme toggle with glassmorphism effect */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-2xl p-2 border border-white/20 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md mx-auto">
          {/* Enhanced Logo/Brand Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 shadow-2xl mb-6 transform hover:scale-110 transition-all duration-500 hover:rotate-6">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent mb-4 tracking-tight drop-shadow-lg">
              SecureVault
            </h1>
            <p className="text-lg sm:text-xl text-white/90 font-medium mb-4 drop-shadow-md">
              Your privacy-first password manager
            </p>
            <div className="flex items-center justify-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/80">256-bit encryption</span>
              </div>
              <span className="text-white/50">•</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <span className="text-sm text-white/80">Zero-knowledge</span>
              </div>
            </div>
          </div>
          
          {/* Auth Form Container */}
          <AuthForm />
        </div>
      </div>
    </div>
  )
}