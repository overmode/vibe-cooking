import { SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { SignedIn } from '@clerk/nextjs'
import { HeaderLogo } from '@/components/layout/header-logo'

export function Header() {
  return (
    <header className="h-16 flex justify-between items-center px-4 py-3 border-b border-border bg-card/80 backdrop-blur-md">
        <HeaderLogo />
        <div className="flex items-center gap-4">
        <SignedOut>
            <SignInButton />
            <SignUpButton />
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
        </div>
    </header>

  )
}