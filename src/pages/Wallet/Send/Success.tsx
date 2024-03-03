import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Submit ({ hash }: {
  hash: string
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Success!</AlertDialogTitle>
        <AlertDialogDescription>
          Your transaction is valid on network now.
        </AlertDialogDescription>
      </AlertDialogHeader>
      Hash: {hash}
      <AlertDialogFooter>
        <AlertDialogCancel>Close</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
