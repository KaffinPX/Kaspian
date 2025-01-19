import useKaspa from "@/hooks/useKaspa"
import { useCallback, useState } from "react"
import { Output } from "./Outputs"
import { Input } from "@/provider/protocol"
import useURLParams from "@/hooks/useURLParams"
import { SendIcon } from "lucide-react"

export default function Creation ({ inputs, outputs, setTransactions }: {
  inputs: Input[],
  outputs: Output[]
  setTransactions: React.Dispatch<React.SetStateAction<string[] | undefined>>
}) {
  const { request } = useKaspa()
  const [, params ] = useURLParams()

  const [ feeRate, setFeeRate ] = useState(1)
  const [ priorityFee ] = useState(params.get('fee') ?? "0")

  const handleFeeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const bucket = event.target.getAttribute('aria-label')!

    request('node:priorityBuckets', []).then((buckets) => {
      // @ts-ignore
      setFeeRate(buckets[bucket.toLowerCase()].feeRate)
    })
  }, [])

  return (
    <>
      <div className="flex flex-row items-center gap-1 p-1">
        <p className="font-semibold">Priority {feeRate !== 1 ? `(${feeRate})` : ""}</p>
        <form className="filter">
          <input className="btn btn-xs btn-square" type="reset" value="×" onChange={handleFeeChange} />
          <input className="btn btn-xs btn-error" type="radio" name="fee" aria-label="Slow" onChange={handleFeeChange} />
          <input className="btn btn-xs btn-warning" type="radio" name="fee" aria-label="Standard" onChange={handleFeeChange} />
          <input className="btn btn-xs btn-success" type="radio" name="fee" aria-label="Fast" onChange={handleFeeChange} />
        </form>
      </div>
      <button className="btn btn-outline" onClick={() => {
        request('account:create', [ outputs, feeRate, priorityFee, inputs ]).then((transactions) => {
          setTransactions(transactions)
        })
      }}>
        <SendIcon />
        Send
      </button>
    </>
  )
}