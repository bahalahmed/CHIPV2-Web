/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
const levelOrder = ["State", "Division", "District", "Block", "Sector/PHC"]
import type { RootState } from "@/app/store"
import type { AppDispatch } from "@/app/store"
import {
    loadStates,
    loadDivisions,
    loadDistricts,
    loadBlocks,
    loadSectors,
    loadOrgTypesByState,
    loadDesignations,
    resetGeoData
} from "@/features/geoData/geoDataSlice"
import { updateLevelInfo } from "@/features/registerForm/registerFormSlice"

const Step2UserDetails = () => {

    const dispatch: AppDispatch = useDispatch()
    const levelInfo = useSelector((state: RootState) => state.registerForm.levelInfo)
    const geo = useSelector((state: RootState) => state.geoData)

    // Initial load
    useEffect(() => {
        dispatch(loadStates())
    }, [dispatch])

    useEffect(() => {
        if (levelInfo.state) dispatch(loadDivisions(levelInfo.state))
        if (levelInfo.state) dispatch(loadOrgTypesByState(levelInfo.state))
    }, [dispatch, levelInfo.state])

    useEffect(() => {
        if (levelInfo.division) dispatch(loadDistricts(levelInfo.division))
    }, [dispatch, levelInfo.division])

    useEffect(() => {
        if (levelInfo.district) dispatch(loadBlocks(levelInfo.district))
    }, [dispatch, levelInfo.district])

    useEffect(() => {
        if (levelInfo.block) dispatch(loadSectors(levelInfo.block))
    }, [dispatch, levelInfo.block])

    useEffect(() => {
        if (levelInfo.organizationTypeId) {
            dispatch(loadDesignations({ orgTypeId: levelInfo.organizationTypeId }))
        }
    }, [dispatch, levelInfo.organizationTypeId])




    const geoFields = [
        { key: "State", value: levelInfo.state, field: "state", options: geo.states },
        { key: "Division", value: levelInfo.division, field: "division", options: geo.divisions },
        { key: "District", value: levelInfo.district, field: "district", options: geo.districts },
        { key: "Block", value: levelInfo.block, field: "block", options: geo.blocks },
        { key: "Sector/PHC", value: levelInfo.sector, field: "sector", options: geo.sectors },
    ]
    const getResetPayload = (field: string) => {
        const resetMap: Record<string, string[]> = {
            state: ["division", "district", "block", "sector", "organizationType", "designation"],
            division: ["district", "block", "sector"],
            district: ["block", "sector"],
            block: ["sector"],
            sector: [],
            organizationType: ["designation"]
        }

        return resetMap[field]?.reduce((acc, key) => ({ ...acc, [key]: "" }), {}) || {}
    }



    const isSelected = (level: string) => levelInfo.selectedLevel === level
    const isNoneSelected = !levelInfo.selectedLevel

    const baseClass = "bg-background text-muted-foreground border border-border hover:bg-secondary"

    const selectedClass = "bg-primary text-primary-foreground hover:bg-primary/90"

    return (
        <div className="space-y-6">
            <Card className="p-6 rounded-md bg-muted">
                <h3 className="text-lg font-medium">Level</h3>
                <hr className="border-border" />
                <p className="text-sm text-muted-foreground">Select Your Level</p>

                <div className="flex flex-wrap gap-2">
                    {levelOrder.map((level) => (
                        <Button
                            key={level}
                            variant="default"
                            className={isSelected(level) ? selectedClass : isNoneSelected ? baseClass : baseClass}
                            onClick={() => {
                                dispatch(updateLevelInfo({ selectedLevel: level }))
                            }}
                        >
                            {level}
                        </Button>
                    ))}
                </div>
            </Card>

            <Card className="p-6 rounded-md bg-muted">
                <h3 className="text-lg font-medium">Geography</h3>
                <hr className="border-border" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geoFields.map(({ key, value, field, options }, index) => {
                        const selectedIndex = levelOrder.indexOf(levelInfo.selectedLevel)
                        if (index > selectedIndex) return null

                        if (index > selectedIndex) return null

                        const isDisabled =
                            index > 0 &&
                            !levelInfo[geoFields[index - 1].field as keyof typeof levelInfo]
                        return (
                            <div key={key}>
                                <Label className="text-sm text-muted-foreground mb-2 block">{`Select ${key}`}</Label>
                                <Select
                                    value={value || undefined}
                                    onValueChange={(val) => {
                                        const reset = getResetPayload(field)
                                        dispatch(updateLevelInfo({ [field]: val, ...reset }))
                                        dispatch(resetGeoData(field))
                                    }}
                                    disabled={!!isDisabled}
                                >

                                    <SelectTrigger className="w-full h-12 bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                        <SelectValue>
                                            {options.find((opt) => opt.id === value)?.name || `Select ${key}`}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((opt: any) => (
                                            <SelectItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )
                    })}
                </div>
            </Card>
            <Card className="p-6 rounded-md bg-muted">
                <h3 className="text-lg font-medium">Department</h3>
                <hr className="border-border" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Type of Organisation</Label>
                        <Select
                            value={levelInfo.organizationTypeId || undefined}
                            onValueChange={(val) => {
                                const selected = geo.orgTypes.find((opt) => opt.id === val)
                                dispatch(
                                    updateLevelInfo({
                                        organizationTypeId: val,
                                        organizationTypeLabel: selected?.name || "",
                                        designationId: "",
                                        designationLabel: "",
                                    })
                                )
                                dispatch(resetGeoData("organizationType"))
                                dispatch(loadDesignations({ orgTypeId: val }))
                            }}
                        >
                            <SelectTrigger className="w-full h-12 bg-background border border-border rounded-md px-4 py-2">
                                <SelectValue>{levelInfo.organizationTypeLabel || "Select Type"}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {geo.orgTypes.map((opt: any) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Designation</Label>
                        <Select
                            value={levelInfo.designationId || undefined}
                            onValueChange={(val) => {
                                const selected = geo.designations.find((opt) => opt.id === val)
                                dispatch(updateLevelInfo({ designationId: val, designationLabel: selected?.name || "" }))
                            }}
                            disabled={!levelInfo.organizationTypeId}
                        >
                            <SelectTrigger className="w-full h-12 bg-background border border-border rounded-md px-4 py-2">
                                <SelectValue>{levelInfo.designationLabel || "Select Designation"}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {geo.designations.map((opt: any) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>
        </div>
    )
}
const Step2UserDetailsMemo = React.memo(Step2UserDetails)
export default Step2UserDetailsMemo
