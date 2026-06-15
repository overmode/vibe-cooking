"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useTranslations } from "next-intl";
import { HeaderLogo } from "@/components/layout/header-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { AccountMenu } from "@/components/layout/account-menu";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { routes } from "@/lib/routes";

const navItems = [
  { href: routes.home, labelKey: "assistant" },
  { href: routes.recipes.all, labelKey: "recipes" },
  { href: routes.preferences, labelKey: "aboutYou" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const tNav = useTranslations("nav");
  const tAuth = useTranslations("auth");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex justify-between items-center px-4 border-b",
        "h-16 py-3",
        "bg-card/80 backdrop-blur-md transition-colors duration-200"
      )}
    >
      <div className="flex items-center gap-4">
        <HeaderLogo />

        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-1 flex items-center h-8 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tNav(item.labelKey)}
                {isActive && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>

        {/* Desktop: sign out / auth buttons */}
        {!loading && !user && (
          <Button asChild size="sm" className="hidden md:flex">
            <Link href="/login">{tAuth("signIn")}</Link>
          </Button>
        )}
        {!loading && user && (
          <div className="hidden md:block">
            <AccountMenu email={user.email} />
          </div>
        )}

        {/* Hamburger: mobile nav + auth */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-accent/50 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">{tAuth("toggleMenu")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[250px] sm:w-[300px]"
            aria-describedby={undefined}
          >
            <SheetHeader className="pb-4">
              <SheetTitle>
                <HeaderLogo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center h-10 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent/70"
                      )}
                    >
                      {tNav(item.labelKey)}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
            {!loading && user && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between gap-2 px-4">
                  <AccountMenu email={user.email} align="start" />
                  <LanguageSwitcher />
                </div>
              </div>
            )}
            {!loading && !user && (
              <div className="mt-4 border-t pt-4 flex flex-col gap-2 px-4">
                <div className="flex justify-end">
                  <LanguageSwitcher />
                </div>
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="flex items-center justify-center h-9 rounded-md border text-sm font-medium transition-colors hover:bg-accent"
                  >
                    {tAuth("signIn")}
                  </Link>
                </SheetClose>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
