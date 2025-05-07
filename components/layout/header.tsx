'use client'

import {
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { SignedIn } from '@clerk/nextjs'
import { HeaderLogo } from '@/components/layout/header-logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { routes } from '@/lib/routes'

// Navigation items
const navItems = [
  { href: routes.home, label: 'Assistant' },
  { href: routes.recipes.all, label: 'Recipes' },
  { href: routes.plannedMeal.all, label: 'Planned Meals' },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex justify-between items-center px-4 border-b',
        'h-16 py-3',
        'bg-card/80 backdrop-blur-md transition-colors duration-200'
      )}
    >
      <div className="flex items-center gap-4">
        <HeaderLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-1 flex items-center h-8 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-accent/50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <SheetHeader className="pb-4">
              <SheetTitle>
                <HeaderLogo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 mt-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center h-10 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent/70'
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                )
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Auth Buttons */}
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">Sign Up</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}
