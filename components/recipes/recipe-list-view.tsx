import { type RecipeMetadata } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Clock, ChevronUp, ChevronDown, Users } from 'lucide-react'
import { type SortField, type SortDirection } from '@/components/recipes/types'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('recipes')
  const tField = useTranslations('recipeControls.field')

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
                { field: 'name', width: 'w-[40%]' },
                { field: 'duration', width: '' },
                { field: 'difficulty', width: '' },
                { field: 'servings', width: '' },
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
                    {tField(column.field as SortField)}
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
                  <span className="font-medium text-primary-text">{recipe.name}</span>
                </TableCell>
                <TableCell>
                  {recipe.duration ? (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary/70" />
                      <span>{t('minutes', { count: recipe.duration })}</span>
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
                          className="h-full rounded-full bg-primary/60"
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
