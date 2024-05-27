import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import NodeDrawer from "@/pages/Wallet/Settings/Wallet/Node"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"

export default function Network () {
  const { kaspa, request } = useKaspa()

  return (
    <AccordionItem value="account">
      <AccordionTrigger>Account</AccordionTrigger>
      <AccordionContent>
        <div className={"flex flex-col gap-2"}>
          <div className={"px-3"}>
            <h3 className={"flex gap-2 font-bold"}>
              Address Index
            </h3>
            <h4>It counts how many addresses you've created.</h4>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center px-4 py-2 bg-card rounded-md">
              <span className="font-medium">Receive addresses</span>
              <p className="tabular-nums font-mono">{kaspa.addresses[0].length}</p>
            </div>
            <div className="flex justify-between items-center px-4 py-2 bg-card rounded-md">
              <span className="font-medium">Change addresses</span>
              <p className="tabular-nums font-mono">{kaspa.addresses[1].length}</p>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}