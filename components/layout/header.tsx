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

// Navigation items
const navItems = [
  { href: '/', label: 'Assistant' },
  { href: '/recipes', label: 'Recipes' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 h-16 flex justify-between items-center px-4 py-3 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <HeaderLogo />

        <nav className="hidden sm:flex items-center gap-4">
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
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary" />
                )}
              </Link>
            )
          })}
          <Link
            href="/planned-meals"
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              pathname === '/planned-meals'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            Planned Meals
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm">
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
