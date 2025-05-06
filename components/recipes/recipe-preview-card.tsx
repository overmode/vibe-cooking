import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Clock, Users } from 'lucide-react'
import { CreateRecipeInput } from '@/lib/validators/recipe'
import { MemoizedMarkdown } from '@/components/chat/memoized-markdown'
import { Badge } from '@/components/ui/badge'

export const RecipePreviewCard = ({
  cardData,
  id,
}: {
  cardData: CreateRecipeInput
  id: string
}) => {
  return (
    <Card className="w-full mx-auto shadow-md border-primary-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 border-b border-primary-200">
        <div className="flex flex-col  gap-3">
          <CardTitle className="text-2xl font-semibold tracking-tight text-primary-900">
            {cardData.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {cardData.duration && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-primary-100 text-primary-700 hover:bg-primary-200"
              >
                <Clock className="h-3 w-3" />
                <span>{cardData.duration || 0} min</span>
              </Badge>
            )}
            {cardData.difficulty && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-primary-100 text-primary-700 hover:bg-primary-200"
              >
                <span>Difficulty: {cardData.difficulty || 1}/10</span>
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-primary-100 text-primary-700 hover:bg-primary-200"
            >
              <Users className="h-3 w-3" />
              <span>{cardData.servings} servings</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <div className="min-h-[200px] flex flex-col">
            <TabsContent value="ingredients" className="mt-0 flex-1">
              <div className="bg-primary-50/50 rounded-lg p-4 h-full">
                <h4 className="font-medium mb-3 text-primary-900">
                  Ingredients ({cardData.ingredients.length})
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {cardData.ingredients.map((ingredient, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-primary-400 mt-1.5 flex-shrink-0"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="instructions" className="mt-0 flex-1">
              <div className="bg-primary-50/50 rounded-lg p-4 h-full">
                <h4 className="font-medium mb-3 text-primary-900">
                  Instructions
                </h4>
                <div className="text-sm text-muted-foreground prose prose-primary max-w-none">
                  <MemoizedMarkdown
                    content={cardData.instructions}
                    id={`instructions-${id}`}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
