import { ReactNode } from "react";
import { TopNav } from "@/components/layout/top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopNav />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
