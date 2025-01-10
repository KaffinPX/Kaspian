import useKaspa from "@/hooks/useKaspa"
import { PenIcon } from "lucide-react"
import { useState } from "react"

export default function Finalize ({ transactions }: {
  transactions: string[]
}) {
  const { request } = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ id, setId ] = useState<string>()
  const [ error, setError ] = useState(false)

  return (
    <>
      {id && (
        <button className="btn btn-dash" onClick={() => {
          window.open(`https://explorer.kaspa.org/txs/${id}`)
        }}>
          Show it on explorer
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
            request('account:sign', [ transactions, password ]).then(signedTransactions => {
              request('account:submitContextful', [ signedTransactions ]).then((ids) => {
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