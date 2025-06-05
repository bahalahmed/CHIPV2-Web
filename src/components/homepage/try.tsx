export function Footer() {
    return (
      <footer className="bg-white border-t border-[rgba(2,2,2,0.15)]">
        {/* Desktop layout - matches Figma exactly */}
        <div className="hidden lg:flex justify-between items-center px-16 py-8 gap-16 max-w-[1920px] mx-auto h-[120px]">
          {/* Left section - Helpline */}
          <div className="flex flex-col items-start gap-[6px] w-[245px] h-[54px]">
            <div className="w-[245px] h-6 font-['Poppins'] font-normal text-base leading-6 text-[#303030]">
              Helpline No. : +91-9999999999
            </div>
            <div className="w-[188px] h-6 font-['Poppins'] font-normal text-base leading-6 text-[#303030]">
              <a href="#" className="hover:underline">
                Watch : Training Videos
              </a>
            </div>
          </div>
  
          {/* Center section - Content info */}
          <div className="flex flex-col items-center gap-2 w-[989px] h-14">
            <div className="w-[989px] h-6 font-['Poppins'] font-normal text-base leading-6 text-[#303030] text-center">
              Content Owned & Managed by : National Health Mission (NHM), Dept. of Medical, Health & Family Welfare, Govt.
              of Karnataka
            </div>
            <div className="w-[522px] h-6 font-['Poppins'] font-normal text-base leading-6 text-[#303030] text-center">
              Supported by : Software designed and developed by Khushi Baby
            </div>
          </div>
  
          {/* Right section - Nodal Officer */}
          <div className="flex flex-col items-start gap-[6px] w-[330px] h-[54px]">
            <div className="w-[330px] h-6 font-['Poppins'] font-normal text-base leading-6 text-[#303030]">
              Nodal Officer :Dr. Khanna, IAS (AMD-NHM)
            </div>
            <div className="w-[320px] h-6 font-['Poppins'] font-normal text-base leading-6 text-[#303030]">
              <a href="mailto:HealthOfficials@karnataka.gov.in" className="hover:underline">
                Email : HealthOfficials@karnataka.gov.in
              </a>
            </div>
          </div>
        </div>
  
        {/* Mobile/Tablet layout - responsive */}
        <div className="lg:hidden px-4 py-6">
          <div className="flex flex-col gap-6 text-center">
            {/* Mobile - Helpline */}
            <div className="flex flex-col items-center gap-2">
              <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
                Helpline No. : +91-9999999999
              </div>
              <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
                <a href="#" className="hover:underline">
                  Watch : Training Videos
                </a>
              </div>
            </div>
  
            {/* Mobile - Content info */}
            <div className="flex flex-col items-center gap-2">
              <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
                Content Owned & Managed by : National Health Mission (NHM), Dept. of Medical, Health & Family Welfare,
                Govt. of Karnataka
              </div>
              <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
                Supported by : Software designed and developed by Khushi Baby
              </div>
            </div>
  
            {/* Mobile - Nodal Officer */}
            <div className="flex flex-col items-center gap-2">
              <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
                Nodal Officer :Dr. Khanna, IAS (AMD-NHM)
              </div>
              <div className="font-['Poppins'] font-normal text-sm leading-5 text-[#303030]">
                <a href="mailto:HealthOfficials@karnataka.gov.in" className="hover:underline">
                  Email : HealthOfficials@karnataka.gov.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  