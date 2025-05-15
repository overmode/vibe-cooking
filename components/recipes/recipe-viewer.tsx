import { Recipe } from '@prisma/client'
import { MemoizedMarkdown } from '@/components/chat/memoized-markdown'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { RecipeMetadataDescription } from './shared/recipe-card-base'
export function RecipeViewer({ recipe }: { recipe: Recipe }) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* Recipe header */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-primary">{recipe.name}</h1>
          <RecipeMetadataDescription
            duration={recipe.duration}
            difficulty={recipe.difficulty}
            servings={recipe.servings}
          />
        </div>

        <Separator className="bg-muted/60" />

        {/* Ingredients */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Ingredients</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipe.ingredients.map((ingredient, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-foreground/80"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-primary/70 mt-1.5 flex-shrink-0"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>

        <Separator className="bg-muted/60" />

        {/* Instructions */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Instructions</h2>
          <div className="text-sm text-foreground/80 prose prose-headings:text-primary prose-a:text-primary max-w-none">
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
