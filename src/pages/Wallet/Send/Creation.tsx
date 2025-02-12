import { useCallback, useState } from "react"
import { RabbitIcon, SendIcon } from "lucide-react"
import { Output } from "./Outputs"
import { Input } from "@/provider/protocol"
import useKaspa from "@/hooks/useKaspa"
import useURLParams from "@/hooks/useURLParams"

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
      <div className="flex flex-row items-center gap-1">
        <div className="flex flex-col items-center">
          <RabbitIcon size={12}/>
          <p className="font-semibold">Priority {feeRate !== 1 ? `(${feeRate.toFixed(1)})` : ""}</p>
        </div>
        <form className="filter">
          <input className="btn btn-xs btn-square" type="reset" value="×" onClick={() => setFeeRate(1)} />
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