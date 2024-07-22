import { useCallback, useState } from "react"
import { i18n } from "webextension-polyfill"
import { SendToBack, PlusIcon, MinusIcon } from "lucide-react"
import Sign from "./Send/Sign"
import Submit from "./Send/Submit"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
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

export enum Tabs {
  Creation,
  Sign,
  Submit,
}

export default function SendDrawer () {
  const { kaspa, request } = useKaspa()
  const [ hash, params ] = useURLParams()
  const [ outputs, setOutputs ] = useState<[ string, string ][]>([[ "", "" ]])
  const [ transactions, setTransactions ] = useState<string[]>()
  const [ error, setError ] = useState("")
  const [ tab, setTab ] = useState(Tabs.Creation)
 
  const initiateSend = useCallback(() => {
    request('account:create', [ outputs, '0' ]).then((transactions) => {
      setTransactions(transactions)
      setTab(Tabs.Sign)
    }).catch((err) => {
      setError(err)
    })
  }, [ outputs ])

  return (
    <Sheet defaultOpen={hash === 'send'} onOpenChange={(open) => {
      if (open) return

      setOutputs([[ "", "" ]])

      if (hash === 'send') {
        window.close
      }
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
          <div className="flex flex-col p-4 pb-0 items-center gap-3">
            <div className={"text-center"}>
              <p className={"text-base font-bold"}>{kaspa.balance} KAS</p>
              <p className={"font-light text-xs"}>{i18n.getMessage('available')}</p>
            </div>
            <div className="flex flex-row items-center">
              <div className="flex flex-col">
                <Carousel>
                  <CarouselContent className="w-60">
                    {outputs.map((output, id) => {
                      return (
                        <CarouselItem key={id} className={"flex flex-col gap-2.5 my-2"}>
                          <Input
                            type={"text"}
                            placeholder={i18n.getMessage('address')}
                            value={output[0]}
                            disabled={!!params.get('recipient')}
                            onChange={(e) => { 
                              if (error) setError("")

                              setOutputs((prevOutputs) => {
                                prevOutputs[id][0] = e.target.value
                                return [ ...prevOutputs ]
                              })
                            }}
                            onKeyUp={e => {
                              if (e.key !== 'Enter' || output[0] === "") return;
                              initiateSend();
                            }}
                          />
                          <Input
                            type={"number"}
                            placeholder={i18n.getMessage('amount')}
                            value={output[1]}
                            disabled={!!params.get('amount')}
                            error={error}
                            onChange={(e) => {
                              if (error) setError("")

                              setOutputs((prevOutputs) => {
                                prevOutputs[id][1] = e.target.value
                                return [ ...prevOutputs ]
                              })
                            }}
                            onKeyUp={e => {
                              if (e.key !== 'Enter' || output[1] === "") return
                              initiateSend()
                            }}
                          />
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                </Carousel>
              </div>
              <div className={"flex flex-col"}>
                <Button className={"ml-0.5"} size={'icon'} variant={"ghost"} onClick={() => {
                  setOutputs((prevOutputs) => {
                    prevOutputs.push([ "", "" ])
                    return [ ...prevOutputs ]
                  })
                }}>
                  <PlusIcon />
                </Button>
                <Button 
                  className={"ml-0.5"}
                  size={'icon'}
                  variant={"ghost"}
                  disabled={outputs.length === 1}
                  onClick={() => {
                    setOutputs((prevOutputs) => {
                      prevOutputs.splice(prevOutputs.length - 1, 1)
                      return [ ...prevOutputs ]
                    })
                  }
                }>
                  <MinusIcon />
                </Button>
              </div>
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
