'use client'

import { UseMutationResult } from '@tanstack/react-query'
import { Loader2, AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { useEffect } from 'react'

interface DeleteConfirmationDialogProps {
  title: string
  itemName: string
  deleteMutation: UseMutationResult<unknown, Error, void, unknown>
  open: boolean
  onOpenChange: (open: boolean) => void
  deleteButtonText?: string
  pendingText?: string
}

export function DeleteConfirmationDialog({
  title,
  itemName,
  deleteMutation,
  open,
  onOpenChange,
  deleteButtonText = 'Delete',
  pendingText = 'Deleting...',
}: DeleteConfirmationDialogProps) {
  useEffect(() => {
    if (deleteMutation.isPending && open) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault()
        e.returnValue = ''
      }

      window.addEventListener('beforeunload', handleBeforeUnload)
      return () =>
        window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [deleteMutation.isPending, open])

  // Handle dialog close attempts
  const handleOpenChange = (newOpenState: boolean) => {
    // Prevent closing the dialog if deletion is in progress
    if (deleteMutation.isPending && !newOpenState) {
      return
    }

    // Otherwise allow normal open/close behavior
    onOpenChange(newOpenState)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-lime-200">
        <AlertDialogHeader className="gap-3">
          <div className="bg-red-50 dark:bg-red-900/20 w-fit mx-auto rounded-full p-2.5">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete{' '}
            <span className="font-medium text-lime-700 dark:text-lime-400">
              {itemName}
            </span>
            ?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-3 mt-2">
          <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {pendingText}
              </>
            ) : (
              deleteButtonText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
