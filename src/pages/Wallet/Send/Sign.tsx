import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useKaspa from "@/hooks/useKaspa"
import { useState } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pen } from "lucide-react"
import { i18n } from "webextension-polyfill"
import type { Summary } from "@/wallet/kaspa/account"

export default function Sign ({ transactions, onSigned }: {
  transactions: string[],
  onSigned: (transactions: string[]) => void
}) {
  const kaspa = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Review Transaction</DialogTitle>
        <DialogDescription>
          Review the details of the transaction before signing it.
        </DialogDescription>
      </DialogHeader>
      <div className="flex px-4 items-center justify-center gap-2 mt-2">
        <div className={"flex flex-col text-center gap-1"}>
          <h3 className={"text-lg"}>Fee</h3>
          <div className={"bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold"}>TODO</div>
        </div>
        <div className={"flex flex-col text-center gap-1"}>
          <h3 className={"text-lg"}>Amount</h3>
          <div className={"bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold"}>TODO</div>
        </div>
      </div>
      <div className={"mx-auto w-64"}>
        <Input
          type={"password"}
          placeholder={i18n.getMessage('password')}
          className={"flex"}
          value={password}
          error={error}
          onChange={(e) => {
            if (error) setError("")
            setPassword(e.target.value)
          }}
        />
      </div>
      <DialogFooter>
        <Button className={"gap-2"} disabled={password === ""} onClick={() => {
          setPassword("")

          kaspa.request('account:sign', [ transactions, password ]).then((transactions) => {
            onSigned(transactions)
          }).catch((err) => {
            setError(err)
          })
        }}>
          <Pen />
          Sign
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

const calculateFee = (transaction: string) => {
  // TODO
}