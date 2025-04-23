import { Recipe } from "@prisma/client";
import { Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MemoizedMarkdown } from "@/components/chat/memoized-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RecipeViewer({ recipe }: { recipe: Recipe }) {
  return (
    <ScrollArea className="h-[calc(100vh-8.5rem)]">
    <div className="p-6 space-y-6">
      {/* Recipe header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-lime-900">{recipe.name}</h1>
        <div className="flex flex-wrap gap-2">
          {recipe.duration && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
            >
              <Clock className="h-3 w-3" />
              <span>{recipe.duration} min</span>
            </Badge>
          )}
          {recipe.difficulty && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
            >
              <span>Difficulty: {recipe.difficulty}/10</span>
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
          >
            <Users className="h-3 w-3" />
            <span>{recipe.servings} servings</span>
          </Badge>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-lime-800">Ingredients</h2>
        <ul className="grid grid-cols-1 gap-2">
          {recipe.ingredients.map((ingredient, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-lime-400 mt-1.5 flex-shrink-0"></span>
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-lime-800">Instructions</h2>
        <div className="text-sm text-muted-foreground prose prose-lime max-w-none">
          <MemoizedMarkdown
            content={recipe.instructions}
            id={`cooking-instructions-${recipe.id}`}
          />
        </div>
      </div>
    </div>
    </ScrollArea>
  );
} 