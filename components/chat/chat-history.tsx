"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThreads } from "@/lib/api/hooks/chat-thread";
import { type ThreadMetadata } from "@/lib/types";
import { routes } from "@/lib/routes";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const DAY_MS = 86_400_000;

// Deterministic widths: random ones would diverge between SSR and client.
const SKELETON_WIDTHS = ["85%", "70%", "90%", "60%", "78%"];

export function ChatHistory() {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const activeId = pathname.startsWith("/c/") ? pathname.split("/")[2] : null;

  const { data: threads, isLoading, isError } = useThreads();

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {SKELETON_WIDTHS.map((width) => (
              <SidebarMenuItem key={width}>
                <div className="flex h-8 items-center px-2">
                  <Skeleton className="h-4" style={{ width }} />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isError) {
    return (
      <SidebarGroup>
        <SidebarGroupContent className="px-2 text-sm text-muted-foreground">
          Couldn&apos;t load conversations.
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent className="px-2 text-sm text-muted-foreground">
          No conversations yet.
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      {groupThreads(threads).map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.threads.map((thread) => (
                <SidebarMenuItem key={thread.id}>
                  <SidebarMenuButton asChild isActive={thread.id === activeId}>
                    <Link
                      href={routes.chat(thread.id)}
                      title={thread.title ?? undefined}
                      onClick={() => setOpenMobile(false)}
                    >
                      <span className="truncate">
                        {thread.title ?? "New conversation"}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

type ThreadGroup = { label: string; threads: ThreadMetadata[] };

// Threads arrive sorted by updatedAt desc, so each bucket stays ordered.
function groupThreads(threads: ThreadMetadata[]): ThreadGroup[] {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const buckets: Record<string, ThreadMetadata[]> = {
    today: [],
    yesterday: [],
    previous7: [],
    older: [],
  };

  for (const thread of threads) {
    const ts = new Date(thread.updatedAt).getTime();
    if (ts >= startOfToday) buckets.today.push(thread);
    else if (ts >= startOfToday - DAY_MS) buckets.yesterday.push(thread);
    else if (ts >= startOfToday - 7 * DAY_MS) buckets.previous7.push(thread);
    else buckets.older.push(thread);
  }

  return [
    { label: "Today", threads: buckets.today },
    { label: "Yesterday", threads: buckets.yesterday },
    { label: "Previous 7 days", threads: buckets.previous7 },
    { label: "Older", threads: buckets.older },
  ].filter((group) => group.threads.length > 0);
}
