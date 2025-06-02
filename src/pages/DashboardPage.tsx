"use client"

import { useState } from "react"
import { FilterBar } from "@/components/dashboard/FilterBar"
import { StatCards } from "@/components/dashboard/StatCards"
import { RoleTabs } from "@/components/dashboard/RoleTabs"
import { StatusTabs } from "@/components/dashboard/StatusTabs"
import { UsersTable } from "@/components/dashboard/UsersTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download, Search } from "lucide-react"
import { mockUsers } from "@/components/data/mockData"
import { DashboardLayout } from "@/components/dashboard/layout/DashboardLayout"

export default function DashboardPage() {
  const [selectedRole, setSelectedRole] = useState("Medical Officer")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = mockUsers.filter((user) => {
    if (selectedStatus !== "All" && user.status.toLowerCase() !== selectedStatus.toLowerCase()) return false
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-10">
        <FilterBar />

        <div className="mt-2">
          <RoleTabs selectedRole={selectedRole} onRoleChange={setSelectedRole} />
        </div>

        <StatCards />

        <div className="mt-2">
          <StatusTabs selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div></div> {/* Empty div for spacing */}
          <div className="flex gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </div>

        <UsersTable users={filteredUsers} />

        <div className="fixed bottom-6 right-6">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full h-12 w-12 p-0 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
