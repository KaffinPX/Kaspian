import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useSettings from "@/hooks/useSettings"
import { PlusIcon } from "lucide-react"
import { useState } from "react"

export default function Export () {
  const [ name, setName ] = useState("")
  const [ address, setAddress ] = useState("")

  const { settings, updateSetting } = useSettings()

  return (
    <Dialog onOpenChange={() => {
      setName("")
      setAddress("")
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Node</DialogTitle>
          <DialogDescription>
            Be careful, 3. party nodes may log your activities.
          </DialogDescription>
        </DialogHeader>
        <div className={"text-center flex flex-col gap-1 mx-3"}>
          <Input value={name} type={"text"} placeholder={"Name"}  onChange={(e) => setName(e.target.value)} />
          <Input value={address} type={"text"} placeholder={"Address (ws:// or wss://)"}  onChange={(e) => setAddress(e.target.value)} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className={"flex gap-2"}
              disabled={name === "" || address === ""}
              onClick={async () => {
                await updateSetting('nodes', [
                  ...settings.nodes,
                  {
                    name,
                    address,
                    locked: false
                  }
                ])
              }}
            >
              <PlusIcon />
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}