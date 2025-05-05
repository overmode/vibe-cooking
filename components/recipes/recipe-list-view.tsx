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
} from 'lucide-react'

import { SortField, SortDirection } from '@/components/recipes/types'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
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

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  return (
    <div className="rounded-md border border-lime-100 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gradient-to-r from-lime-50 to-lime-100">
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
              <div className="flex items-center">Planned</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => {
            const isPlanned =
              recipe.plannedMeals &&
              recipe.plannedMeals.some((meal) => meal.status === 'PLANNED')

            return (
              <TableRow
                key={recipe.id}
                className="border-b border-lime-50 transition-colors cursor-pointer"
                onClick={() => router.push(routes.recipes.byId(recipe.id))}
              >
                <TableCell>
                  <div className="flex items-center gap-2 font-medium text-lime-900">
                    {recipe.name}
                    {recipe.isFavorite && (
                      <Heart className="h-4 w-4 text-rose-400 fill-rose-400 animate-pulse-subtle" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {recipe.duration ? (
                    <div className="flex items-center gap-1 text-lime-700">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{recipe.duration} min</span>
                    </div>
                  ) : (
                    UNDEFINED_VALUE_PLACEHOLDER
                  )}
                </TableCell>
                <TableCell>
                  {recipe.difficulty ? (
                    <span className="text-lime-700">
                      {recipe.difficulty}/10
                    </span>
                  ) : (
                    UNDEFINED_VALUE_PLACEHOLDER
                  )}
                </TableCell>
                <TableCell>
                  {recipe.cookCount > 0 ? (
                    <div className="flex items-center gap-1 text-lime-700/80">
                      <ChefHat className="h-3.5 w-3.5" />
                      <span className="font-medium">{recipe.cookCount}x</span>
                    </div>
                  ) : (
                    <span className="text-lime-600/60 italic text-sm">
                      Not yet
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {recipe.servings > 0 ? (
                    <div className="flex items-center gap-1 text-slate-600">
                      <Users className="h-3.5 w-3.5" />
                      <span>{recipe.servings}</span>
                    </div>
                  ) : (
                    UNDEFINED_VALUE_PLACEHOLDER
                  )}
                </TableCell>
                <TableCell>
                  {isPlanned ? (
                    <div className="flex items-center gap-1 text-emerald-600 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Yes</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">No</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
