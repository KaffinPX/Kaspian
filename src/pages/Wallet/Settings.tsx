import { runtime, i18n } from "webextension-polyfill"
import { SettingsIcon } from "lucide-react"
import GeneralTab from "@/pages/Wallet/Settings/General"
import WalletTab from "@/pages/Wallet/Settings/Wallet"
import AccountTab from "@/pages/Wallet/Settings/Account"
import ResetPopup from "@/pages/Wallet/Settings/General/Reset"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"

export default function Settings () {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <SettingsIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"} className="flex flex-col w-[80%]">
        <SheetHeader>
          <SheetTitle>{i18n.getMessage('settings')}</SheetTitle>
        </SheetHeader>
        <Accordion type="single" defaultValue={"general"} className="w-full">
          <GeneralTab />
          <WalletTab />
          <AccountTab />
        </Accordion>
        <SheetFooter className="gap-2">
          Kaspian {runtime.getManifest().version}
          <ResetPopup />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
