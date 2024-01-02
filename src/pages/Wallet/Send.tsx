import { Send } from "lucide-react"
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
import ConfirmationSheet from "./Confirmation"

export default function SendDrawer () {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={"gap-2"}>
          <Send />
          Send KAS
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className={"h-[60%]"}>
        <div className="mx-auto">
          <SheetHeader>
            <SheetTitle>Send Kaspa</SheetTitle>
            <SheetDescription>
              Enter the amount and the address to send Kaspa
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col p-4 pb-0 items-center gap-5">
            <div className={"text-center"}>
              <p className={"text-lg font-extrabold mb-1"}>Available</p>
              <p className={"text-base font-bold"}>
                100,000 <span className={"text-primary"}>KAS</span>
              </p>
            </div>
            <div className={"text-center flex flex-col gap-3"}>
              {/* FIXME add max amount */}
              <Input type={"text"} placeholder={"Address"} className={"w-60"} />
              <Input type={"number"} placeholder={"Amount"} />
            </div>

            <ConfirmationSheet></ConfirmationSheet>
            <Button className={"flex gap-2"}>
              <Send />
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
