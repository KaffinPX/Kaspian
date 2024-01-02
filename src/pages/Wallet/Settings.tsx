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
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>
              <div className={"flex flex-col gap-2"}>
                <div className={"px-3"}>
                  <h3 className={"font-bold"}>Language</h3>
                </div>
                <div className={"flex gap-1"}>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="English" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className={"px-3"}>
                  <h3 className={"font-bold"}>Theme</h3>
                  <h4>Select the theme of wallet.</h4>

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
            <AccordionTrigger>Network</AccordionTrigger>
            <AccordionContent>
              <div className={"flex flex-col gap-2"}>
                <div className={"px-3"}>
                  <h3 className={"font-bold"}>Node Selection</h3>
                  <h4>Select the node you will use to interact with network.</h4>
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
