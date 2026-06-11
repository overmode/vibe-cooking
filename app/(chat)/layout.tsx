import { type ReactNode } from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ChatLayout({ children }: { children: ReactNode }) {
  // Override the provider's min-h-svh: it lives below the 64px header, inside a
  // height-bounded container.
  return (
    <SidebarProvider className="h-full min-h-0">
      <ChatSidebar />
      <SidebarInset className="relative h-full min-h-0">
        {/* Desktop toggles from the rail/header; mobile has no rail, so it needs
            a way to open the sheet. */}
        <SidebarTrigger className="absolute left-2 top-2 z-20 size-8 rounded-full border bg-background/70 shadow-sm backdrop-blur-sm md:hidden" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
