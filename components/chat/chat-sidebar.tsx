"use client";

import { useRouter } from "next/navigation";
import { PanelLeft, PenSquare } from "lucide-react";
import { ChatHistory } from "@/components/chat/chat-history";
import { routes } from "@/lib/routes";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function ChatSidebar() {
  const router = useRouter();
  const { setOpenMobile, toggleSidebar } = useSidebar();

  // Collapses to an icon rail (not offcanvas) so the toggle always has a home
  // and the chat is never obstructed. Offset below the 64px header.
  return (
    <Sidebar collapsible="icon" className="top-16 h-[calc(100svh-4rem)]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} tooltip="Toggle sidebar">
              <PanelLeft className="size-4" />
              <span className="font-medium">Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="New chat"
              onClick={() => {
                setOpenMobile(false);
                router.push(routes.home);
              }}
            >
              <PenSquare className="size-4" />
              <span className="font-medium">New chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Text-only history is meaningless in the icon rail; hide it there. */}
        <div className="group-data-[collapsible=icon]:hidden">
          <ChatHistory />
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
