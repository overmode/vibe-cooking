"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Assistant" },
  { href: "/cook", label: "Cook" },
  { href: "/shopping", label: "Shopping" },
  { href: "/recipes", label: "Recipes" },
  { href: "/history", label: "History" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-40 h-12 flex items-center justify-between border-b border-border px-4 py-3 bg-card/80 backdrop-blur-md">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
                isActive
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
