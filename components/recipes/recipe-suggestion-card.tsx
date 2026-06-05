import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateRecipeInput } from "@/lib/validators/recipe";
import { MemoizedMarkdown } from "@/components/chat/memoized-markdown";
import { Clock, Flame, Users } from "lucide-react";

export const RecipeSuggestionCard = ({
  cardData,
  id,
}: {
  cardData: CreateRecipeInput;
  id: string;
}) => {
  return (
    <Card className="w-full overflow-hidden shadow-sm py-3 gap-3 sm:py-6 sm:gap-6">
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg text-primary leading-snug">
          {cardData.name}
        </CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {cardData.duration && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {cardData.duration} min
            </Badge>
          )}
          {cardData.difficulty && (
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3 w-3" />
              Level {cardData.difficulty}/10
            </Badge>
          )}
          {cardData.servings && (
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {cardData.servings}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6">
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-52 sm:max-h-64 overflow-y-auto pr-1">
              {cardData.ingredients.map((ingredient, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="instructions" className="mt-0">
            <div className="text-sm text-muted-foreground prose prose-primary max-w-none max-h-52 sm:max-h-64 overflow-y-auto pr-1">
              <MemoizedMarkdown
                content={cardData.instructions}
                id={`instructions-${id}`}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
