import { RecipeMetadata } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Clock,
  ChevronUp,
  ChevronDown,
  Heart,
  Calendar,
  Users,
  ChefHat,
  CheckCircle,
  Loader2,
} from 'lucide-react'

import { SortField, SortDirection } from '@/components/recipes/types'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { usePlanRecipe } from '@/lib/api/hooks/recipes'
import { useState } from 'react'

interface RecipeListViewProps {
  recipes: RecipeMetadata[]
  handleSort: (field: SortField) => void
  sortField: SortField
  sortDirection: SortDirection
}

const UNDEFINED_VALUE_PLACEHOLDER = '-'

export function RecipeListView({
  recipes,
  handleSort,
  sortField,
  sortDirection,
}: RecipeListViewProps) {
  const router = useRouter()
  const [planningRecipeId, setPlanningRecipeId] = useState<string | null>(null)

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  const { mutate: planRecipe } = usePlanRecipe({
    options: {
      onSettled: () => {
        setPlanningRecipeId(null)
      },
    },
  })

  const handlePlanClick = (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation()
    setPlanningRecipeId(recipeId)
    planRecipe(recipeId)
  }

  return (
    <ScrollArea className="h-full rounded-md">
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead
                className="w-[40%] cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('duration')}
              >
                <div className="flex items-center">
                  Duration {renderSortIcon('duration')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('difficulty')}
              >
                <div className="flex items-center">
                  Difficulty {renderSortIcon('difficulty')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('cookCount')}
              >
                <div className="flex items-center">
                  Cook Count {renderSortIcon('cookCount')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('servings')}
              >
                <div className="flex items-center">
                  Servings {renderSortIcon('servings')}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">Plan</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => {
              const isPlanned =
                recipe.plannedMeals &&
                recipe.plannedMeals.some((meal) => meal.status === 'PLANNED')

              const isPlanning = planningRecipeId === recipe.id

              return (
                <TableRow
                  key={recipe.id}
                  className="border-b transition-colors cursor-pointer hover:bg-muted/20"
                  onClick={() => router.push(routes.recipes.byId(recipe.id))}
                >
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      {recipe.name}
                      {recipe.isFavorite && (
                        <Heart className="h-4 w-4 text-destructive fill-destructive animate-pulse-subtle" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {recipe.duration ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{recipe.duration} min</span>
                      </div>
                    ) : (
                      UNDEFINED_VALUE_PLACEHOLDER
                    )}
                  </TableCell>
                  <TableCell>
                    {recipe.difficulty ? (
                      <span className="text-muted-foreground">
                        {recipe.difficulty}/10
                      </span>
                    ) : (
                      UNDEFINED_VALUE_PLACEHOLDER
                    )}
                  </TableCell>
                  <TableCell>
                    {recipe.cookCount > 0 ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ChefHat className="h-3.5 w-3.5" />
                        <span className="font-medium">{recipe.cookCount}x</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60 italic text-sm">
                        Not yet
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {recipe.servings > 0 ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{recipe.servings}</span>
                      </div>
                    ) : (
                      UNDEFINED_VALUE_PLACEHOLDER
                    )}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {isPlanned ? (
                            <div className="flex h-8 w-8 items-center justify-center text-success">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          ) : isPlanning ? (
                            <div className="flex h-8 w-8 items-center justify-center text-primary">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:bg-primary/10"
                              onClick={(e) => handlePlanClick(e, recipe.id)}
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>
                            {isPlanned
                              ? 'Already planned'
                              : isPlanning
                              ? 'Planning...'
                              : 'Add to meal plan'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  )
}
