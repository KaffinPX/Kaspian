import { useState } from "react"
import { i18n } from "webextension-polyfill"
import { PlusIcon } from "lucide-react"
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
          <DialogTitle>{i18n.getMessage('addNode')}</DialogTitle>
          <DialogDescription>
            {i18n.getMessage('addNodeDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className={"text-center flex flex-col gap-1 mx-3"}>
          <Input value={name} type={"text"} placeholder={i18n.getMessage('name')} onChange={(e) => setName(e.target.value)} />
          <Input value={address} type={"text"} placeholder={i18n.getMessage('addNodeAddress')}  onChange={(e) => setAddress(e.target.value)} />
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
              {i18n.getMessage('add')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}