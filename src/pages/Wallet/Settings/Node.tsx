import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import useSettings from "@/hooks/useSettings"
import { useState } from "react"

export default function NewNodeDrawer() {
  const [ name, setName ] = useState<string>("")
  const [ address, setAddress ] = useState<string>("")

  const settings = useSettings()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Plus />
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className={"h-[50%]"}>
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
            <Input value={name} type={"text"} placeholder={"Name"} className={"w-60"} onChange={(e) => setName(e.target.value)} />
            <Input value={address} type={"text"} placeholder={"Address"} className={"w-60"} onChange={(e) => setAddress(e.target.value)} />
          </div>
            <SheetClose asChild>
              <Button
                className={"flex gap-2"}
                disabled={name === "" || address === ""}
                onClick={async () => {
                  await settings.addNode(name, address)
                }}
              >
                <Plus />
                Add
              </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
