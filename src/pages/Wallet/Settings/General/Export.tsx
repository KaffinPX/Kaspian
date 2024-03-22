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
import { useState } from "react"
import { i18n } from "webextension-polyfill"

export default function Export () {
  const kaspa = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")
  const [ mnemonic, setMnemonic ] = useState("")

  return (
    <Dialog onOpenChange={() => {
      setMnemonic("")
    }}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Export wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Mnemonic</DialogTitle>
          <DialogDescription>
            Remember its your responsibility to keep your mnemonic safe.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={mnemonic}
          className={"w-full h-40 font-mono resize-none"}
          disabled={true}
        />
        <DialogFooter>
          <div className="mx-auto">
            <p className="text-red-500">{error}</p>
          </div>
           <div className={"flex mx-auto gap-1"}>
            <Input
              type={"password"}
              placeholder={i18n.getMessage('password')}
              value={password}
              onChange={e => {
                if (error) setError("")

                setPassword(e.target.value)
              }}
            />
            <Button type="submit" onClick={async () => {
              setPassword("")

              kaspa.request('wallet:export', [ password ]).then((mnemonic) => {
                setMnemonic(mnemonic)
              }).catch((err: string) => {
                setError(err)
              })
            }}>Export</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}