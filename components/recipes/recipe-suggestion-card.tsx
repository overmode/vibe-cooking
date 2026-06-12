"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type CreateRecipeInput } from "@/lib/validators/recipe";
import { MemoizedMarkdown } from "@/components/chat/memoized-markdown";
import { useChatSend } from "@/components/chat/chat-send-context";
import { cn } from "@/lib/utils";
import { Clock, Flame, Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";

function RecipeCardScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 600);
  };

  return (
    <div
      onScroll={handleScroll}
      className={cn(
        "overflow-y-auto pr-1 scrollbar-fade max-h-52 sm:max-h-64",
        isScrolling && "is-scrolling",
        className,
      )}
    >
      {children}
    </div>
  );
}

export const RecipeSuggestionCard = ({
  cardData,
  id,
}: {
  cardData: CreateRecipeInput;
  id: string;
}) => {
  const sendMessage = useChatSend();
  const t = useTranslations("recipes");

  return (
    <Card className="w-full overflow-hidden shadow-sm py-3 gap-3 sm:py-6 sm:gap-6">
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg text-primary-text leading-snug">
          {cardData.name}
        </CardTitle>
        <div className="flex flex-wrap gap-1.5">
          {cardData.duration && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {t("minutes", { count: cardData.duration })}
            </Badge>
          )}
          {cardData.difficulty && (
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3 w-3" />
              {t("level", { level: cardData.difficulty })}
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
            <TabsTrigger value="ingredients">{t("ingredients")}</TabsTrigger>
            <TabsTrigger value="instructions">{t("instructions")}</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients">
            <RecipeCardScrollArea>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
            </RecipeCardScrollArea>
          </TabsContent>
          <TabsContent value="instructions" className="mt-0">
            <RecipeCardScrollArea className="text-sm text-muted-foreground prose prose-primary max-w-none">
              <MemoizedMarkdown
                content={cardData.instructions}
                id={`instructions-${id}`}
              />
            </RecipeCardScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>

      {sendMessage && (
        <CardFooter className="px-3 sm:px-6 pt-0 sm:justify-end">
          <Button
            className="w-full sm:w-auto sm:max-w-48"
            onClick={() =>
              sendMessage(t("saveToLibraryMessage", { name: cardData.name }))
            }
          >
            <Plus className="h-4 w-4" />
            {t("add")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
