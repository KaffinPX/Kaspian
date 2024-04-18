import { Network } from "lucide-react"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useKaspa from "@/hooks/useKaspa"

export default function Submit ({ transactions, onSubmitted }: {
  transactions: string[]
  onSubmitted: (ids: string[]) => void
}) {
  const kaspa = useKaspa()

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Submit Transaction</DialogTitle>
        <DialogDescription>
          Submit your signed transaction to network, miners will add it to a block.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button className={"gap-2"} onClick={({ currentTarget }) => {
          currentTarget.disabled = true

          kaspa.request('node:submit', [ transactions ]).then((ids) => {
            onSubmitted(ids)
          }).catch(() => {
            currentTarget.disabled = false
          })
        }}>
          <Network />
          Submit
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
