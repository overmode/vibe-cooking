import Image from 'next/image'

const illustrations = {
  excitement: '/illustrations/excitement.svg',
  'x-eyes': '/illustrations/x-eyes.svg',
} as const

export type MascotExpression = keyof typeof illustrations

export function MascotIllustration({
  expression,
  className,
}: {
  expression: MascotExpression
  className?: string
}) {
  return (
    <Image
      src={illustrations[expression]}
      alt=""
      width={100}
      height={100}
      unoptimized
      aria-hidden
      className={className ?? 'size-24 opacity-90'}
    />
  )
}
