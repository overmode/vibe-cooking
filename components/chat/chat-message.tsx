import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import { MemoizedMarkdown } from "@/components/chat/memoized-markdown";
import { RecipePreviewCard } from "../recipe/recipe-preview-card";
// import { AskForConfirmation } from "@/components/chat/tool-renders/ask-for-confirmation";

// type AddToolResult = ({
//   toolCallId,
//   result,
// }: {
//   toolCallId: string;
//   result: string;
// }) => void;

interface ChatMessageProps {
  message: Message;
  //   addToolResult: AddToolResult;
}

export function ChatMessage({
  message,
}: //   addToolResult,
ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className="flex w-full mt-4">
      <div
        className={cn(
          "flex w-full items-start gap-3",
          isUser ? "ml-auto max-w-[80%]" : "max-w-[95%]"
        )}
      >
        {!isUser && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src="/logo-coconut-bowl.png" alt="Vibe Cooking Logo" />
            <AvatarFallback className="bg-lime-200 text-primary-foreground">
              🍳
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col gap-2 w-full">
          {message.parts?.map((part, index) => {
            let content = null;

            switch (part.type) {
              case "text":
                content = (
                  <MemoizedMarkdown content={part.text} id={message.id} />
                );
                break;
              case "tool-invocation":
                const callId = part.toolInvocation.toolCallId;
                if (
                  part.toolInvocation.toolName === "renderRecipePreviewTool"
                ) {
                  //In all cases, we display a preview of the recipe
                  content = (
                    <div className="w-full">
                      <RecipePreviewCard
                        cardData={part.toolInvocation.args}
                        id={callId}
                      />
                    </div>
                  );
                  break;
                }
                break;
            }

            return content && message.parts ? (
              <div
                key={index}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm",
                  isUser
                    ? "bg-primary text-primary-foreground ml-auto w-fit"
                    : part.type === "tool-invocation"
                    ? "w-full"
                    : "bg-muted w-fit"
                )}
              >
                {content}
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
