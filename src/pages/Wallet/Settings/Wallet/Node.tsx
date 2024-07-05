import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"
import { Plus } from "lucide-react"
import { useState } from "react"
import { i18n } from "webextension-polyfill"

export default function Export () {
  const [ name, setName ] = useState("")
  const [ address, setAddress ] = useState("")

  const { settings, updateSetting } = useSettings()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Node</DialogTitle>
          <DialogDescription>
            Be careful, third party nodes may log your activities.
          </DialogDescription>
        </DialogHeader>
        <div className={"text-center flex flex-col gap-1 mx-3"}>
          <Input value={name} type={"text"} placeholder={"Name"}  onChange={(e) => setName(e.target.value)} />
          <Input value={address} type={"text"} placeholder={"Address (ws:// or wss://)"}  onChange={(e) => setAddress(e.target.value)} />
        </div>
        <DialogFooter>
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
            <Plus />
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}