import { type Metadata, type Viewport } from 'next'
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
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
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col h-full`}
      >
        <AuthKitProvider>
          <QueryProvider>
            <Header />

            <div className="flex-1 overflow-hidden">{children}</div>

            <Toaster position="top-center" />
          </QueryProvider>
        </AuthKitProvider>
      </body>
    </html>
  )
}
