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
  CalendarPlus,
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
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {[
                { label: 'Name', field: 'name', width: 'w-[40%]' },
                { label: 'Duration', field: 'duration', width: '' },
                { label: 'Difficulty', field: 'difficulty', width: '' },
                { label: 'Cook Count', field: 'cookCount', width: '' },
                { label: 'Servings', field: 'servings', width: '' },
                { label: 'Plan', field: '', width: 'w-[80px]' },
              ].map((column) => (
                <TableHead
                  key={column.field || 'action'}
                  className={cn(
                    column.width,
                    column.field ? 'cursor-pointer font-medium' : '',
                    'transition-colors'
                  )}
                  onClick={() =>
                    column.field && handleSort(column.field as SortField)
                  }
                >
                  <div className="flex items-center py-2">
                    {column.label}
                    {column.field && renderSortIcon(column.field as SortField)}
                  </div>
                </TableHead>
              ))}
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
                  onClick={() => router.push(routes.recipes.byId(recipe.id))}
                  className="hover:cursor-pointer"
                >
                  <TableCell className="py-3">
                    <span>{recipe.name}</span>
                  </TableCell>
                  <TableCell>
                    {recipe.duration ? (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary/70" />
                        <span>{recipe.duration} min</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60">
                        {UNDEFINED_VALUE_PLACEHOLDER}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {recipe.difficulty ? (
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              recipe.difficulty <= 3
                                ? 'bg-primary/60'
                                : recipe.difficulty <= 6
                                ? 'bg-amber-500'
                                : 'bg-destructive/70'
                            )}
                            style={{ width: `${recipe.difficulty * 10}%` }}
                          />
                        </div>
                        <span className="text-xs ml-2">
                          {recipe.difficulty}/10
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60">
                        {UNDEFINED_VALUE_PLACEHOLDER}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {recipe.cookCount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <ChefHat className="h-3.5 w-3.5 text-primary/70" />
                        <span>{recipe.cookCount}x</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60 italic text-sm">
                        Not yet
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {recipe.servings > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-primary/70" />
                        <span>{recipe.servings}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/60">
                        {UNDEFINED_VALUE_PLACEHOLDER}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {isPlanned ? (
                            <div className="flex h-9 w-9 items-center justify-center text-success rounded-full">
                              <CheckCircle className="h-4 w-4 text-success" />
                            </div>
                          ) : isPlanning ? (
                            <div className="flex h-9 w-9 items-center justify-center text-primary bg-primary/10 rounded-full">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={(e) => handlePlanClick(e, recipe.id)}
                            >
                              <CalendarPlus className="h-4 w-4" />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent side="left" className="font-medium">
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
