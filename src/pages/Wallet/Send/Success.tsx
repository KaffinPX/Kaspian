import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Submit ({ hash }: {
  hash: string
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Success!</DialogTitle>
        <DialogDescription>
          Your transaction(s) are on the block(s) of network now.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="link" className={"text-white font-bold"} onClick={() => {
            window.open(`https://explorer.kaspa.org/txs/${hash}`)
        }}>View it on the explorer</Button>
      </DialogFooter>
    </DialogContent>
  )
}
