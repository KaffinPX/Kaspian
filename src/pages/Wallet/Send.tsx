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
import ConfirmationSheet from "./Confirmation"
import { i18n } from "webextension-polyfill"

export default function SendDrawer () {
  return (
    <Sheet>
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
          <div className="flex flex-col p-4 pb-0 items-center gap-5">
            <div className={"text-center"}>
              <p className={"text-lg font-extrabold mb-1"}>{i18n.getMessage('sendAvailable')}</p>
              <p className={"text-base font-bold"}>
                100,000 <span className={"text-primary"}>KAS</span>
              </p>
            </div>
            <div className={"text-center flex flex-col gap-3"}>
              {/* FIXME add max amount */}
              <Input type={"text"} placeholder={i18n.getMessage('address')} className={"w-60"} />
              <Input type={"number"} placeholder={i18n.getMessage('amount')} />
            </div>

            <ConfirmationSheet></ConfirmationSheet>
            <Button className={"flex gap-2"}>
              <SendToBack />
              {i18n.getMessage('send')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
