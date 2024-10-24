import { useCallback, useState } from "react"
import { i18n } from "webextension-polyfill"
import { SendToBack, PlusIcon, MinusIcon, TargetIcon } from "lucide-react"
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
import { Input as KaspaInput } from "@/provider/protocol"

export enum Tabs {
  Creation,
  Sign,
  Submit,
}

export default function SendDrawer () {
  const { kaspa, request } = useKaspa()
  const [ hash, params ] = useURLParams()

  const [ inputs ] = useState<KaspaInput[]>(JSON.parse(params.get('inputs')!) || [])
  const [ outputs, setOutputs ] = useState<[ string, string ][]>(JSON.parse(params.get('outputs')!) || [["", ""]])
  const [ feeRate, setFeerate ] = useState(1)
  const [ fee ] = useState(params.get('fee') ?? "0")
  const [ transactions, setTransactions ] = useState<string[]>()
  const [ error, setError ] = useState("")
  const [ tab, setTab ] = useState(Tabs.Creation)
 
  const initiateSend = useCallback(() => {
    request('account:create', [ outputs, feeRate, fee, inputs ]).then((transactions) => {
      setTransactions(transactions)
      setTab(Tabs.Sign)
    }).catch((err) => {
      console.log(err)
      setError(err)
    })
  }, [ outputs ])

  return (
    <Sheet defaultOpen={hash === 'transact'} onOpenChange={(open) => {
      if (open) return

      setOutputs([[ "", "" ]])

      if (hash === 'transact') {
        window.close()
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
                <Carousel opts={{
                  startIndex: outputs.length - 1
                }}>
                  <CarouselContent className="w-60 mx-2">
                    {outputs.map((output, id) => {
                      return (
                        <CarouselItem key={id} className={"flex flex-col gap-2.5 my-2"}>
                          <Input
                            type={"text"}
                            placeholder={i18n.getMessage('address')}
                            value={output[0]}
                            disabled={!!params.get('outputs')}
                            onChange={(e) => { 
                              if (error) setError("")

                              setOutputs((prevOutputs) => {
                                prevOutputs[id][0] = e.target.value
                                return [ ...prevOutputs ]
                              })
                            }}
                            onKeyUp={e => {
                              if (e.key !== 'Enter' || output[0] === "") return
                              initiateSend()
                            }}
                          />
                          <Input
                            type={"number"}
                            placeholder={i18n.getMessage('amount')}
                            value={output[1]}
                            min={0}
                            disabled={!!params.get('outputs')}
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
                <Button className={"ml-0.5"} size={'icon'} variant={"ghost"} disabled={!!params.get('outputs')} onClick={() => {
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
                  disabled={outputs.length === 1 || !!params.get('outputs')}
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
            <div className="flex items-center gap-1 h-6 -mt-3">
              <TargetIcon size={18} />
              <p className="font-semibold text-sm">
                Priority
              </p>
              <Button className="h-full w-20 text-sm" variant="outline" onClick={({ currentTarget }) => {
                if (currentTarget.innerText === 'default') {
                  request('node:priorityBuckets', []).then((buckets) => {
                    setFeerate(buckets.slow.feeRate)
                    currentTarget.innerText = 'slow'
                  })
                } else if (currentTarget.innerText === 'slow') {
                  request('node:priorityBuckets', []).then((buckets) => {
                    setFeerate(buckets.standard.feeRate)
                    currentTarget.innerText = 'standard'
                  })
                } else if (currentTarget.innerText === 'standard') {
                  request('node:priorityBuckets', []).then((buckets) => {
                    setFeerate(buckets.slow.feeRate)
                    currentTarget.innerText = 'fast'
                  })
                } else if (currentTarget.innerText === 'fast') {
                  setFeerate(1)
                  currentTarget.innerText = 'default'
                }
              }}>
                default
              </Button>
            </div>
            <Button className={"gap-2"} disabled={!!transactions} onClick={initiateSend} autoFocus>
              <SendToBack />
              {i18n.getMessage('send')}
            </Button>
            <Dialog open={!!transactions} onOpenChange={(open) => {
              if (open) return
                
              setTab(Tabs.Creation)
              setTransactions(undefined)
            }}>
              {tab === Tabs.Sign && <Sign transactions={transactions!} inputs={inputs} onSigned={(transactions) => {
                setTransactions(transactions)
                setTab(Tabs.Submit)
              }} />}
              {tab === Tabs.Submit && <Submit transactions={transactions!} onSubmitted={() => { 
                if (hash === 'transact') window.close()

                setOutputs([[ "", "" ]])
              }} />}
            </Dialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
