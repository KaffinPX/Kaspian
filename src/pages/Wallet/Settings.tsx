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
import NewNodeDrawer from "@/components/NewNodeDrawer"
import SendConfirmation from "@/components/SendConfirmation"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { i18n } from "webextension-polyfill"

export default function Settings () {
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
                 {/* FIXME make this automatically select the active one */}
                  <ToggleGroup type="single">
                    <ToggleGroupItem value="light">
                      <Sun />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark">
                      <Moon />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system">
                      <Laptop />
                    </ToggleGroupItem>
                  </ToggleGroup>
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
                <div className={"flex gap-1"}>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="node.kaspian.app" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">node.kaspian.app</SelectItem>
                    </SelectContent>
                  </Select>
                  <NewNodeDrawer />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  )
}
