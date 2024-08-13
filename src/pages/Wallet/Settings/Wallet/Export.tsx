import { useState } from "react"
import { i18n } from "webextension-polyfill"
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

export default function Export () {
  const { request } = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")
  const [ mnemonic, setMnemonic ] = useState("")

  return (
    <Dialog onOpenChange={() => {
      setMnemonic("")
      setPassword("")
    }}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>{i18n.getMessage('exportButton')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.getMessage('exportTitle')}</DialogTitle>
          <DialogDescription>
          {i18n.getMessage('exportDescription')}
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={mnemonic}
          className={"w-full h-40 font-mono resize-none rounded"}
          disabled={true}
        />
        <DialogFooter>
           <div className={"flex mx-auto gap-1"}>
            <Input
              type={"password"}
              placeholder={i18n.getMessage('password')}
              value={password}
              error={error}
              onChange={e => {
                if (error) setError("")

                setPassword(e.target.value)
              }}
            />
            <Button type="submit" onClick={async () => {
              setPassword("")

              request('wallet:export', [ password ]).then((mnemonic) => {
                setMnemonic(mnemonic)
              }).catch((err: string) => {
                setError(err)
              })
            }}>{i18n.getMessage('export')}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}