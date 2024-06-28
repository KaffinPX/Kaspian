import { NetworkIcon, PackageCheckIcon } from "lucide-react"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useKaspa from "@/hooks/useKaspa"
import { useState } from "react"

export default function Submit ({ transactions, onSubmitted }: {
  transactions: string[]
  onSubmitted: () => void
}) {
  const kaspa = useKaspa()
  const [ ids, setIds ] = useState<string[]>([])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Submit Transaction</DialogTitle>
        <DialogDescription>
          Submit your signed transaction(s) to network, miners should add it to a block.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="link" className={"dark:text-white font-bold"} disabled={ids.length === 0} onClick={() => {
          window.open(`https://explorer.kaspa.org/txs/${ids[0]}`)
        }}>View it on the explorer</Button>

        <Button className={"gap-2"} onClick={({ currentTarget }) => {
          currentTarget.disabled = true

          kaspa.request('node:submit', [ transactions ]).then((ids) => {
            setIds(ids)
            onSubmitted()
          }).catch(() => {
            currentTarget.disabled = false
          })
        }}>
          { ids.length === 0 ? <NetworkIcon /> : <PackageCheckIcon /> }
          Submit
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
