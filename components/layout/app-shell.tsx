import { ReactNode } from "react";
// import { TopNav } from "@/components/layout/top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground h-full">
      <main className="w-full mx-auto px-4 max-w-7xl h-full">
        {children}
      </main>
    </div>
  );
}