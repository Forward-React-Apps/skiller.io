import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

  import { Button } from "@/components/ui/button"
  import { Trash2 } from "lucide-react"
  
  export function CustomAlertDialog({onConfirm, onCancel}: {
    onConfirm: () => void
    onCancel: () => void
  }) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="text-red-500"><Trash2 className="h-4 w-4" /> Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This skill data will be wiped from your local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }