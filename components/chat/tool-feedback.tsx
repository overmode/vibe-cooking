import { Check, X } from 'lucide-react'

type ToolShellProps = {
  icon: React.ReactNode
  message: string
}

const ToolShell = ({ icon, message }: ToolShellProps) => (
  <p className="text-muted-foreground flex items-center gap-2 py-2">
    {icon}
    {message}
  </p>
)

export const ToolSpinner = ({ message }: { message: string }) => (
  <ToolShell
    icon={
      <span className="inline-block w-4 h-4 border-2 border-current border-b-transparent rounded-full animate-spin"></span>
    }
    message={message}
  />
)

export const ToolSuccess = ({ message }: { message: string }) => (
  <ToolShell
    icon={<Check className="w-4 h-4 text-success" />}
    message={message}
  />
)

export const ToolError = ({ message }: { message: string }) => (
  <ToolShell
    icon={<X className="w-4 h-4 text-destructive" />}
    message={message}
  />
)
