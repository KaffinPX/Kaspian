import { useState } from "react"
import { i18n } from "webextension-polyfill"
import { NetworkIcon, PackageCheckIcon, CopyIcon } from "lucide-react"
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
  onSubmitted: () => void
}) {
  const { request } = useKaspa()
  const [ ids, setIds ] = useState<string[]>([])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {i18n.getMessage('submitTitle')}
          <Button variant="link" size="icon" className="h-min w-8" onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(transactions))
          }}>
            <CopyIcon size={16}/>
          </Button>
        </DialogTitle>
        <DialogDescription>
          {i18n.getMessage('submitDescription')}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="link" className={"dark:text-white font-bold"} disabled={ids.length === 0} onClick={() => {
          window.open(`https://explorer.kaspa.org/txs/${ids[0]}`)
        }}>{i18n.getMessage('viewOnExplorer')}</Button>

        <Button className={"gap-2"} autoFocus onClick={({ currentTarget }) => {
          currentTarget.disabled = true

          request('account:submitContextful', [ transactions ]).then((ids) => {
            setIds(ids)
            onSubmitted()
          }).catch((err) => {
            currentTarget.disabled = false
          })
        }}>
          { ids.length === 0 ? <NetworkIcon /> : <PackageCheckIcon /> }
          {i18n.getMessage('submit')}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
