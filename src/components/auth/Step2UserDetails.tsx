/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
const levelOrder = ["State", "Division", "District", "Block", "PHC/CHC"]
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
    resetGeoData,
    loadOrganizations
} from "@/features/geoData/geoDataSlice"
import { updateLevelInfo } from "@/features/registerForm/registerFormSlice"
import { step2Schema, type Step2FormData, validateField } from "@/lib/validations"

// ✅ Better type definitions
interface GeoOption {
    id: string
    name: string
}

interface GeoField {
    key: string
    value: string
    field: string
    options: GeoOption[]
}

interface LoadingStates {
    states: boolean
    divisions: boolean
    districts: boolean
    blocks: boolean
    sectors: boolean
    orgTypes: boolean
    organizations: boolean
    designations: boolean
}

const Step2UserDetails = () => {
    const dispatch: AppDispatch = useDispatch()
    const levelInfo = useSelector((state: RootState) => state.registerForm.levelInfo)
    const geo = useSelector((state: RootState) => state.geoData)

    // ✅ Loading states for each data type
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        states: false,
        divisions: false,
        districts: false,
        blocks: false,
        sectors: false,
        orgTypes: false,
        organizations: false,
        designations: false
    })

    // ✅ Error states for inline validation
    const [fieldErrors, setFieldErrors] = useState<{
        selectedLevel?: string
        state?: string
        division?: string
        district?: string
        block?: string
        sector?: string
        organizationTypeId?: string
        organizationId?: string
        designationId?: string
    }>({})

    // ✅ React Hook Form with Zod validation
    const {
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        trigger,
        watch,
        getValues
    } = useForm<Step2FormData>({
        resolver: zodResolver(step2Schema),
        mode: "onChange",
        defaultValues: {
            selectedLevel: levelInfo.selectedLevel as any || undefined,
            state: levelInfo.state || "",
            division: levelInfo.division || "",
            district: levelInfo.district || "",
            block: levelInfo.block || "",
            sector: levelInfo.sector || "",
            organizationTypeId: levelInfo.organizationTypeId || "",
            organizationId: levelInfo.organizationId || "",
            designationId: levelInfo.designationId || "",
        }
    })

    // ✅ Sync form values with Redux state
    useEffect(() => {
        setValue("selectedLevel", levelInfo.selectedLevel as any)
        setValue("state", levelInfo.state || "")
        setValue("division", levelInfo.division || "")
        setValue("district", levelInfo.district || "")
        setValue("block", levelInfo.block || "")
        setValue("sector", levelInfo.sector || "")
        setValue("organizationTypeId", levelInfo.organizationTypeId || "")
        setValue("organizationId", levelInfo.organizationId || "")
        setValue("designationId", levelInfo.designationId || "")
    }, [levelInfo, setValue])

    // ✅ Update field errors
    const updateFieldError = (fieldName: keyof typeof fieldErrors, error?: string) => {
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: error
        }))
    }

    // ✅ Enhanced data loading with loading states and error handling
    const loadDataWithState = async (
        loadingKey: keyof LoadingStates,
        thunkAction: any,
        errorContext: string
    ) => {
        setLoadingStates(prev => ({ ...prev, [loadingKey]: true }))
        
        try {
            await dispatch(thunkAction).unwrap()
        } catch (error) {
            console.error(`Failed to load ${errorContext}:`, error)
            toast.error(`Failed to load ${errorContext}. Please try again.`)
        } finally {
            setLoadingStates(prev => ({ ...prev, [loadingKey]: false }))
        }
    }

    // ✅ Initial load with error handling
    useEffect(() => {
        loadDataWithState('states', loadStates(), 'states')
    }, [dispatch])

    useEffect(() => {
        if (levelInfo.state) {
            loadDataWithState('divisions', loadDivisions(levelInfo.state), 'divisions')
            loadDataWithState('orgTypes', loadOrgTypesByState(levelInfo.state), 'organization types')
        }
    }, [dispatch, levelInfo.state])

    useEffect(() => {
        if (levelInfo.division) {
            loadDataWithState('districts', loadDistricts(levelInfo.division), 'districts')
        }
    }, [dispatch, levelInfo.division])

    useEffect(() => {
        if (levelInfo.district) {
            loadDataWithState('blocks', loadBlocks(levelInfo.district), 'blocks')
        }
    }, [dispatch, levelInfo.district])

    useEffect(() => {
        if (levelInfo.block) {
            loadDataWithState('sectors', loadSectors(levelInfo.block), 'sectors')
        }
    }, [dispatch, levelInfo.block])

    useEffect(() => {
        if (levelInfo.organizationTypeId) {
            loadDataWithState('organizations', loadOrganizations(levelInfo.organizationTypeId), 'organizations')
        }
    }, [dispatch, levelInfo.organizationTypeId])
    
    useEffect(() => {
        if (levelInfo.organizationId) {
            loadDataWithState('designations', loadDesignations({ organizationId: levelInfo.organizationId }), 'designations')
        }
    }, [dispatch, levelInfo.organizationId])

    // ✅ Enhanced validation for field requirements
    const validateFieldRequirement = async (fieldName: keyof Step2FormData, value: string) => {
        if (!value && fieldName !== 'selectedLevel') {
            updateFieldError(fieldName, `${fieldName} is required`)
        } else {
            updateFieldError(fieldName, undefined)
        }
        
        setValue(fieldName, value as any, { shouldValidate: true })
        await trigger(fieldName)
    }

    const geoFields: GeoField[] = [
        { key: "State", value: levelInfo.state, field: "state", options: geo.states || [] },
        { key: "Division", value: levelInfo.division, field: "division", options: geo.divisions || [] },
        { key: "District", value: levelInfo.district, field: "district", options: geo.districts || [] },
        { key: "Block", value: levelInfo.block, field: "block", options: geo.blocks || [] },
        { key: "PHC/CHC", value: levelInfo.sector, field: "sector", options: geo.sectors || [] },
    ]

    const getResetPayload = (field: string) => {
        const resetMap: Record<string, string[]> = {
            state: [
                "division", "district", "block", "sector", 
                "organizationTypeId", "organizationTypeLabel", 
                "organizationId", "organizationLabel", 
                "designationId", "designationLabel"
            ],
            division: ["district", "block", "sector"],
            district: ["block", "sector"],
            block: ["sector"],
            sector: [],
            organizationTypeId: ["organizationId", "organizationLabel", "designationId", "designationLabel"],
            organizationId: ["designationId", "designationLabel"]
        }

        return resetMap[field]?.reduce((acc, key) => ({ ...acc, [key]: "" }), {}) || {}
    }

    // ✅ Enhanced level selection with validation
    const handleLevelSelection = async (level: string) => {
        dispatch(updateLevelInfo({ selectedLevel: level }))
        await validateFieldRequirement('selectedLevel', level)
        
        // Clear errors for fields that will be hidden
        const selectedIndex = levelOrder.indexOf(level)
        geoFields.forEach((field, index) => {
            if (index > selectedIndex) {
                updateFieldError(field.field as keyof typeof fieldErrors, undefined)
            }
        })
    }

    // ✅ Enhanced field change handlers with validation
    const handleGeoFieldChange = async (field: string, val: string) => {
        const reset = getResetPayload(field)
        dispatch(updateLevelInfo({ [field]: val, ...reset }))
        dispatch(resetGeoData(field))
        
        await validateFieldRequirement(field as keyof Step2FormData, val)
        
        // Clear errors for reset fields
        Object.keys(reset).forEach(resetField => {
            updateFieldError(resetField as keyof typeof fieldErrors, undefined)
            // Also clear form values for reset fields
            if (['organizationTypeId', 'organizationId', 'designationId'].includes(resetField)) {
                setValue(resetField as keyof Step2FormData, '', { shouldValidate: true })
            }
        })
        
        // Department fields are automatically reset when state changes (silent operation)
    }

    const handleOrgTypeChange = async (val: string) => {
        const selected = geo.orgTypes?.find((opt: any) => opt.id === val)
        dispatch(updateLevelInfo({
            organizationTypeId: val,
            organizationTypeLabel: selected?.name || "",
            organizationId: "",
            organizationLabel: "",
            designationId: "",
            designationLabel: "",
        }))
        dispatch(resetGeoData("organizationType"))
        
        await validateFieldRequirement('organizationTypeId', val)
        updateFieldError('organizationId', undefined)
        updateFieldError('designationId', undefined)
    }

    const handleOrgChange = async (val: string) => {
        const selected = geo.organizations?.find((opt: any) => opt.id === val)
        dispatch(updateLevelInfo({
            organizationId: val,
            organizationLabel: selected?.name || "",
            designationId: "",
            designationLabel: "",
        }))
        dispatch(resetGeoData("organization"))
        
        await validateFieldRequirement('organizationId', val)
        updateFieldError('designationId', undefined)
    }

    const handleDesignationChange = async (val: string) => {
        const selected = geo.designations?.find((opt: any) => opt.id === val)
        dispatch(updateLevelInfo({ designationId: val, designationLabel: selected?.name || "" }))
        
        await validateFieldRequirement('designationId', val)
    }

    // ✅ Step validation function for parent component
    const validateAllFields = async () => {
        const isFormValid = await trigger()
        
        if (!isFormValid) {
            const errorFields = []
            if (errors.selectedLevel) errorFields.push("Administrative Level")
            if (errors.state) errorFields.push("State")
            if (errors.division) errorFields.push("Division")
            if (errors.district) errorFields.push("District")
            if (errors.block) errorFields.push("Block")
            if (errors.sector) errorFields.push("PHC/CHC")
            if (errors.organizationTypeId) errorFields.push("Organization Type")
            if (errors.organizationId) errorFields.push("Organization")
            if (errors.designationId) errorFields.push("Designation")
            
            if (errorFields.length > 0) {
                toast.error(`Please complete: ${errorFields.join(", ")}`)
            }
            return false
        }
        
        return true
    }

    // ✅ Check if step is complete
    const isStepValid = () => {
        return isValid && levelInfo.selectedLevel && levelInfo.state && 
               levelInfo.organizationTypeId && levelInfo.organizationId && levelInfo.designationId
    }

    // If you want to expose methods to a parent, use forwardRef and useImperativeHandle there.
    // Removed invalid useImperativeHandle call.

    const isSelected = (level: string) => levelInfo.selectedLevel === level
    const isNoneSelected = !levelInfo.selectedLevel

    const baseClass = "bg-background text-muted-foreground border border-border hover:bg-secondary"
    const selectedClass = "bg-primary text-primary-foreground hover:bg-primary/90"

    return (
        <div className="space-y-6">
            <Card className="p-6 rounded-md bg-muted">
                <h3 className="text-lg font-medium">Select Your Level</h3>
                <hr className="border-border" />

                <div className="flex flex-wrap gap-2">
                    {levelOrder.map((level) => (
                        <Button
                            key={level}
                            variant="default"
                            className={isSelected(level) ? selectedClass : isNoneSelected ? baseClass : baseClass}
                            onClick={() => handleLevelSelection(level)}
                        >
                            {level}
                        </Button>
                    ))}
                </div>
                
                {/* ✅ Inline error for level selection */}
                {fieldErrors.selectedLevel && (
                    <p className="text-xs text-destructive mt-2 ml-1 flex items-center gap-1" role="alert">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {fieldErrors.selectedLevel}
                    </p>
                )}
            </Card>

            <Card className="p-6 rounded-md bg-muted">
                <h3 className="text-lg font-medium">Geography</h3>
                <hr className="border-border" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geoFields.map(({ key, value, field, options }, index) => {
                        const selectedIndex = levelOrder.indexOf(levelInfo.selectedLevel)
                        if (index > selectedIndex) return null

                        const isDisabled = index > 0 && !levelInfo[geoFields[index - 1].field as keyof typeof levelInfo]
                        const isLoading = loadingStates[field as keyof LoadingStates] || loadingStates[geoFields[index - 1]?.field as keyof LoadingStates]
                        
                        return (
                            <div key={key}>
                                <Label className="text-sm text-muted-foreground mb-2 block">{`Select ${key}`}</Label>
                                <Select
                                    value={value || undefined}
                                    onValueChange={(val) => handleGeoFieldChange(field, val)}
                                    disabled={!!isDisabled}
                                >
                                    <SelectTrigger className="w-full h-12 bg-background border border-border rounded-md px-4 py-2 text-sm text-foreground font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                        <SelectValue>
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                    </svg>
                                                    Loading...
                                                </span>
                                            ) : (
                                                options.find((opt: any) => opt.id === value)?.name || `Select ${key}`
                                            )}
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
                                
                                {/* ✅ Inline error for geo fields */}
                                {fieldErrors[field as keyof typeof fieldErrors] && (
                                    <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1" role="alert">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {fieldErrors[field as keyof typeof fieldErrors]}
                                    </p>
                                )}
                                

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
                            onValueChange={handleOrgTypeChange}
                        >
                            <SelectTrigger className="w-full h-12 bg-background border border-border rounded-md px-4 py-2">
                                <SelectValue>
                                    {loadingStates.orgTypes ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            Loading...
                                        </span>
                                    ) : (
                                        levelInfo.organizationTypeLabel || "Select Type"
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {geo.orgTypes?.map((opt: any) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {fieldErrors.organizationTypeId && (
                            <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1" role="alert">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.organizationTypeId}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Name of Organisation</Label>
                        <Select
                            value={levelInfo.organizationId || undefined}
                            onValueChange={handleOrgChange}
                            disabled={!levelInfo.organizationTypeId}
                        >
                            <SelectTrigger className="w-full h-12 bg-background border border-border rounded-md px-4 py-2">
                                <SelectValue>
                                    {loadingStates.organizations ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            Loading...
                                        </span>
                                    ) : (
                                        levelInfo.organizationLabel || "Select Organisation"
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {geo.organizations?.map((opt: any) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {fieldErrors.organizationId && (
                            <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1" role="alert">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.organizationId}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Label className="text-sm text-muted-foreground mb-2 block">Designation</Label>
                        <Select
                            value={levelInfo.designationId || undefined}
                            onValueChange={handleDesignationChange}
                            disabled={!levelInfo.organizationId}
                        >
                            <SelectTrigger className="w-full h-12 bg-background border border-border rounded-md px-4 py-2">
                                <SelectValue>
                                    {loadingStates.designations ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                            </svg>
                                            Loading...
                                        </span>
                                    ) : (
                                        levelInfo.designationLabel || "Select Designation"
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {geo.designations?.map((opt: any) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {fieldErrors.designationId && (
                            <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1" role="alert">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {fieldErrors.designationId}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

const Step2UserDetailsMemo = React.memo(Step2UserDetails)
export default Step2UserDetailsMemo
