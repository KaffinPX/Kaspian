import { SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import GeneralTab from "@/pages/Wallet/Settings/General"
import WalletTab from "@/pages/Wallet/Settings/Wallet"
import ExportPopup from "@/pages/Wallet/Settings/General/Export"
import ResetPopup from "@/pages/Wallet/Settings/General/Reset"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import { Accordion } from "@/components/ui/accordion"
import { i18n, runtime } from "webextension-polyfill"

export default function Settings () {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <SettingsIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"} className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{i18n.getMessage('settings')}</SheetTitle>
        </SheetHeader>
        <Accordion type="single" collapsible className="w-full">
          <GeneralTab />
          <WalletTab />
        </Accordion>
        <SheetFooter className="gap-2">
          Kaspian {runtime.getManifest().version}
          <ResetPopup />
          <ExportPopup />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
