import { Check, X } from 'lucide-react'

export const ToolSpinner = ({ message }: { message: string }) => {
  return (
    <p className="text-muted-foreground flex items-center gap-2">
      <span className="inline-block w-4 h-4 border-2 border-current border-b-transparent rounded-full animate-spin"></span>
      {message}
    </p>
  )
}

export const ToolSuccess = ({ message }: { message: string }) => {
  return (
    <p className="text-muted-foreground flex items-center gap-2">
      <Check className="w-4 h-4 text-success" />
      {message}
    </p>
  )
}

export const ToolError = ({ message }: { message: string }) => {
  return (
    <p className="text-muted-foreground flex items-center gap-2">
      <X className="w-4 h-4 text-destructive" />
      {message}
    </p>
  )
}
