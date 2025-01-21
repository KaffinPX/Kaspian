import { useMemo, useState } from "react"
import { PenIcon } from "lucide-react"
import type { ITransactionInput, ITransactionOutput } from "wasm"
import { Input } from "@/provider/protocol"
import useKaspa from "@/hooks/useKaspa"

export default function Finalization ({ inputs, transactions, closeAfter }: {
  inputs: Input[]
  transactions: string[]
  closeAfter: boolean
}) {
  const { request } = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ id, setId ] = useState<string>()
  const [ error, setError ] = useState(false)

  const fee = useMemo(() => {
    const transaction = JSON.parse(transactions[transactions.length - 1])
    
    const inputValue = transaction.inputs.reduce((acc: bigint, input: ITransactionInput) => {
      return acc + BigInt(input.utxo!.amount)
    }, 0n)

    const outputValue = transaction.outputs.reduce((acc: bigint, output: ITransactionOutput) => {
      return acc + BigInt(output.value)
    }, 0n)
    
    return Number(inputValue - outputValue) / 1e8
  }, [ transactions ])

  return (
    <>
      <h5 className="badge text-xs font-bold">Fee: {fee}~ KAS</h5>
      {id && (
        <button className="btn btn-dash" onClick={() => {
          window.open(`https://explorer.kaspa.org/txs/${id}`)
        }}>
          View it on explorer
        </button>
      )}
      {!id && (
        <div className="flex flex-row gap-1">
          <input
            className={`input ${error ? "input-error" : ""}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={({ target }) => {
              if (error) setError(false)
              setPassword(target.value)
            }}
          />
          <button className="btn btn-outline" onClick={async () => {
            request('account:sign', [ transactions, password, inputs ]).then(signedTransactions => {
              request('account:submitContextful', [ signedTransactions ]).then((ids) => {
                if (closeAfter) window.close()
                setId(ids[ids.length - 1])
              })
            }).catch(() => {
              setError(true)
            }).finally(() => {
              setPassword("")
            })
          }}>
            <PenIcon />
          </button>
        </div>
      )}
    </>
  )
}