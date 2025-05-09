'use client'

import { useParams } from 'next/navigation'
import { CookingView } from '@/components/cooking/cooking-view'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePlannedMealWithRecipe } from '@/lib/api/hooks/planned-meals'

export default function CookingPage() {
  const { id } = useParams<{ id: string }>()

  const plannedMealWithRecipeQuery = usePlannedMealWithRecipe({
    id: id as string,
    options: {
      enabled: !!id,
    },
  })

  if (plannedMealWithRecipeQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">
          Loading your cooking session...
        </p>
      </div>
    )
  }

  if (plannedMealWithRecipeQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Failed to load cooking session</p>
        <ReturnHomeButton />
      </div>
    )
  }

  const plannedMealWithRecipe = plannedMealWithRecipeQuery.data

  if (!plannedMealWithRecipe) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Recipe or planned meal not found</p>
        <ReturnHomeButton />
      </div>
    )
  }

  return (
    <div className="h-full">
      <CookingView plannedMealWithRecipe={plannedMealWithRecipe} />
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
