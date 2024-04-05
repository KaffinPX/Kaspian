import { Receipt } from "lucide-react"
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
import QRCode from "react-qr-code"
import useKaspa from "@/hooks/useKaspa"
import { useState } from "react"

export default function SendDrawer () {
  const { kaspa } = useKaspa()
  const [ amount, setAmount ] = useState("")

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={"gap-2"}>
          <Receipt />
          Receive
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className={"h-[60%]"}>
        <div className="mx-auto">
          <SheetHeader>
            <SheetTitle>Receive</SheetTitle>
            <SheetDescription>Scan the QR code to receive payment details</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col p-4 pb-0 items-center gap-5">
          <div className="h-max w-36 bg-white p-1">
            <QRCode
              style={{ height: "auto", width: "100%" }}
              value={`${kaspa.address}?${amount ? `amount=${amount}` : ''}`}
            />
          </div>
          <Input
            type={"number"}
            placeholder={"Amount"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
