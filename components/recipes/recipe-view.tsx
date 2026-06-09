import { RecipeMetadata } from '@/lib/types'
import { NoRecipes } from '@/components/recipes/no-recipes'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { SortField, SortDirection, ViewMode } from '@/components/recipes/types'
import { RecipeViewControls } from '@/components/recipes/recipe-view-controls'
import { RecipeGridView } from '@/components/recipes/recipe-grid-view'
import { RecipeListView } from '@/components/recipes/recipe-list-view'
import { RecipeMobileListView } from '@/components/recipes/recipe-mobile-list-view'
import { routes } from '@/lib/routes'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/lib/hooks/use-is-mobile'
import { Input } from '@/components/ui/input'
import { MascotIllustration } from '@/components/illustrations/mascot-illustration'
import { Search } from 'lucide-react'

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
  const [query, setQuery] = useState('')

  const isMobile = useIsMobile()

  const effectiveViewMode: ViewMode = viewMode

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams()
    params.set('view', effectiveViewMode)
    params.set('sort', sortField)
    params.set('dir', sortDirection)

    router.replace(`${routes.recipes.all}?${params.toString()}`, {
      scroll: false,
    })
  }, [effectiveViewMode, sortField, sortDirection, router])

  const allRecipes = useMemo(() => recipeMetadata ?? [], [recipeMetadata])

  // Sort recipes
  const sortedRecipes = useMemo(() => {
    const strippedName = (name: string) => name.replace(/[^a-z0-9]/gi, '').toLowerCase()

    return [...allRecipes].sort((a, b) => {
      let comparison = 0

      if (sortField === 'name') {
        comparison = strippedName(a.name).localeCompare(strippedName(b.name))
      } else if (sortField === 'createdAt') {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortField === 'duration') {
        comparison = (a.duration || 0) - (b.duration || 0)
      } else if (sortField === 'difficulty') {
        comparison = (a.difficulty || 0) - (b.difficulty || 0)
      } else if (sortField === 'servings') {
        comparison = (a.servings || 0) - (b.servings || 0)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [allRecipes, sortField, sortDirection])

  const filteredRecipes = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return sortedRecipes
    return sortedRecipes.filter((r) => r.name.toLowerCase().includes(trimmed))
  }, [sortedRecipes, query])

  // Empty recipe view
  if (allRecipes.length === 0) {
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
    <div className="container mx-auto py-4 sm:py-8 flex flex-col h-full">
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-8">
        <h2 className="text-2xl font-medium tracking-tight text-primary-text">
          Your Recipes
        </h2>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search recipes..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <RecipeViewControls
            viewMode={effectiveViewMode}
            setViewMode={setViewMode}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {filteredRecipes.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
            <MascotIllustration expression="x-eyes" className="size-20 opacity-90" />
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-semibold">No recipes found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search.</p>
            </div>
          </div>
        ) : effectiveViewMode === 'grid' ? (
          <ScrollArea className="h-full rounded-md">
            <div className="p-1 pb-6">
              <RecipeGridView recipes={filteredRecipes} />
            </div>
          </ScrollArea>
        ) : isMobile ? (
          <ScrollArea className="h-full rounded-md">
            <div className="pb-6">
              <RecipeMobileListView recipes={filteredRecipes} />
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="h-full rounded-md">
            <div className="pb-6">
              <RecipeListView
                recipes={filteredRecipes}
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
