import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreateRecipeInput } from '@/lib/validators/recipe'
import { MemoizedMarkdown } from '@/components/chat/memoized-markdown'
import { RecipeMetadataDescription } from './shared/recipe-card-base'
export const RecipePreviewCard = ({
  cardData,
  id,
}: {
  cardData: CreateRecipeInput
  id: string
}) => {
  return (
    <Card className="w-full mx-auto overflow-hidden shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{cardData.name}</CardTitle>
        <CardDescription>
          <RecipeMetadataDescription
            duration={cardData.duration}
            difficulty={cardData.difficulty}
            servings={cardData.servings}
          />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-5">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <div className="flex flex-col">
            <TabsContent value="ingredients">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                {cardData.ingredients.map((ingredient, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="instructions" className="mt-0 flex-1">
              <div className="text-sm text-muted-foreground prose prose-primary max-w-none p-4">
                <MemoizedMarkdown
                  content={cardData.instructions}
                  id={`instructions-${id}`}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
