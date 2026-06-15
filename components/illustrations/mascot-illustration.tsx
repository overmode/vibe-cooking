import Image from "next/image";

const illustrations = {
  excitement: "/illustrations/excitement.svg",
  "x-eyes": "/illustrations/x-eyes.svg",
  friendly: "/illustrations/friendly.svg",
} as const;

export type MascotExpression = keyof typeof illustrations;

export function MascotIllustration({
  expression,
  className,
  priority = false,
}: {
  expression: MascotExpression;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={illustrations[expression]}
      alt=""
      width={100}
      height={100}
      unoptimized
      priority={priority}
      aria-hidden
      className={className ?? "size-24 opacity-90"}
    />
  );
}
