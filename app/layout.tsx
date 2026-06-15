import { type Metadata, type Viewport } from "next";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import "./globals.css";
import { Header } from "@/components/layout/header";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#402A12",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: "Vibe Cooking",
    description: t("description"),
    appleWebApp: {
      capable: true,
      title: "Vibe Cooking",
      statusBarStyle: "default",
    },
    icons: {
      icon: "/logo.svg",
      apple: "/icons/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col h-full`}
      >
        <NextIntlClientProvider>
          <AuthKitProvider>
            <QueryProvider>
              <Header />

              <div className="flex-1 overflow-hidden">{children}</div>

              <Toaster position="top-center" />
            </QueryProvider>
          </AuthKitProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
