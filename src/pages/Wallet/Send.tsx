import { useCallback, useState } from "react"
import { i18n } from "webextension-polyfill"
import { SendToBack, PlusIcon } from "lucide-react"
import Sign from "./Send/Sign"
import Submit from "./Send/Submit"
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
import { Dialog } from "@/components/ui/dialog"
import useURLParams from "@/hooks/useURLParams"
import useKaspa from "@/hooks/useKaspa"
import { type CarouselApi, Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export enum Tabs {
  Creation,
  Sign,
  Submit,
}

export default function SendDrawer () {
  const { kaspa, request } = useKaspa()
  const [ hash, params ] = useURLParams()

  const [ recipient, setRecipient ] = useState(params.get('recipient') ?? "")
  const [ amount, setAmount ] = useState(params.get('amount') ?? "")
  const [ transactions, setTransactions ] = useState<string[]>()
  const [ error, setError ] = useState("")
  const [ tab, setTab ] = useState(Tabs.Creation)
 
  const initiateSend = useCallback(() => {
    request('account:createSend', [ recipient, amount, '0' ]).then((transactions) => {
      if (hash !== 'send') {
        setRecipient("")
        setAmount("")
      }

      setTransactions(transactions)
      setTab(Tabs.Sign)
    }).catch((err) => {
      setError(err)
    })
  }, [ recipient, amount ])

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
            <div className="flex flex-row items-center">
              <Carousel>
                <CarouselContent>
                  <CarouselItem>
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
                        onKeyUp={e => {
                          if (e.key !== 'Enter' || amount === "") return
                          initiateSend()
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
                        onKeyUp={e => {
                          if (e.key !== 'Enter' || amount === "") return
                          initiateSend()
                        }}
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
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
                        onKeyUp={e => {
                          if (e.key !== 'Enter' || amount === "") return
                          initiateSend()
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
                        onKeyUp={e => {
                          if (e.key !== 'Enter' || amount === "") return
                          initiateSend()
                        }}
                      />
                    </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
              <Button className={"ml-0.5"} size={'icon'} variant={"ghost"}>
                <PlusIcon />
              </Button>
            </div>

            <Button className={"gap-2"} disabled={!!transactions} onClick={initiateSend}>
              <SendToBack />
              {i18n.getMessage('send')}
            </Button>

            <Dialog open={!!transactions} onOpenChange={(open) => {
              if (open) return
                
              setTab(Tabs.Creation)
              setTransactions(undefined)
            }}>
              {tab === Tabs.Sign && <Sign transactions={transactions!} onSigned={(transactions) => {
                setTransactions(transactions)
                setTab(Tabs.Submit)
              }} />}
              {tab === Tabs.Submit && <Submit transactions={transactions!} onSubmitted={() => { 
                if (hash === 'send') window.close()
              }} />}
            </Dialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
