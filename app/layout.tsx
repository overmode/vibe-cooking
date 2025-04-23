import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { HeaderLogo } from "@/components/layout/header-logo";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe Cooking",
  description: "Assistant-powered cooking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-lime-50 to-amber-50 dark:from-background dark:to-background min-h-screen flex flex-col`}
        >
          <QueryProvider>
            {/* Sticky global header (logo + auth controls) */}
            <header className="sticky top-0 z-50 h-16 flex justify-between items-center px-4 py-3 border-b border-border bg-card/80 backdrop-blur-md">
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

            {/* Shell includes nav + layout spacing */}
            <AppShell>{children}</AppShell>
            
            {/* Toast notifications */}
            <Toaster position="top-center" />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
