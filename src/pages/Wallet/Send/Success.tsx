import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function Submit ({ hash }: {
  hash: string
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Success!</AlertDialogTitle>
        <AlertDialogDescription>
          Your transactions are on blocks of network now.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Close</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
