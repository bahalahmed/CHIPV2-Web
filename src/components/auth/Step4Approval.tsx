import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import React from "react"
import { useAppDispatch } from '@/hooks/reduxHooks'

import { setStep } from "@/features/registerForm/registerFormSlice"
import { useAppSelector } from '@/hooks/reduxHooks'

import type { RootState } from "@/app/store"


interface ReviewInfoProps {
    mobileNumber: string
    whatsappNumber: string
    email: string
    selectedLevel: string
    state: string
    division: string
    district: string
    block: string
    sector: string
    organizationType: string
    organization: string
    designation: string
    firstName: string
    lastName?: string
}

interface Step4ApprovalProps {
    reviewInfo: ReviewInfoProps
}

const Step4Approval = ({ reviewInfo }: Step4ApprovalProps) => {
    const dispatch = useAppDispatch()

    const geo = useAppSelector((state: RootState) => state.geoData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getLabelById = (list: any[], id: string) => {
        return list.find((item) => item.id === id)?.name || "-"
    }


    const renderRow = (label: string, value: string) => (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label} :</span>
            <span className="text-primary font-medium">{value}</span>
        </div>
    )

    const renderHeader = (title: string, stepNum: number) => (
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(setStep(stepNum))}
                className="text-sm text-primary flex items-center gap-1 hover:bg-transparent hover:text-primary"
            >

            </Button>
        </div>
    )

    return (
        <div className="space-y-6">
            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Verification", 1)}
                <hr className="border-border" />
                {renderRow("Mobile Number", reviewInfo.mobileNumber)}
                {renderRow("WhatsApp Number", reviewInfo.whatsappNumber)}
                {renderRow("Email ID", reviewInfo.email)}
            </Card>

            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Level", 2)}
                <hr className="border-border" />
                {renderRow("Level", reviewInfo.selectedLevel)}
            </Card>

            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Geography", 2)}
                <hr className="border-border" />
                {renderRow("State", getLabelById(geo.states, reviewInfo.state))}
                {renderRow("Division", getLabelById(geo.divisions, reviewInfo.division))}
                {renderRow("District", getLabelById(geo.districts, reviewInfo.district))}
                {renderRow("Block", getLabelById(geo.blocks, reviewInfo.block))}
                {renderRow("Sector", getLabelById(geo.sectors, reviewInfo.sector))}
            </Card>

            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Department", 2)}
                <hr className="border-border" />
                {renderRow("Type of Organisation", getLabelById(geo.orgTypes, reviewInfo.organizationType))}
                {renderRow("Name of Organisation", getLabelById(geo.organizations, reviewInfo.organization))}
                {renderRow("Designation", getLabelById(geo.designations, reviewInfo.designation))}
            </Card>


            <Card className="bg-muted p-6 rounded-md">
                {renderHeader("Personal Information", 3)}
                <hr className="border-border" />
                {renderRow("First Name", reviewInfo.firstName)}
                {reviewInfo.lastName && renderRow("Last Name", reviewInfo.lastName)}
            </Card>


        </div>
    )
}

const MemoizedStep4Approval = React.memo(Step4Approval)
export default MemoizedStep4Approval
