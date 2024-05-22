import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import useKaspa from "@/hooks/useKaspa"
import { useMemo, useState } from "react"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Pen } from "lucide-react"
import { i18n } from "webextension-polyfill"

export default function Sign ({ transactions, onSigned }: {
  transactions: string[],
  onSigned: (transactions: string[]) => void
}) {
  const kaspa = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")

  const fee = useMemo(() => {
    const transaction = JSON.parse(transactions[0])
    
    const inputValue = transaction.inputs.reduce((acc: bigint, input: any) => {
      return acc + BigInt(input.utxo.amount)
    }, 0n)

    const outputValue = transaction.outputs.reduce((acc: bigint, output: any) => {
      return acc + BigInt(output.value)
    }, 0n)
    
    return Number(inputValue - outputValue) / 1e8
  }, [ transactions ])

  const amount = useMemo(() => {
    const transaction = JSON.parse(transactions[0])
    
    const sentValue = transaction.outputs.reduce((acc: bigint, output: any) => {
      return acc + BigInt(output.value)
    }, 0n)
    
    return Number(sentValue - BigInt(transaction.outputs[transaction.outputs.length - 1].value)) / 1e8
  }, [ transactions ])

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
          <h3 className={"text-lg"}>Amount</h3>
          <div className={"bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold"}>{amount} KAS</div>
        </div>
        <div className={"flex flex-col text-center gap-1"}>
          <h3 className={"text-lg"}>Fee</h3>
          <div className={"bg-gray-200 dark:bg-gray-800 rounded-md p-2 font-mono font-bold"}>{fee} KAS</div>
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
