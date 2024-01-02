import * as React from "react"
import { Plus, Send } from "lucide-react"

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
export default function NewNodeDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className={"h-[36%]"}>
        <div className="mx-auto">
          <SheetHeader>
            <SheetTitle>Add a new node</SheetTitle>
            <SheetDescription>
              Enter the address of the node you wish to add
            </SheetDescription>
          </SheetHeader>
        </div>
        <div className="flex flex-col p-4 pb-0 items-center gap-5">
          <div className={"text-center flex flex-col gap-3"}>
            <Input type={"text"} placeholder={"Address"} className={"w-60"} />
          </div>
          <Button className={"flex gap-2"}>
            <Plus />
            Add
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
