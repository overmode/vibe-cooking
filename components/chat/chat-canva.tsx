'use client'

import { ReactNode, useState } from 'react'
import { UIMessage } from 'ai'
import { Chat } from './chat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChatCanvaProps {
  title: string
  contentNode: ReactNode
  messages: UIMessage[]
  sendMessage: (text: string) => void
  error?: Error | undefined
  contentTabLabel: string
  chatTabLabel?: string
  actions?: ReactNode
  onGoBack?: () => void
}

export function ChatCanva({
  title,
  contentNode,
  messages,
  sendMessage,
  error,
  actions,
  contentTabLabel,
  chatTabLabel = 'Assistant',
  onGoBack,
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
      <div className="flex justify-between items-center p-2 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-sm font-medium mx-auto">{title}</h3>
          <div className="flex items-center gap-2">
            {actions || <div className="w-8"></div>}
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r h-full overflow-y-auto">
          {contentNode}
        </div>
        <div className="w-1/2 h-full overflow-y-auto">
          <Chat
            messages={messages}
            sendMessage={sendMessage}
            error={error}
          />
        </div>
      </div>

      <div className="md:hidden flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="grid grid-cols-2 w-full sticky top-0 z-10">
            <TabsTrigger value="content">{contentTabLabel}</TabsTrigger>
            <TabsTrigger value="chat">{chatTabLabel}</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-hidden">
            <TabsContent value="content" className="h-full overflow-y-auto">
              {contentNode}
            </TabsContent>
            <TabsContent value="chat" className="h-full overflow-y-auto">
              <Chat
                messages={messages}
                sendMessage={sendMessage}
                error={error}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
