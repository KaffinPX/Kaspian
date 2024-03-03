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
          Your transaction(s) are on the block(s) of network now.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Close</AlertDialogCancel>
        <Button variant="link" className={"text-white font-bold"} onClick={() => {
            window.open(`https://explorer.kaspa.org/txs/${hash}`)
        }}>View it on the explorer</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
