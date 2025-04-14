import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import React from "react";


interface ReviewInfoProps {
    mobileNumber: string;
    whatsappNumber: string;
    email: string;
    selectedLevel: string;
    state: string;
    division: string;
    district: string;
    block: string;
    sector: string;
    organizationType: string;
    designation: string;
    fullName: string;
    gender: string;
    password: string;
  }
  
  interface Step4ApprovalProps {
    reviewInfo: ReviewInfoProps;
  }
  const Step4Approval = ({ reviewInfo }: Step4ApprovalProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const renderRow = (label: string, value: string) => (
        <div className="flex justify-between">
            <span className="text-gray-600">{label} :</span>
            <span className="text-[var(--primary)] font-medium">{value}</span>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card className="bg-[var(--bg-light)] p-6 rounded-md">
                <h3 className="text-lg font-semibold ">Verification</h3>
                <hr className=" border-gray-300" />
                {renderRow("Mobile Number", reviewInfo.mobileNumber)}
                {renderRow("WhatsApp Number", reviewInfo.whatsappNumber)}
                {renderRow("Email ID",reviewInfo.email)}
            </Card>

            <Card className="bg-[var(--bg-light)] p-6 rounded-md">
                <h3 className="text-lg font-semibold ">Level</h3>
                <hr className=" border-gray-300" />
                {renderRow("Level", reviewInfo.selectedLevel)}
            </Card>

            <Card className="bg-[var(--bg-light)] p-6 rounded-md">
                <h3 className="text-lg font-semibold ">Geography</h3>
                <hr className=" border-gray-300" />
                {renderRow("State", reviewInfo.state)}
                {renderRow("Division", reviewInfo.division)}
                {renderRow("District", reviewInfo.district)}
                {renderRow("Block", reviewInfo.block)}
                {renderRow("Sector", reviewInfo.sector)}
            </Card>

            <Card className="bg-[var(--bg-light)] p-6 rounded-md">
                <h3 className="text-lg font-semibold ">Department</h3>
                <hr className=" border-gray-300" />
                {renderRow("Type of Organisation", reviewInfo.organizationType)}
                {renderRow("Designation", reviewInfo.designation)}
            </Card>
            <Card className="bg-[var(--bg-light)] p-6 rounded-md">

                <h3 className="text-lg font-semibold ">Personal Information</h3>
                <hr className=" border-gray-300" />
                {renderRow("Full Name", reviewInfo.fullName)}
                {renderRow("Gender", reviewInfo.gender)}
            </Card>
            <Card className="bg-[var(--bg-light)] p-6 rounded-md">
                <div className="flex justify-between items-center ">
                    <h3 className="text-lg font-semibold">Password</h3>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-sm text-[var(--primary)] flex items-center gap-1 hover:bg-transparent hover:text-[var(--primary)]"
                    >
                        {showPassword ? (
                            <>
                                <EyeOff className="w-4 h-4" />
                                Hide
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />
                                Show
                            </>
                        )}
                    </Button>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-600">Password</Label>
                    <span className="text-[var(--primary)] font-medium text-sm">
                        {showPassword ? reviewInfo.password : "********"}
                    </span>
                </div>

            </Card>
        </div>
    );
};

const MemoizedStep4Approval = React.memo(Step4Approval);
export default MemoizedStep4Approval;






