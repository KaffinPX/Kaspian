import { useState } from "react"
import { i18n } from "webextension-polyfill"
import QRCode from "react-qr-code"
import { ReceiptIcon } from "lucide-react"
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
import useKaspa from "@/hooks/useKaspa"

export default function SendDrawer () {
  const { kaspa } = useKaspa()

  const [ amount, setAmount ] = useState("")

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={"gap-2"}>
          <ReceiptIcon />
          {i18n.getMessage('receive')}
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className={"h-[60%]"}>
        <div className="mx-auto">
          <SheetHeader>
            <SheetTitle>{i18n.getMessage('receive')}</SheetTitle>
            <SheetDescription>{i18n.getMessage('receiveDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col p-4 pb-0 items-center gap-5">
          <div className="h-max w-36 bg-white p-1">
            <QRCode
              style={{ height: "auto", width: "100%" }}
              value={`${kaspa.addresses[0][kaspa.addresses[0].length - 1]}?${amount ? `amount=${amount}` : ''}`}
            />
          </div>
          <Input
            type={"number"}
            placeholder={i18n.getMessage('amount')}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
