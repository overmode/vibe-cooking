'use client'

import { ReactNode, useState } from 'react'
import { UIMessage } from 'ai'
import { Chat } from './chat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChatCanvaProps {
  contentNode: ReactNode
  messages: UIMessage[]
  sendMessage: (text: string) => void
  error?: Error | undefined
  contentTabLabel: string
  chatTabLabel?: string
  contentActions?: ReactNode
  onGoBack?: () => void
  isWaiting: boolean
}

export function ChatCanva({
  contentNode,
  messages,
  sendMessage,
  error,
  contentTabLabel,
  chatTabLabel = 'Assistant',
  contentActions,
  onGoBack,
  isWaiting,
}: ChatCanvaProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>('content')

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      router.back()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r h-full overflow-y-auto">
          {contentNode}
        </div>
        <div className="w-1/2 h-full overflow-hidden">
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            error={error}
            isWaiting={isWaiting}
          />
        </div>
      </div>

      <div className="md:hidden flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <div className="flex items-center gap-1 border-b sticky top-0 z-10 bg-background px-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="h-8 w-8 shrink-0 text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <TabsList className="flex-1 h-auto justify-center gap-6 rounded-none border-0 bg-transparent p-0">
              <TabsTrigger
                value="content"
                className="h-auto rounded-none border-0 border-b-2 border-transparent bg-transparent px-1 py-2.5 text-sm font-normal text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {contentTabLabel}
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="h-auto rounded-none border-0 border-b-2 border-transparent bg-transparent px-1 py-2.5 text-sm font-normal text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {chatTabLabel}
              </TabsTrigger>
            </TabsList>
            {contentActions && (
              <div className="shrink-0 pr-1">{contentActions}</div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <TabsContent value="content" className="h-full overflow-y-auto">
              {contentNode}
            </TabsContent>
            <TabsContent value="chat" className="h-full overflow-hidden">
              <Chat
                messages={messages}
                sendMessage={sendMessage}
                error={error}
                isWaiting={isWaiting}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
