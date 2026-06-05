import { MascotIllustration } from '@/components/illustrations/mascot-illustration'
import { Button } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import Link from 'next/link'

export function NoRecipes() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
      <div className="flex flex-col items-center space-y-3 text-center">
        <MascotIllustration expression="excitement" className="size-32 opacity-90" />
        <h3 className="text-xl font-semibold max-w-md">
          Let&apos;s create your first recipe!
        </h3>
      </div>

      <Link href={routes.homeWithMessagePreset("first-recipe")}>
        <Button className="gap-2">Surprise me</Button>
      </Link>
    </div>
  )
}
