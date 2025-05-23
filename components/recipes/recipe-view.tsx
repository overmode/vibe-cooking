import { RecipeMetadata } from '@/lib/types'
import { NoRecipes } from '@/components/recipes/no-recipes'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SortField, SortDirection, ViewMode } from '@/components/recipes/types'
import { RecipeViewControls } from '@/components/recipes/recipe-view-controls'
import { RecipeGridView } from '@/components/recipes/recipe-grid-view'
import { RecipeListView } from '@/components/recipes/recipe-list-view'
import { routes } from '@/lib/routes'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'

export function RecipeView({
  recipeMetadata,
}: {
  recipeMetadata: RecipeMetadata[] | undefined
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial state from URL parameters or use defaults
  const initialViewMode = (searchParams.get('view') as ViewMode) || 'grid'
  const initialSortField = (searchParams.get('sort') as SortField) || 'name'
  const initialSortDirection =
    (searchParams.get('dir') as SortDirection) || 'asc'

  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode)
  const [sortField, setSortField] = useState<SortField>(initialSortField)
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialSortDirection)

  const isMobile = useIsMobile()

  // Force grid view on mobile
  useEffect(() => {
    if (isMobile && viewMode === 'list') {
      setViewMode('grid')
    }
  }, [isMobile, viewMode])

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('view', viewMode)
    params.set('sort', sortField)
    params.set('dir', sortDirection)

    // Update URL without refreshing the page
    router.replace(`${routes.recipes.all}?${params.toString()}`, {
      scroll: false,
    })
  }, [viewMode, sortField, sortDirection, router])

  // Sort recipes
  const sortedRecipes = useMemo(() => {
    if (!recipeMetadata) {
      return []
    }

    return [...recipeMetadata].sort((a, b) => {
      let comparison = 0

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === 'createdAt') {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortField === 'duration') {
        comparison = (a.duration || 0) - (b.duration || 0)
      } else if (sortField === 'difficulty') {
        comparison = (a.difficulty || 0) - (b.difficulty || 0)
      } else if (sortField === 'cookCount') {
        comparison = a.cookCount - b.cookCount
      } else if (sortField === 'servings') {
        comparison = (a.servings || 0) - (b.servings || 0)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [recipeMetadata, sortField, sortDirection])

  // Empty recipe view
  if (!recipeMetadata || recipeMetadata.length === 0) {
    return <NoRecipes />
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className="container mx-auto py-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-medium tracking-tight text-primary">
          Your Recipes
        </h2>
        <RecipeViewControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          isMobile={isMobile}
        />
      </div>

      <div className="flex-1 min-h-0">
        {viewMode === 'grid' ? (
          <ScrollArea className="h-full rounded-md">
            <div className="p-1 pb-6">
              <RecipeGridView recipes={sortedRecipes} />
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="h-full rounded-md">
            <div className="pb-6">
              <RecipeListView
                recipes={sortedRecipes}
                handleSort={handleSort}
                sortField={sortField}
                sortDirection={sortDirection}
              />
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
