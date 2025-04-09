import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { updateLevelInfo } from "@/features/registerForm/registerFormSlice";
const levelOrder = ["State", "Division", "District", "Block", "Sector/PHC"];

const mockOptions = {
    states: ["Rajasthan", "Delhi", "Maharashtra"],
    divisions: ["Jaipur", "Jodhpur", "Udaipur"],
    districts: ["Jaipur", "Alwar", "Sikar"],
    blocks: ["Bassi", "Chaksu", "Sanganer"],
    sectors: ["Malviya Nagar", "Jagatpura", "Mansarovar"],
    orgTypes: ["Director - MH", "Director - CH", "Director - FW"],
    designations: [
        "Project Director - MH",
        "Deputy Director - MH",
        "Assistant Director - MH",
    ],
};

const Step2UserDetails = () => {
    const dispatch = useDispatch();
    const levelInfo = useSelector((state: RootState) => state.registerForm.levelInfo);

    const geoFields = [
        { key: "State", value: levelInfo.state, field: "state", options: mockOptions.states },
        { key: "Division", value: levelInfo.division, field: "division", options: mockOptions.divisions },
        { key: "District", value: levelInfo.district, field: "district", options: mockOptions.districts },
        { key: "Block", value: levelInfo.block, field: "block", options: mockOptions.blocks },
        { key: "Sector/PHC", value: levelInfo.sector, field: "sector", options: mockOptions.sectors },
    ];

    return (
        <div className="space-y-6">
            <Card className="p-6 rounded-md bg-[#f8f9fc]">
                <h3 className="text-lg font-medium ">Level</h3>
                <hr className=" border-gray-300" />
                <p className="text-sm text-gray-600 ">Select Your Level</p>
                <div className="flex flex-wrap gap-2">
                    {["State", "Division", "District", "Block", "Sector/PHC"].map((level) => (
                        <Button
                            key={level}
                            variant={levelInfo.selectedLevel === level ? "default" : "outline"}
                            className={levelInfo.selectedLevel === level ? "bg-[#183966]" : ""}
                            onClick={() => dispatch(updateLevelInfo({ selectedLevel: level }))}
                        >
                            {level}
                        </Button>
                    ))}
                </div>
            </Card>


            <Card className="p-6 rounded-md bg-[#f8f9fc]">
                <h3 className="text-lg font-medium">Geography</h3>
                <hr className="border-gray-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geoFields
                        .filter(({ key }) => levelOrder.indexOf(key) <= levelOrder.indexOf(levelInfo.selectedLevel))
                        .map(({ key, value, field, options }) => (
                            <div key={key}>
                                <Label className="text-sm text-gray-600 mb-2 block">{`Select ${key}`}</Label>
                                <Select
                                    value={value}
                                    onValueChange={(val) =>
                                        dispatch(updateLevelInfo({ [field]: val }))
                                    }
                                >
                                    <SelectTrigger className="w-full h-12 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-textMain font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                        <SelectValue placeholder={`Select ${key}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                </div>
            </Card>
            <Card className="p-6 rounded-md bg-[#f8f9fc]">
                <h3 className="text-lg font-medium">Department</h3>
                <hr className="border-gray-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm text-gray-600 mb-2 block">
                            Type of Organisation
                        </Label>
                        <Select
                            value={levelInfo.organizationType}
                            onValueChange={(val) =>
                                dispatch(updateLevelInfo({ organizationType: val }))
                            }
                        >
                            <SelectTrigger className="w-full h-12 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-textMain font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockOptions.orgTypes.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm text-gray-600 mb-2 block">Designation</Label>
                        <Select
                            value={levelInfo.designation}
                            onValueChange={(val) =>
                                dispatch(updateLevelInfo({ designation: val }))
                            }
                        >
                            <SelectTrigger className="w-full h-12 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-textMain font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                <SelectValue placeholder="Select Designation" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockOptions.designations.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
        </div>
    );
};
const Step2UserDetailsMemo = React.memo(Step2UserDetails);
export default Step2UserDetailsMemo;
