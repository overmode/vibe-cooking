import Link from "next/link";
import Image from "next/image";

export function HeaderLogo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-1.5">
        <Image
          src="/logo-coconut-bowl.png"
          alt="Vibe Cooking Logo"
          width={64}
          height={64}
        />
        <span className="font-semibold text-xl text-muted-foreground translate-y-1">
          Vibe Cooking
        </span>
      </div>
    </Link>
  );
}
