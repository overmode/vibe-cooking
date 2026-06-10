import { type RecipeMetadata } from '@/lib/types'
import { routes } from '@/lib/routes'
import Link from 'next/link'

interface RecipeMobileListViewProps {
  recipes: RecipeMetadata[]
}

export function RecipeMobileListView({ recipes }: RecipeMobileListViewProps) {
  return (
    <div className="flex flex-col divide-y">
      {recipes.map((recipe) => (
        <Link
          key={recipe.id}
          href={routes.recipes.byId(recipe.id)}
          className="flex items-center gap-3 py-3 px-1 hover:bg-muted/40 transition-colors"
        >
          <span className="flex-1 min-w-0 text-sm font-medium text-primary-text truncate">
            {recipe.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
