import useKaspa from "@/hooks/useKaspa"
import { useCallback } from "react"

export default function Priority ({ feeRate, setFeeRate, readOnly }: {
  feeRate: number,
  setFeeRate: React.Dispatch<React.SetStateAction<number>>,
  readOnly: boolean
}) {
  const { request } = useKaspa()

  const handleFeeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const bucket = event.target.getAttribute('aria-label')!

    request('node:priorityBuckets', []).then((buckets) => {
      // @ts-ignore
      setFeeRate(buckets[bucket.toLowerCase()].feeRate)
    })
  }, [])

  return (
    <div className="flex flex-row items-center gap-1 p-1">
      <p className="font-semibold">Priority {feeRate !== 1 ? `(${feeRate})` : ""}</p>
      <form className="filter">
        <input className="btn btn-xs btn-square" type="reset" value="×" disabled={readOnly} onChange={handleFeeChange} />
        <input className="btn btn-xs btn-error" type="radio" name="fee" aria-label="Slow" disabled={readOnly} onChange={handleFeeChange} />
        <input className="btn btn-xs btn-warning" type="radio" name="fee" aria-label="Standard" disabled={readOnly} onChange={handleFeeChange} />
        <input className="btn btn-xs btn-success" type="radio" name="fee" aria-label="Fast" disabled={readOnly} onChange={handleFeeChange} />
      </form>
    </div>
  )
}