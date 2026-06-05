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
          height={34}
          priority
          unoptimized
          className="w-9 h-[34px]"
        />
        <span className="font-medium text-xl text-foreground">
          Vibe Cooking
        </span>
      </div>
    </Link>
  );
}
