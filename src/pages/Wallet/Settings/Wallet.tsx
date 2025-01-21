import { useEffect, useState } from "react"
import { HammerIcon, XIcon } from "lucide-react"
import useKaspa from "@/hooks/useKaspa"

export default function Wallet () {
  const { request } = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ count, setCount ] = useState<number>()

  useEffect(() => {
    if (count === undefined || count <= 0) return

    const timer = setInterval(() => {
      setCount(prevCount => prevCount ? prevCount - 1 : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [ count ])

  return (
    <div className="collapse shadow-md">
      <input type="radio" name="settings-accordion" />
      <div className="collapse-title text-base font-bold">Wallet</div>
      <div className="collapse-content flex flex-col gap-3">
        {typeof count === 'undefined' && (
          <button className="btn btn-error w-full" onClick={() => {
            setCount(10)
          }}>
            <HammerIcon />
            Reset Wallet
          </button>
        )}
        {typeof count !== 'undefined' && (
          <div className="flex flex-row gap-1">
            <button className="btn btn-error w-35" disabled={count !== 0} onClick={() => {
              request('wallet:reset', [])
            }}>
              Confirm? ({count})
            </button>
            <button className="btn btn-circle" onClick={() => {
              setCount(undefined)
            }}>
              <XIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}