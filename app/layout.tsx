import { type Metadata, type Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/app-shell'
import { Header } from '@/components/layout/header'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/components/providers/query-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Vibe Cooking',
  description: 'Assistant-powered cooking app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-screen">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-lime-50 to-amber-50 dark:from-background dark:to-background flex flex-col h-full`}
        >
          <QueryProvider>
            {/* Sticky global header (logo + auth controls) */}
            <Header />

            {/* Shell includes nav + layout spacing */}
            <div className="flex-1 overflow-hidden">
              <AppShell>{children}</AppShell>
            </div>

            {/* Toast notifications */}
            <Toaster position="top-center" />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
