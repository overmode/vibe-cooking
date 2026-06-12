"use client";

import { PanelLeft, PenSquare } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const { setOpenMobile, toggleSidebar } = useSidebar();
  const t = useTranslations("sidebar");

  const startNewChat = () => {
    setOpenMobile(false);
    // Home stays mounted across the replaceState URL stamp, so a client nav back
    // to "/" only resets the URL and reuses the same instance (stale messages,
    // same threadId). A full load is the reliable way to mint a fresh thread.
    window.location.assign(routes.home);
  };

  // Collapses to an icon rail (not offcanvas) so the toggle always has a home
  // and the chat is never obstructed. Offset below the 64px header.
  return (
    <Sidebar collapsible="icon" className="top-16 h-[calc(100svh-4rem)]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} tooltip={t("toggle")}>
              <PanelLeft className="size-4" />
              <span className="font-medium">{t("collapse")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t("newChat")} onClick={startNewChat}>
              <PenSquare className="size-4" />
              <span className="font-medium">{t("newChat")}</span>
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
