import { Card } from '@/components/ui/card'
import { Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { CardDisplayMetadata } from '@/lib/types'

export interface RecipeCardBaseProps {
  metadata: CardDisplayMetadata
  linkHref: string
  headerIcon?: React.ReactNode
  actionContent?: React.ReactNode
  className?: string
}

// New component to display metadata items
export function MetadataItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`flex items-center gap-1.5 text-primary text-sm font-medium ${className}`}
    >
      {children}
    </span>
  )
}

export function RecipeCardBase({
  metadata,
  linkHref,
  headerIcon,
  actionContent,
  className,
}: RecipeCardBaseProps) {
  const { name, duration, difficulty, servings } = metadata

  // Default metadata items based on recipe properties
  const metadataToRender = [
    duration && (
      <MetadataItem key="duration">
        <Clock className="h-3.5 w-3.5 text-primary/80" />
        <span>{duration} min</span>
      </MetadataItem>
    ),
    difficulty && (
      <MetadataItem key="difficulty">
        <span>Level {difficulty}/10</span>
      </MetadataItem>
    ),
    servings && servings > 0 && (
      <MetadataItem key="servings">
        <Users className="h-3.5 w-3.5 text-primary/80" />
        <span>{servings} servings</span>
      </MetadataItem>
    ),
  ].filter(Boolean)

  return (
    <Link
      href={linkHref}
      className="block transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
    >
      <Card
        className={`h-full overflow-hidden border-border/30 shadow-sm hover:shadow-md transition-all duration-300 ${
          className || ''
        }`}
      >
        <div className="flex h-full flex-col bg-card p-5 text-card-foreground">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="line-clamp-2 text-xl font-semibold leading-tight tracking-tight relative pl-3 border-l-2 border-primary/70">
              {name}
            </h3>
            {headerIcon && <div className="ml-2">{headerIcon}</div>}
          </div>

          {metadataToRender.length > 0 && (
            <div className="mb-4 min-h-8 flex flex-wrap items-center">
              {metadataToRender.map((item, index) => (
                <div key={index} className="flex items-center">
                  {item}
                  {index < metadataToRender.length - 1 && (
                    <span className="mx-2 text-primary/30">•</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {actionContent && (
            <div className="mt-auto pt-3 opacity-90 hover:opacity-100 transition-opacity">
              {actionContent}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
