import { type ReactNode } from 'react'
import { type Recipe } from '@/lib/types'
import { MemoizedMarkdown } from '@/components/chat/memoized-markdown'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { RecipeMetadataDescription } from './shared/recipe-card-base'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { routes } from '@/lib/routes'

type ViewableRecipe = Pick<
  Recipe,
  'id' | 'name' | 'ingredients' | 'instructions' | 'duration' | 'difficulty' | 'servings'
>

export function RecipeViewer({ recipe, actions }: { recipe: ViewableRecipe; actions?: ReactNode }) {
  return (
    <ScrollArea className="h-full">
      <div className="hidden md:flex items-center justify-between px-6 pt-4 pb-2">
        <Link
          href={routes.recipes.all}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Recipes
        </Link>
        {actions}
      </div>

      <div className="px-4 pb-6 pt-3 md:pt-0 sm:px-6 space-y-8">
        <div className="space-y-3">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-text leading-snug">
            {recipe.name}
          </h1>
          <RecipeMetadataDescription
            duration={recipe.duration}
            difficulty={recipe.difficulty}
            servings={recipe.servings}
          />
        </div>

        <Separator className="bg-muted/60" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary-text">Ingredients</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipe.ingredients.map((ingredient, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-foreground/80"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-primary/70 mt-1.5 shrink-0" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>

        <Separator className="bg-muted/60" />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary-text">Instructions</h2>
          <div className="text-sm text-foreground/80 prose prose-headings:text-primary-text prose-a:text-primary max-w-none">
            <MemoizedMarkdown
              content={recipe.instructions}
              id={`cooking-instructions-${recipe.id}`}
            />
          </div>
        </section>
      </div>
    </ScrollArea>
  )
}
