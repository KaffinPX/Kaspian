import { Network } from "lucide-react"
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import useKaspa from "@/hooks/useKaspa"

export default function Submit ({ onSubmitted }: {
  onSubmitted: () => void
}) {
  const kaspa = useKaspa()

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Submit Transaction</AlertDialogTitle>
        <AlertDialogDescription>
          Submit your signed transaction to network, miners will add it to a block.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button className={"gap-2"} onClick={({ currentTarget }) => {
          currentTarget.disabled = true

          kaspa.request('account:submitSigned', []).then(() => {
            onSubmitted()
          }).catch(() => {
            currentTarget.disabled = false
          })
        }}>
          <Network />
          Submit
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
