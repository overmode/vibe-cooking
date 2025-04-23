import { ReactNode } from "react";
// import { TopNav } from "@/components/layout/top-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <TopNav /> */}
      <div className="bg-background text-foreground flex flex-col">
        <main className="flex-1 w-full max-w-3xl mx-auto px-4">{children}</main>
      </div>
    </>
  );
}
