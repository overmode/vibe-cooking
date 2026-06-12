import { Button } from '@/components/ui/button'
import { Grid3X3, List, ChevronUp, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type SortField, type SortDirection, type ViewMode } from './types'

interface RecipeViewControlsProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  sortField: SortField
  setSortField: (field: SortField) => void
  sortDirection: SortDirection
  setSortDirection: (direction: SortDirection) => void
}

export function RecipeViewControls({
  viewMode,
  setViewMode,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}: RecipeViewControlsProps) {
  const t = useTranslations('recipeControls')
  const tField = useTranslations('recipeControls.field')

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {t('sort', { field: tField(sortField) })}
            {sortDirection === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {t('recipeProperties')}
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setSortField('name')
              setSortDirection('asc')
            }}
          >
            {t('nameAsc')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('name')
              setSortDirection('desc')
            }}
          >
            {t('nameDesc')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('duration')
              setSortDirection('asc')
            }}
          >
            {t('shortestDuration')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('duration')
              setSortDirection('desc')
            }}
          >
            {t('longestDuration')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('difficulty')
              setSortDirection('asc')
            }}
          >
            {t('easiestFirst')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('difficulty')
              setSortDirection('desc')
            }}
          >
            {t('hardestFirst')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('servings')
              setSortDirection('asc')
            }}
          >
            {t('fewestServings')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('servings')
              setSortDirection('desc')
            }}
          >
            {t('mostServings')}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            {t('dates')}
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              setSortField('createdAt')
              setSortDirection('desc')
            }}
          >
            {t('newestFirst')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('createdAt')
              setSortDirection('asc')
            }}
          >
            {t('oldestFirst')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex border rounded-md overflow-hidden shadow-sm">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={
              viewMode === 'grid'
                ? 'bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary rounded-r-none'
                : 'text-muted-foreground hover:bg-muted rounded-r-none'
            }
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={
              viewMode === 'list'
                ? 'bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary rounded-l-none'
                : 'text-muted-foreground hover:bg-muted rounded-l-none'
            }
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
    </div>
  )
}
