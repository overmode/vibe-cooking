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
        className="flex items-center gap-1"
      >
        <Clock className="h-3 w-3" />
        <span>{duration} min</span>
      </Badge>
    ),
    difficulty && (
      <Badge
        key="difficulty"
        variant="secondary"
        className="flex items-center gap-1"
      >
        <span>Difficulty: {difficulty}/10</span>
      </Badge>
    ),
    servings && servings > 0 && (
      <Badge
        key="servings"
        variant="secondary"
        className="flex items-center gap-1"
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
      className="block transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
    >
      <Card
        className={`h-full overflow-hidden border border-border shadow-sm hover:shadow transition-shadow duration-200 ${
          className || ''
        }`}
      >
        <div className="flex h-full flex-col bg-card p-4 text-card-foreground">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="line-clamp-2 text-xl font-semibold">{name}</h3>
            {headerIcon}
          </div>

          {badgesToRender.length > 0 && (
            <div className="mb-4 min-h-8 flex flex-wrap gap-2">
              {badgesToRender}
            </div>
          )}

          {actionContent && <div className="mt-auto pt-2">{actionContent}</div>}
        </div>
      </Card>
    </Link>
  )
}
