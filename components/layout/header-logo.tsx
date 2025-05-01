import Link from "next/link";
import Image from "next/image";

export function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="flex items-center gap-1.5 h-10">
        <Image
          src="/logo-coconut-bowl.png"
          alt="Vibe Cooking Logo"
          width={36}
          height={36}
          className="object-contain"
        />
        <span className="font-semibold text-xl text-muted-foreground">
          Vibe Cooking
        </span>
      </div>
    </Link>
  );
}
