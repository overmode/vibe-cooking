'use client'

import { useParams } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRecipeById } from '@/lib/api/hooks/recipes'
import { RecipeChatView } from '@/components/recipes/recipe-chat-view'

export default function RecipePage() {
  const { id } = useParams<{ id: string }>()

  const recipeQuery = useRecipeById({
    id: id as string,
    options: {
      enabled: !!id,
    },
  })

  if (recipeQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading recipe...</p>
      </div>
    )
  }

  if (recipeQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Failed to load recipe</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    )
  }

  const recipe = recipeQuery.data

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Recipe not found</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full">
      <RecipeChatView recipe={recipe} />
    </div>
  )
}
