import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { CardDisplayMetadata } from '@/lib/types'

export const RecipeMetadataDescription = ({
  duration,
  difficulty,
  servings,
}: {
  duration: number | null | undefined
  difficulty: number | null | undefined
  servings: number | null | undefined
}) => {
  return (
    <div className="flex flex-wrap items-center">
      {duration && (
        <>
          <div className="flex flex-wrap items-center">
            <span
              className={`flex items-center gap-1.5 text-muted-foreground text-sm font-medium`}
            >
              <Clock className="h-3.5 w-3.5 opacity-80" />
              <span>{duration} min</span>
            </span>
          </div>
          <span className="mx-2 text-muted-foreground">•</span>
        </>
      )}
      {difficulty && (
        <>
          <div className="flex flex-wrap items-center">
            <span
              className={`flex items-center gap-1.5 text-muted-foreground text-sm font-medium`}
            >
              <span>Level {difficulty}/10</span>
            </span>
          </div>
          <span className="mx-2 text-muted-foreground">•</span>
        </>
      )}
      {servings && (
        <div className="flex flex-wrap items-center">
          <span
            className={`flex items-center gap-1.5 text-muted-foreground text-sm font-medium`}
          >
            <Users className="h-3.5 w-3.5 opacity-80" />
            <span>{servings} servings</span>
          </span>
        </div>
      )}
    </div>
  )
}

export interface RecipeCardBaseProps {
  metadata: CardDisplayMetadata
  linkHref: string
  actionContent?: React.ReactNode
  className?: string
}

export function RecipeCardBase({
  metadata,
  linkHref,
  actionContent,
  className,
}: RecipeCardBaseProps) {
  const { name, duration, difficulty, servings } = metadata

  return (
    <Link
      href={linkHref}
      className="block transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
    >
      <Card
        className={`h-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
          className || ''
        }`}
      >
        <CardHeader>
          <CardTitle className="leading-tight line-clamp-2">{name}</CardTitle>
          <CardDescription>
            <RecipeMetadataDescription
              duration={duration}
              difficulty={difficulty}
              servings={servings}
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actionContent && (
            <div className="mt-auto pt-3 opacity-90 hover:opacity-100 transition-opacity">
              {actionContent}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
