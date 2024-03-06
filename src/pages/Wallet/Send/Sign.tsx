import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useKaspa from "@/hooks/useKaspa"
import { useState } from "react"
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pen } from "lucide-react"
import { i18n } from "webextension-polyfill"
import type { Summary } from "@/wallet/kaspa/account"

export default function Sign ({ summary, onSigned }: {
  summary: Summary,
  onSigned: () => void
}) {
  const kaspa = useKaspa()
  
  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Review Transaction</AlertDialogTitle>
        <AlertDialogDescription>
          Review the details of the transaction before signing it.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="flex px-4 items-center justify-center gap-2 mt-2">
        <div className={"flex flex-col text-center gap-1"}>
          <h3 className={"text-lg"}>Fee</h3>
          <div className={"bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold"}>{summary.fee}</div>
        </div>
        <div className={"flex flex-col text-center gap-1"}>
          <h3 className={"text-lg"}>Total Amount</h3>
          <div className={"bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold"}>{summary.totalAmount}</div>
        </div>
      </div>
      <div className={"mx-auto w-full"}>
        <Input
          type={"password"}
          placeholder={i18n.getMessage('password')}
          className={"flex"}
          value={password}
          onChange={(e) => {
            if (error) setError("")
            setPassword(e.target.value)
          }}
        />
        <p className="text-red-600">{error}</p>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button className={"gap-2"} disabled={password === ""} onClick={() => {
          kaspa.request('account:signPendings', [ password ]).then(() => {
            onSigned()
          }).catch((err) => {
            setError(err)
          })
        }}>
          <Pen />
          Sign
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
