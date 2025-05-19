

export function Header() {
  return (
    <header className="bg-background border-b border-border py-3 px-4 sm:px-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between">
        
        <div className="hidden sm:flex sm:items-center">
          <img src="src/assets/left.png" alt="Left Logo" className="h-14 w-auto" loading="lazy" />
        </div>

       
        <div className="flex w-full sm:hidden justify-between mb-3">
          <img src="src/assets/left.png" alt="Left Logo" className="h-12 w-auto" loading="lazy" />
          <img src="src/assets/right.png" alt="Right Logo" className="h-12 w-auto" loading="lazy" />
        </div>

       
        <div className="flex flex-col items-center">
          <img
            src="src/assets/india.png"
            alt="Government of India Emblem"
            className="h-10 sm:h-12 w-auto mb-1"
            loading="lazy"
          />
          <div className="text-center">
            <p className="text-xs sm:text-sm text-heading font-medium">Community Health Integrated Platform</p>
            <h1 className="text-lg sm:text-xl font-bold text-heading">CHIP</h1>
          </div>
        </div>

        {/* Right logo - hidden in mobile layout, visible in desktop */}
        <div className="hidden sm:flex sm:items-center">
          <img src="src/assets/right.png" alt="Right Logo" className="h-14 w-auto" loading="lazy" />
        </div>
      </div>
    </header>
  )
}
