"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import type { RootState } from "@/app/store"
import type { AppDispatch } from "@/app/store"
import { resetGeoData } from "@/features/geoData/geoDataSlice"
import {
    useGetStatesQuery,
    useGetDivisionsQuery,
    useGetDistrictsQuery,
    useGetBlocksQuery,
    useGetSectorsQuery,
    useGetOrgTypesQuery,
    useGetOrganizationsQuery,
    useGetDesignationsQuery,
    handleGeoApiError
} from "@/features/geoData/geoApiSlice"
import { updateLevelInfo } from "@/features/registerForm/registerFormSlice"
import { step2UserDetailsSchema, createGeographicValidationSchema, type Step2UserDetailsForm } from "@/lib/validationSchemas"

const LEVEL_ORDER = ["State", "Division", "District", "Block", "PHC/CHC"] as const
type LevelType = typeof LEVEL_ORDER[number]

interface GeoOption {
    readonly id: string
    readonly name: string
}

// Reusable components to reduce duplication
const ErrorIcon = () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
)

const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
    </svg>
)



const selectLevelInfo = (state: RootState) => state.registerForm.levelInfo

const Step2UserDetails = React.memo(() => {
    const dispatch: AppDispatch = useDispatch()
    const levelInfo = useSelector(selectLevelInfo)
    
    // RTK Query hooks with caching
    const { data: states = [], isLoading: statesLoading, error: statesError } = useGetStatesQuery(undefined, {
        refetchOnMountOrArgChange: 300 // Cache for 5 minutes
    })
    
    const { data: divisions = [], isLoading: divisionsLoading, error: divisionsError } = useGetDivisionsQuery(
        levelInfo.state, 
        { skip: !levelInfo.state }
    )
    
    const { data: districts = [], isLoading: districtsLoading, error: districtsError } = useGetDistrictsQuery(
        levelInfo.division, 
        { skip: !levelInfo.division }
    )
    
    const { data: blocks = [], isLoading: blocksLoading, error: blocksError } = useGetBlocksQuery(
        levelInfo.district, 
        { skip: !levelInfo.district }
    )
    
    const { data: sectors = [], isLoading: sectorsLoading, error: sectorsError } = useGetSectorsQuery(
        levelInfo.block, 
        { skip: !levelInfo.block }
    )
    
    const { data: orgTypes = [], isLoading: orgTypesLoading, error: orgTypesError } = useGetOrgTypesQuery(
        levelInfo.state, 
        { skip: !levelInfo.state }
    )
    
    const { data: organizations = [], isLoading: organizationsLoading, error: organizationsError } = useGetOrganizationsQuery(
        levelInfo.organizationTypeId, 
        { skip: !levelInfo.organizationTypeId }
    )
    
    const { data: designations = [], isLoading: designationsLoading, error: designationsError } = useGetDesignationsQuery(
        levelInfo.organizationId, 
        { skip: !levelInfo.organizationId }
    )

    // Optimized memoization with length-based dependencies for better performance
    const geo = useMemo(() => ({
        states,
        divisions,
        districts,
        blocks,
        sectors,
        orgTypes,
        organizations,
        designations
    }), [states?.length, divisions?.length, districts?.length, blocks?.length, sectors?.length, orgTypes?.length, organizations?.length, designations?.length])

    const loadingStates = useMemo(() => ({
        states: statesLoading,
        divisions: divisionsLoading,
        districts: districtsLoading,
        blocks: blocksLoading,
        sectors: sectorsLoading,
        orgTypes: orgTypesLoading,
        organizations: organizationsLoading,
        designations: designationsLoading
    }), [statesLoading, divisionsLoading, districtsLoading, blocksLoading, sectorsLoading, orgTypesLoading, organizationsLoading, designationsLoading])


    const currentSchema = useMemo(() => 
        createGeographicValidationSchema(levelInfo.selectedLevel || ""), 
        [levelInfo.selectedLevel]
    )
    
    const { setValue, trigger, formState: { errors: formErrors }, reset } = useForm({
        resolver: zodResolver(currentSchema),
        mode: "onChange" as const,
        defaultValues: {
            selectedLevel: "", state: "", division: "", district: "", block: "", sector: "",
            organizationTypeId: "", organizationId: "", designationId: ""
        }
    })

    // Optimized form reset with memoized values
    const formValues = useMemo(() => ({
        selectedLevel: levelInfo.selectedLevel || "",
        state: levelInfo.state || "", division: levelInfo.division || "", district: levelInfo.district || "",
        block: levelInfo.block || "", sector: levelInfo.sector || "",
        organizationTypeId: levelInfo.organizationTypeId || "", organizationId: levelInfo.organizationId || "",
        designationId: levelInfo.designationId || ""
    }), [levelInfo.selectedLevel, levelInfo.state, levelInfo.division, levelInfo.district, levelInfo.block, levelInfo.sector, levelInfo.organizationTypeId, levelInfo.organizationId, levelInfo.designationId])

    useEffect(() => reset(formValues), [formValues, reset])


    // Simplified error handling with memoized error mapping
    const errorMap = useMemo(() => [{
        error: statesError, context: 'states'
    }, {
        error: divisionsError, context: 'divisions'
    }, {
        error: districtsError, context: 'districts'
    }, {
        error: blocksError, context: 'blocks'
    }, {
        error: sectorsError, context: 'sectors'
    }, {
        error: orgTypesError, context: 'orgTypes'
    }, {
        error: organizationsError, context: 'organizations'
    }, {
        error: designationsError, context: 'designations'
    }], [statesError, divisionsError, districtsError, blocksError, sectorsError, orgTypesError, organizationsError, designationsError])
    
    useEffect(() => {
        errorMap.forEach(({ error, context }) => {
            if (error) {
                console.error(`${context} loading error:`, error)
                toast.error(handleGeoApiError(error, context))
            }
        })
    }, [errorMap])

    const validateField = useCallback(async (fieldName: string, value: string) => {
        setValue(fieldName as any, value, { shouldValidate: true })
        await trigger(fieldName as any)
    }, [setValue, trigger])

    const geoFields = useMemo(() => [
        { key: "State", value: levelInfo.state, field: "state", options: geo.states },
        { key: "Division", value: levelInfo.division, field: "division", options: geo.divisions },
        { key: "District", value: levelInfo.district, field: "district", options: geo.districts },
        { key: "Block", value: levelInfo.block, field: "block", options: geo.blocks },
        { key: "PHC/CHC", value: levelInfo.sector, field: "sector", options: geo.sectors },
    ], [levelInfo.state, levelInfo.division, levelInfo.district, levelInfo.block, levelInfo.sector, geo])

    const resetMap: Record<string, string[]> = useMemo(() => ({
        state: ["division", "district", "block", "sector", "organizationTypeId", "organizationTypeLabel", "organizationId", "organizationLabel", "designationId", "designationLabel"],
        division: ["district", "block", "sector"],
        district: ["block", "sector"],
        block: ["sector"],
        sector: [],
        organizationTypeId: ["organizationId", "organizationLabel", "designationId", "designationLabel"],
        organizationId: ["designationId", "designationLabel"]
    }), [])

    const getResetPayload = useCallback((field: string): Record<string, string> => 
        resetMap[field]?.reduce((acc: Record<string, string>, key: string) => ({ ...acc, [key]: "" }), {}) || {}, [resetMap])

    const handleLevelSelection = useCallback(async (level: string) => {
        dispatch(updateLevelInfo({ selectedLevel: level }))
        await validateField('selectedLevel', level)
    }, [dispatch, validateField])

    const handleGeoFieldChange = useCallback(async (field: string, val: string) => {
        const reset = getResetPayload(field)
        dispatch(updateLevelInfo({ [field]: val, ...reset }))
        dispatch(resetGeoData(field))
        
        await validateField(field, val)
        
        Object.keys(reset).forEach(resetField => {
            if (['organizationTypeId', 'organizationId', 'designationId'].includes(resetField)) {
                setValue(resetField as any, '', { shouldValidate: true })
            }
        })
    }, [dispatch, getResetPayload, validateField, setValue])

    const handleOrgTypeChange = useCallback(async (val: string) => {
        const selected = geo.orgTypes.find((opt: GeoOption) => opt.id === val)
        dispatch(updateLevelInfo({
            organizationTypeId: val, organizationTypeLabel: selected?.name || "",
            organizationId: "", organizationLabel: "", designationId: "", designationLabel: ""
        }))
        dispatch(resetGeoData("organizationType"))
        await validateField('organizationTypeId', val)
    }, [dispatch, geo.orgTypes, validateField])

    const handleOrgChange = useCallback(async (val: string) => {
        const selected = geo.organizations.find((opt: GeoOption) => opt.id === val)
        dispatch(updateLevelInfo({
            organizationId: val, organizationLabel: selected?.name || "",
            designationId: "", designationLabel: ""
        }))
        dispatch(resetGeoData("organization"))
        await validateField('organizationId', val)
    }, [dispatch, geo.organizations, validateField])

    const handleDesignationChange = useCallback(async (val: string) => {
        const selected = geo.designations.find((opt: GeoOption) => opt.id === val)
        dispatch(updateLevelInfo({ designationId: val, designationLabel: selected?.name || "" }))
        await validateField('designationId', val)
    }, [dispatch, geo.designations, validateField])

    const isSelected = useCallback((level: string) => levelInfo.selectedLevel === level, [levelInfo.selectedLevel])
    const buttonClasses = useMemo(() => ({
        base: "bg-background text-muted-foreground border border-border hover:bg-secondary",
        selected: "bg-primary text-primary-foreground hover:bg-primary/90"
    }), [])

    return (
        <div className="space-y-6">
            <Card className="p-6 rounded-md bg-muted">
                <h3 className="text-lg font-medium">Select Your Level</h3>
                <hr className="border-border" />

                <div className="flex flex-wrap gap-2">
                    {LEVEL_ORDER.map((level) => (
                        <Button
                            key={level}
                            variant="default"
                            className={isSelected(level) ? buttonClasses.selected : buttonClasses.base}
                            onClick={() => handleLevelSelection(level)}
                        >
                            {level}
                        </Button>
                    ))}
                </div>
                
                {/* ✅ Inline error for level selection */}
                {formErrors.selectedLevel && (
                    <p className="text-xs text-destructive mt-2 ml-1 flex items-center gap-1" role="alert">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.selectedLevel?.message}
                    </p>
                )}
            </Card>

            <Card className="p-6 rounded-md bg-muted">
                <h3 className="text-lg font-medium">Geography</h3>
                <hr className="border-border" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {geoFields.map(({ key, value, field, options }, index) => {
                        const selectedIndex = LEVEL_ORDER.indexOf(levelInfo.selectedLevel as LevelType)
                        if (index > selectedIndex) return null

                        const prevField = index > 0 ? geoFields[index - 1].field : ''
                        const isDisabled = index > 0 && !levelInfo[prevField as keyof typeof levelInfo]
                        const isLoading = loadingStates[field as keyof typeof loadingStates] || (index > 0 && loadingStates[prevField as keyof typeof loadingStates])
                        
                        return (
                            <div key={key}>
                                <Label className="text-sm text-muted-foreground mb-2 block">{`Select ${key}`}</Label>
                                <Select
                                    value={value || ""}
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
                                                options.find((opt: GeoOption) => opt.id === value)?.name || `Select ${key}`
                                            )}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((opt: GeoOption) => (
                                            <SelectItem key={opt.id} value={opt.id}>
                                                {opt.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                                {/* ✅ Inline error for geo fields */}
                                {formErrors[field as keyof Step2UserDetailsForm] && (
                                    <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1" role="alert">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {formErrors[field as keyof Step2UserDetailsForm]?.message}
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
                            value={levelInfo.organizationTypeId || ""}
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
                                {geo.orgTypes.map((opt: GeoOption) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {formErrors.organizationTypeId && (
                            <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1" role="alert">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.organizationTypeId?.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Name of Organisation</Label>
                        <Select
                            value={levelInfo.organizationId || ""}
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
                                {geo.organizations.map((opt: GeoOption) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {formErrors.organizationId && (
                            <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1" role="alert">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.organizationId?.message}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <Label className="text-sm text-muted-foreground mb-2 block">Designation</Label>
                        <Select
                            value={levelInfo.designationId || ""}
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
                                {geo.designations.map((opt: GeoOption) => (
                                    <SelectItem key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        
                        {formErrors.designationId && (
                            <p className="text-xs text-destructive mt-1 ml-1 flex items-center gap-1" role="alert">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {formErrors.designationId?.message}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
})

Step2UserDetails.displayName = 'Step2UserDetails'

export default Step2UserDetails
