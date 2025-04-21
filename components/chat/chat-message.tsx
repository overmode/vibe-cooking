import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Message } from "@ai-sdk/react";
import { MemoizedMarkdown } from "@/components/chat/memoized-markdown";
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
    <div className="flex w-full">
      <div
        className={cn(
          "flex w-full max-w-[80%] items-start gap-3",
          isUser ? "ml-auto" : ""
        )}
      >
        {!isUser && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">
              AI
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
              //   case "tool-invocation":
              //     const callId = part.toolInvocation.toolCallId;
              //     if (part.toolInvocation.toolName === "askForConfirmationTool") {
              //       content = (
              //         <AskForConfirmation
              //           part={part}
              //           callId={callId}
              //           addToolResult={addToolResult}
              //         />
              //       );
              //     }
              //     break;
            }

            return content && message.parts ? (
              <div
                key={index}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm w-fit",
                  isUser
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
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
