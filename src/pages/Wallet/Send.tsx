import { SendToBack } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import Sign from "./Send/Sign"
import Submit from "./Send/Submit"
import Success from "./Send/Success"
import useURLParams from "@/hooks/useURLParams"

export enum Tabs {
  Creation,
  Sign,
  Submit,
  Success
}

export default function SendDrawer () {
  const { kaspa, request } = useKaspa()
  const [ hash, params ] = useURLParams()

  const [ recipient, setRecipient ] = useState(params.get('recipient') ?? "")
  const [ amount, setAmount ] = useState(params.get('amount') ?? "")
  const [ transactions, setTransactions ] = useState<string[]>()
  const [ ids, setIds ] = useState<string[]>()
  const [ error, setError ] = useState("")
  const [ tab, setTab ] = useState(Tabs.Creation)
 
  return (
    <Sheet defaultOpen={hash === 'send'} onOpenChange={(open) => {
      if (hash !== 'send' || open) return

      window.close()
    }}>
      <SheetTrigger asChild>
        <Button className={"gap-2"}>
          <SendToBack />
          {i18n.getMessage('send')}
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className={"h-[60%]"}>
        <div className="mx-auto">
          <SheetHeader>
            <SheetTitle>{i18n.getMessage('sendTitle')}</SheetTitle>
            <SheetDescription>{i18n.getMessage('sendDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col p-4 pb-0 items-center gap-4">
            <div className={"text-center"}>
              <p className={"text-base font-bold"}>{kaspa.balance} KAS</p>
              <p className={"font-light text-xs"}>{i18n.getMessage('available')}</p>
            </div>
            <div className={"text-center flex flex-col gap-2.5"}>
              <Input
                type={"text"}
                placeholder={i18n.getMessage('address')}
                className={"w-60"}
                value={recipient}
                disabled={!!params.get('recipient')}
                onChange={(e) => { 
                  if (error) setError("")

                  setRecipient(e.target.value)
                }}
              />
              <Input
                type={"number"}
                placeholder={i18n.getMessage('amount')}
                value={amount}
                disabled={!!params.get('amount')}
                error={error}
                onChange={(e) => {
                  if (error) setError("")

                  setAmount(e.target.value)
                }}
              />
            </div>
            <Button className={"gap-2"} disabled={!!transactions} onClick={() => {
              request('account:createSend', [ recipient, amount ]).then((transactions) => {
                if (hash !== 'send') {
                  setRecipient("")
                  setAmount("")
                }

                setTransactions(transactions)
                setTab(Tabs.Sign)
              }).catch((err) => {
                setError(err)
              })
            }}>
              <SendToBack />
              {i18n.getMessage('send')}
            </Button>

            <Dialog open={!!transactions} onOpenChange={(open) => {
              if (open) return // TODO: not sure if this is the best logic
                
              setTab(Tabs.Creation)
              setTransactions(undefined)
            }}>
              {tab === Tabs.Sign && <Sign transactions={transactions!} onSigned={(transactions) => {
                setTransactions(transactions)
                setTab(Tabs.Submit)
              }} />}
              {tab === Tabs.Submit && <Submit transactions={transactions!} onSubmitted={(ids) => { 
                if (hash === 'send') return window.close()
                
                setIds(ids)
                setTab(Tabs.Success)
              }} />}
              {tab === Tabs.Success && <Success ids={ids!} />}
            </Dialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
