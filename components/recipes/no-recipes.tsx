import { Button } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export function NoRecipes() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="rounded-full bg-muted p-4">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">No recipes found</h3>
        <p className="text-muted-foreground max-w-md">
          You don&apos;t have any recipes yet.
        </p>
        <p className="text-muted-foreground max-w-md">
          Ask your assistant to create one for you!
        </p>
      </div>

      <Link href={routes.home}>
        <Button className="gap-2">Ask the assistant</Button>
      </Link>
    </div>
  )
}
