import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { CardDisplayMetadata } from '@/lib/types'

export interface RecipeCardBaseProps {
  metadata: CardDisplayMetadata
  linkHref: string
  headerIcon?: React.ReactNode
  badges?: React.ReactNode[]
  actionContent?: React.ReactNode
  className?: string
}

export function RecipeCardBase({
  metadata,
  linkHref,
  headerIcon,
  badges: customBadges,
  actionContent,
  className,
}: RecipeCardBaseProps) {
  const { name, duration, difficulty, servings } = metadata

  // Default badges based on metadata
  const defaultBadges = [
    duration && (
      <Badge
        key="duration"
        variant="secondary"
        className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
      >
        <Clock className="h-3 w-3" />
        <span>{duration} min</span>
      </Badge>
    ),
    difficulty && (
      <Badge
        key="difficulty"
        variant="secondary"
        className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
      >
        <span>Difficulty: {difficulty}/10</span>
      </Badge>
    ),
    servings && servings > 0 && (
      <Badge
        key="servings"
        variant="secondary"
        className="flex items-center gap-1 bg-lime-100 text-lime-700 hover:bg-lime-200"
      >
        <Users className="h-3 w-3" />
        <span>{servings} servings</span>
      </Badge>
    ),
  ].filter(Boolean)

  // Use custom badges if provided, otherwise use default badges
  const badgesToRender = customBadges || defaultBadges

  return (
    <Link
      href={linkHref}
      className="transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none block"
    >
      <Card
        className={`h-full overflow-hidden border-lime-100 shadow-md hover:shadow-lg transition-shadow duration-200 ${
          className || ''
        }`}
      >
        <div className="bg-gradient-to-r from-lime-50 to-lime-100 p-4 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold line-clamp-2 text-lime-900">
              {name}
            </h3>
            {headerIcon}
          </div>

          {badgesToRender.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 min-h-8">
              {badgesToRender}
            </div>
          )}

          {actionContent && <div className="mt-auto pt-2">{actionContent}</div>}
        </div>
      </Card>
    </Link>
  )
}
