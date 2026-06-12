import Link from "next/link";
import Image from "next/image";

export function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="flex items-center gap-1.5">
        <Image
          src="/logo.svg"
          alt="Vibe Cooking Logo"
          width={36}
          height={36}
          priority
          unoptimized
          className="size-9"
        />
        {/* eslint-disable-next-line i18next/no-literal-string -- brand name, never translated */}
        <span className="font-medium text-xl text-foreground">Vibe Cooking</span>
      </div>
    </Link>
  );
}
