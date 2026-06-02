import { RecipeMetadata } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Clock, ChevronUp, ChevronDown, Users, ChefHat } from 'lucide-react'
import { SortField, SortDirection } from '@/components/recipes/types'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { ScrollArea } from '@/components/ui/scroll-area'
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

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
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
              ].map((column) => (
                <TableHead
                  key={column.field}
                  className={cn(
                    column.width,
                    'cursor-pointer font-medium transition-colors'
                  )}
                  onClick={() => handleSort(column.field as SortField)}
                >
                  <div className="flex items-center py-2">
                    {column.label}
                    {renderSortIcon(column.field as SortField)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  )
}
