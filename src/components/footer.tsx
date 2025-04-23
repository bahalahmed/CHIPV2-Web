export function Footer() {
  return (
    <footer className="py-3 px-4 md:px-8 text-[#606060] text-xs md:text-sm border-t border-[#d1d5db] bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Left section */}
          <div className="flex flex-col items-center md:items-start space-y-1">
            <div>
              Helpline No.: <span className="font-medium">+91-7023025679</span>
            </div>
            <div>
              <a href="#" className="hover:underline hover:text-[#183966]">
                Watch: Training Videos
              </a>
            </div>
          </div>

          {/* Center section */}
          <div className="text-center md:text-left leading-relaxed">
            <div>
              Content Owned & Managed by:{" "} <span className="font-small">
      National Health Mission (NHM), Dept. of Medical, Health & Family Welfare,
      Govt. of Rajasthan
    </span>
            </div>
           
            <div text-center md:text-left >
              Supported by: Software designed and developed by Khushi Baby
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col items-center md:items-end space-y-1">
            <div>Nodal Officer: Dr. Arun Garg, IAS (AMD-NHM)</div>
            <div>
              <a href="mailto:amdnhm.raj@gmail.com" className="hover:underline hover:text-[#183966]">
                Email: amdnhm.raj@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
