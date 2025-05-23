import { Button } from '@/components/ui/button'
import { Grid3X3, List, ChevronUp, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SortField, SortDirection, ViewMode } from './types'

interface RecipeViewControlsProps {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  sortField: SortField
  setSortField: (field: SortField) => void
  sortDirection: SortDirection
  setSortDirection: (direction: SortDirection) => void
  isMobile?: boolean
}

export function RecipeViewControls({
  viewMode,
  setViewMode,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  isMobile,
}: RecipeViewControlsProps) {
  // Format the sort field name for display
  const formatSortFieldName = (field: SortField): string => {
    switch (field) {
      case 'cookCount':
        return 'Cook Count'
      case 'createdAt':
        return 'Created Date'
      default:
        return field.charAt(0).toUpperCase() + field.slice(1)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Sort: {formatSortFieldName(sortField)}
            {sortDirection === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Recipe Properties
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setSortField('name')
              setSortDirection('asc')
            }}
          >
            Name (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('name')
              setSortDirection('desc')
            }}
          >
            Name (Z-A)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('duration')
              setSortDirection('asc')
            }}
          >
            Shortest Duration
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('duration')
              setSortDirection('desc')
            }}
          >
            Longest Duration
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('difficulty')
              setSortDirection('asc')
            }}
          >
            Easiest First
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('difficulty')
              setSortDirection('desc')
            }}
          >
            Hardest First
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('servings')
              setSortDirection('asc')
            }}
          >
            Fewest Servings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('servings')
              setSortDirection('desc')
            }}
          >
            Most Servings
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Usage & Dates
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              setSortField('cookCount')
              setSortDirection('desc')
            }}
          >
            Most Cooked
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('cookCount')
              setSortDirection('asc')
            }}
          >
            Least Cooked
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('createdAt')
              setSortDirection('desc')
            }}
          >
            Newest First
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSortField('createdAt')
              setSortDirection('asc')
            }}
          >
            Oldest First
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* List view doesn't work UX-wise on mobile */}
      {!isMobile && (
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
      )}
    </div>
  )
}
