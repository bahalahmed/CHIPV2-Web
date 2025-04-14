// src/pages/DashboardPage.tsx
"use client"

import CarSelectorPage from "@/app/car-selector-page"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fc] px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--primary)] mb-6">Dashboard</h1>
      <CarSelectorPage />
    </main>
  )
}
