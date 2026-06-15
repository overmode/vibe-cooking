import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Clock, Flame, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { type CardDisplayMetadata } from '@/lib/types'

export const RecipeMetadataDescription = ({
  duration,
  difficulty,
  servings,
}: {
  duration: number | null | undefined
  difficulty: number | null | undefined
  servings: number | null | undefined
}) => {
  const t = useTranslations('recipes')
  const items = [
    duration && (
      <span key="duration" className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 opacity-80" />
        {t('minutes', { count: duration })}
      </span>
    ),
    difficulty && (
      <span key="difficulty">{t('level', { level: difficulty })}</span>
    ),
    servings && (
      <span key="servings" className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5 opacity-80" />
        {t('servings', { count: servings })}
      </span>
    ),
  ].filter(Boolean)

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-muted-foreground">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-40">•</span>}
          {item}
        </span>
      ))}
    </div>
  )
}

export interface RecipeCardBaseProps {
  metadata: CardDisplayMetadata
  linkHref: string
  actions?: React.ReactNode
  className?: string
}

export function RecipeCardBase({
  metadata,
  linkHref,
  actions,
  className,
}: RecipeCardBaseProps) {
  const { name, duration, difficulty, servings } = metadata
  const t = useTranslations('recipes')

  return (
    <Link
      href={linkHref}
      className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card
        className={cn(
          'h-full min-h-[160px] overflow-hidden',
          'shadow-sm hover:shadow-md transition-all duration-200',
          className
        )}
      >
        <CardHeader>
          <CardTitle className="text-base font-semibold text-primary-text leading-snug line-clamp-2">
            {name}
          </CardTitle>
          {actions && (
            <CardAction
              className="-mr-2 -mt-1 transition-opacity focus-within:opacity-100 has-[[data-state=open]]:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              {actions}
            </CardAction>
          )}
        </CardHeader>

        <CardFooter className="mt-auto flex flex-wrap gap-1.5">
          {duration && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {t('minutes', { count: duration })}
            </Badge>
          )}
          {difficulty && (
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3 w-3" />
              {t('level', { level: difficulty })}
            </Badge>
          )}
          {servings && (
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {servings}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
