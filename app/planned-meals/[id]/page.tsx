'use client'

import { useParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePlannedMealWithRecipe } from '@/lib/api/hooks/planned-meals'
import { PlannedMealChatView } from '@/components/planned-meals/planned-meal-chat-view'

export default function PlannedMealPage() {
  const { id } = useParams<{ id: string }>()

  const plannedMealQuery = usePlannedMealWithRecipe({
    id: id as string,
    options: {
      enabled: !!id,
    },
  })

  if (plannedMealQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading planned meal...</p>
      </div>
    )
  }

  if (plannedMealQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Failed to load planned meal</p>
        <ReturnHomeButton />
      </div>
    )
  }

  const plannedMeal = plannedMealQuery.data

  if (!plannedMeal) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Planned meal not found</p>
        <ReturnHomeButton />
      </div>
    )
  }

  return (
    <div className="h-full">
      <PlannedMealChatView plannedMeal={plannedMeal} />
    </div>
  )
}

const ReturnHomeButton = () => {
  return (
    <Button asChild variant="outline" className="mt-4">
      <Link href="/">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Return Home
      </Link>
    </Button>
  )
}
