import { ChevronDown } from "lucide-react"

interface HeaderProps {
  title?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  userName?: string
  userAvatar?: string
  onSearch?: (query: string) => void
  onDownload?: () => void
  className?: string
}

export function Header({
  title = "Application Users",
  breadcrumbs = [{ label: "Platform Users" }, { label: "Application Users" }],
  userName = "Kane",
  userAvatar,
}: HeaderProps) {
  return (
    <div className="flex flex-row items-center p-2 gap-5 w-full h-[76px] bg-[#182E6F] rounded-xl">
      {/* Heading & Path */}
      <div className="flex flex-col justify-center items-start p-0 gap-2.5 flex-1 h-[49px]">
        {/* Title */}
        <h1 className="w-[158px] h-[23px] font-['Roboto'] font-medium text-xl leading-[23px] flex items-center text-white">
          {title}
        </h1>

        {/* Breadcrumb Path */}
        <div className="flex flex-row items-center p-0 w-[218px] h-4 rounded-lg">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex flex-row items-center">
              {index > 0 && (
                <div className="flex flex-row justify-center items-center px-1 w-[14px] h-4 rounded-lg">
                  <span className="w-1.5 h-4 font-['Roboto'] font-normal text-sm leading-4 flex items-center text-center text-white">
                    /
                  </span>
                </div>
              )}
              <div className="flex flex-row justify-center items-center p-0 w-[110px] h-4 rounded-lg">
                <span className="w-[110px] h-4 font-['Roboto'] font-normal text-sm leading-4 flex items-center text-center text-white">
                  {crumb.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Items */}
      <div className="flex flex-row items-center p-1.5 gap-4 w-[224px] h-[60px] bg-[#F6F6F8] rounded-lg">
        {/* Menu Profile Item */}
        <div className="flex flex-row items-center py-1 px-2 gap-4 w-[200px] h-12 bg-white rounded-lg">
          {/* Title */}
          <div className="flex flex-row items-center p-0 gap-2.5 flex-1 h-10">
            {/* User Avatar */}
            <div className="flex flex-row justify-center items-center p-0 gap-2.5 w-10 h-10">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {userAvatar ? (
                  <img
                    src={userAvatar || "/placeholder.svg?height=40&width=40"}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-['Roboto'] font-normal text-sm text-[#303030]">{userName?.charAt(0)}</span>
                )}
              </div>
            </div>

            {/* User Name */}
            <span className="w-[59px] h-[19px] font-['Roboto'] font-normal text-base leading-[19px] flex items-center text-[#303030]">
              Hi, {userName}
            </span>
          </div>

          {/* Arrow Down */}
          <div className="flex flex-row justify-center items-center p-0.5 gap-2.5 w-4 h-4">
            <ChevronDown className="w-3 h-[7.5px] text-[#363636]" />
          </div>
        </div>
      </div>
    </div>
  )
}
