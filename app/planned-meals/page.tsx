'use client'

import { PlannedMealsGridView } from '@/components/planned-meals/planned-meals-grid-view'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { usePlannedMealsMetadata } from '@/lib/api/hooks/planned-meals'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function PlannedMealsPage() {
  const {
    data: plannedMealsMetadata,
    isLoading: isLoadingPlannedMealsMetadata,
    isError: isErrorPlannedMealsMetadata,
  } = usePlannedMealsMetadata()

  // Filter out planned meals that have been cooked
  const plannedMeals = plannedMealsMetadata?.filter(
    (plannedMeal) => plannedMeal.status === 'PLANNED'
  )

  if (isLoadingPlannedMealsMetadata) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading planned meals...</p>
      </div>
    )
  }

  if (isErrorPlannedMealsMetadata) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Failed to load planned meals</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    )
  }

  if (plannedMeals) {
    return (
      <div className="container mx-auto py-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Your Planned Meals
          </h2>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full rounded-md">
            <div className="p-1">
              <PlannedMealsGridView plannedMeals={plannedMeals} />
            </div>
          </ScrollArea>
        </div>
      </div>
    )
  }

  return <div>Loading...</div>
}
