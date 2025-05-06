import { Recipe } from '@prisma/client'
import { Clock, Users, ChefHat } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MemoizedMarkdown } from '@/components/chat/memoized-markdown'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function RecipeViewer({ recipe }: { recipe: Recipe }) {
  return (
    <ScrollArea className="h-full">
      <Card className="border-0 shadow-none">
        <div className="p-6 space-y-8">
          {/* Recipe header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">{recipe.name}</h1>
            <div className="flex flex-wrap gap-2">
              {recipe.duration && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 text-foreground/80"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>{recipe.duration} min</span>
                </Badge>
              )}
              {recipe.difficulty && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 text-foreground/80"
                >
                  <ChefHat className="h-3.5 w-3.5" />
                  <span>Level {recipe.difficulty}/10</span>
                </Badge>
              )}
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 text-foreground/80"
              >
                <Users className="h-3.5 w-3.5" />
                <span>{recipe.servings} servings</span>
              </Badge>
            </div>
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
      </Card>
    </ScrollArea>
  )
}
