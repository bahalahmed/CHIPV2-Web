"use client"

import { useNavigate } from "react-router-dom"
import { HeaderWithApi } from "../homepage/header-with-api"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"

export default function UserDetailsPage() {
  const navigate = useNavigate()

  const { levelInfo, personalInfo } = useSelector((state: RootState) => state.registerForm)
  const geo = useSelector((state: RootState) => state.geoData)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLabelById = (list: any[], id: string) => {
    return list.find((item) => item.id === id)?.name || "-"
  }

  const handleEdit = () => navigate("/user-edit")
  const handleBackToLogin = () => navigate("/")

  const renderRow = (label: string, value: string) => (
    <div className="flex">
      <span className="w-1/3 text-gray-500">{label}:</span>
      <span className="w-2/3 font-medium text-primary">{value || "-"}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithApi />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">User Registration Details</h1>

            {/* Personal Info */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
                  onClick={handleEdit}
                >
                  <span className="mr-1">✏️</span> Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                {renderRow("Full Name", personalInfo.fullName)}
                {renderRow("Gender", personalInfo.gender)}
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">User Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                {renderRow("Department", getLabelById(geo.orgTypes, levelInfo.organizationTypeId))}
                {renderRow("Designation", getLabelById(geo.designations, levelInfo.designationId))}
                {renderRow("Programs/Cell", "-")}
                {renderRow("Level", levelInfo.selectedLevel)}
                {renderRow("State Name", getLabelById(geo.states, levelInfo.state))}
                {renderRow("Division Name", getLabelById(geo.divisions, levelInfo.division))}
                {renderRow("District Name", getLabelById(geo.districts, levelInfo.district))}
                {renderRow("Block Name", getLabelById(geo.blocks, levelInfo.block))}
                {renderRow("Sector Name", getLabelById(geo.sectors, levelInfo.sector))}
              </div>
            </div>

            {/* Approval Section */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-red-600 mb-1">Approval pending</h3>
              <p className="text-gray-700 mb-2">
                Request Id: <span className="text-primary font-semibold">#KB-APP-{Date.now()}</span>
              </p>
              <p className="text-gray-600 mb-4">
                Request for approval has been sent to higher authorities. Kindly wait for the approval.
                After approval you will be able to log in to your dashboard.
              </p>
              <a href="#" className="text-primary hover:underline font-medium">
                Contact Your Admin
              </a>
              <div className="mt-4">
                <Button className="bg-primary hover:bg-primary/90" onClick={handleBackToLogin}>
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
