"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useThreadMessages } from "@/lib/api/hooks/chat-thread";
import { AssistantChat } from "@/components/chat/assistant-chat";
import { chatSuggestions } from "@/lib/constants/chat-suggestions";

export default function ChatThreadPage() {
  const { threadId } = useParams<{ threadId: string }>();

  const query = useThreadMessages({
    threadId,
    options: { enabled: !!threadId },
  });

  if (query.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-destructive">Failed to load conversation</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    );
  }

  // Empty data (unknown or not-yet-saved thread) renders a blank chat; the first
  // turn creates the thread under this id.
  return (
    <AssistantChat
      key={threadId}
      threadId={threadId}
      initialMessages={query.data ?? []}
      suggestions={chatSuggestions}
    />
  );
}
