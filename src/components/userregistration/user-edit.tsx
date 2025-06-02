"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Header } from "../homepage/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserFormData {
  fullName: string
  gender: string
  department: string
  designation: string
  programsCell: string
  level: string
  stateName: string
  divisionName: string
  districtName: string
  blockName: string
  sectorName: string
}

export default function UserEditPage() {
  const navigate = useNavigate()

  const [userData, setUserData] = useState<UserFormData>({
    fullName: "Rahul Sharma",
    gender: "Male",
    department: "Govt. Officers",
    designation: "Project Director - MH",
    programsCell: "Maternal Health",
    level: "State",
    stateName: "Rajasthan",
    divisionName: "Jaipur",
    districtName: "Jaipur",
    blockName: "Dausa",
    sectorName: "Malviya Nagar",
  })

  const handleChange = (field: keyof UserFormData, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 🚀 Save to backend or state management
    navigate("/user-details")
  }

  const handleCancel = () => {
    navigate("/user-details")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User Registration</h1>

            {/* 🧍 Personal Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={userData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="bg-input border-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={userData.gender} onValueChange={(val) => handleChange("gender", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 🧾 User Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">User Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-4">
                {/* Department */}
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={userData.department} onValueChange={(val) => handleChange("department", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Govt. Officers">Govt. Officers</SelectItem>
                      <SelectItem value="Health Department">Health Department</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Designation */}
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Select value={userData.designation} onValueChange={(val) => handleChange("designation", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Project Director - MH">Project Director - MH</SelectItem>
                      <SelectItem value="Medical Officer">Medical Officer</SelectItem>
                      <SelectItem value="Health Worker">Health Worker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Program/Cell */}
                <div className="space-y-2">
                  <Label>Programs/Cell</Label>
                  <Select value={userData.programsCell} onValueChange={(val) => handleChange("programsCell", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maternal Health">Maternal Health</SelectItem>
                      <SelectItem value="Child Health">Child Health</SelectItem>
                      <SelectItem value="Immunization">Immunization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={userData.level} onValueChange={(val) => handleChange("level", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="State">State</SelectItem>
                      <SelectItem value="District">District</SelectItem>
                      <SelectItem value="Block">Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label>State Name</Label>
                  <Select value={userData.stateName} onValueChange={(val) => handleChange("stateName", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Division */}
                <div className="space-y-2">
                  <Label>Division Name</Label>
                  <Select value={userData.divisionName} onValueChange={(val) => handleChange("divisionName", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jaipur">Jaipur</SelectItem>
                      <SelectItem value="Jodhpur">Jodhpur</SelectItem>
                      <SelectItem value="Udaipur">Udaipur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* District */}
                <div className="space-y-2">
                  <Label>District Name</Label>
                  <Select value={userData.districtName} onValueChange={(val) => handleChange("districtName", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jaipur">Jaipur</SelectItem>
                      <SelectItem value="Alwar">Alwar</SelectItem>
                      <SelectItem value="Sikar">Sikar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Block */}
                <div className="space-y-2">
                  <Label>Block Name</Label>
                  <Select value={userData.blockName} onValueChange={(val) => handleChange("blockName", val)}>
                    <SelectTrigger className="bg-input border-none">
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dausa">Dausa</SelectItem>
                      <SelectItem value="Amber">Amber</SelectItem>
                      <SelectItem value="Sanganer">Sanganer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sector */}
                <div className="space-y-2">
                  <Label>Sector Name</Label>
                  <Input
                    id="sectorName"
                    value={userData.sectorName}
                    onChange={(e) => handleChange("sectorName", e.target.value)}
                    className="bg-input border-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button type="button" variant="outline" onClick={handleCancel} className="border-gray-300">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
