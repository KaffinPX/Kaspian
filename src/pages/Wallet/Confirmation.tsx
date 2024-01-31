import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Send, X } from "lucide-react"
import { i18n } from "webextension-polyfill"

export default function Confirmation () {
  return (
    <Sheet>
      {/* FIXME */}
      <SheetTrigger asChild>
        <Button variant={"outline"}>{i18n.getMessage('send')}</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>{i18n.getMessage('confirmationTitle')}</SheetTitle>
          <SheetDescription>{i18n.getMessage('confirmationDescription')}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col px-4 items-center gap-2 mt-2">
          <div className={"text-center gap-1 flex flex-col"}>
            <h3 className={"text-lg"}>{i18n.getMessage('address')}</h3>
            <div className={"bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold"}>
              kaspa:123
            </div>
          </div>
          <div className={"text-center gap-1 flex flex-col"}>
            <h3 className={"text-lg"}>{i18n.getMessage('amount')}</h3>
            <div className={"bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold"}>
              10 KAS
            </div>
          </div>
        </div>
        <SheetFooter className={"mt-3"}>
          <div className={"flex flex-row gap-2"}>
            <Button
              variant={"outline"}
              className={"flex-1 gap-2"}
              onClick={() => {
                close() // FIXME
              }}
            >
              <X />
              {i18n.getMessage('cancel')}
            </Button>
            <Button
              className={"flex-1 gap-2 "}
              onClick={() => {
                close() // FIXME
              }}
            >
              <Send />
              {i18n.getMessage('send')}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
