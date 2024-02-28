import Heading from "@/components/Heading"
import { BookLock, Settings as SettingsIcon, Laptop, Moon, RotateCcw, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import NodeDrawer from "@/pages/Wallet/Settings/Node"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetPortal
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"

export default function Settings () {
  const settings = useSettings()
  const kaspa = useKaspa()
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <SettingsIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>{i18n.getMessage('settings')}</SheetTitle>
        </SheetHeader>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="general">
            <AccordionTrigger>{i18n.getMessage('general')}</AccordionTrigger>
            <AccordionContent>
              <div className={"flex flex-col gap-2"}>
                <div className={"px-3"}>
                  <h3 className={"font-bold"}>{i18n.getMessage('theme')}</h3>
                  <h4>{i18n.getMessage('themeDescription')}</h4>
                </div>
                <div className={"flex gap-1"}>
                  {/* theme ++ price provider */}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="network">
            <AccordionTrigger>{i18n.getMessage('network')}</AccordionTrigger>
            <AccordionContent>
              <div className={"flex flex-col gap-2"}>
                <div className={"px-3"}>
                  <h3 className={"font-bold"}>{i18n.getMessage('node')}</h3>
                  <h4>{i18n.getMessage('nodeDescription')}</h4>
                </div>
                <div className={"flex gap-1 mx-1"}>
                  <Select defaultValue={settings.selectedNode.toString()} 
                    onValueChange={async (id) => {
                      await kaspa.request('node:connect', [ settings.nodes[parseInt(id)].address ])
                      await settings.changeNode(parseInt(id))
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settings.nodes.map((node, id) => {
                        return (
                          <SelectItem key={id} value={id.toString()}>
                            {node.name}
                            <p className={"text-xs"}>{node.address}</p>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <NodeDrawer />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <SheetFooter>
          <Button onClick={async () => {
            await kaspa.request('wallet:reset', [])
          }} variant={"destructive"}>
            Reset wallet
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
