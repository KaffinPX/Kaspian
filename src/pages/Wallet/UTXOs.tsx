import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import useKaspa from "@/hooks/useKaspa"

export default function UTXOs () {
  const { kaspa } = useKaspa()
  const [ index, setIndex ] = useState(18)
  const utxosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = utxosRef.current!

      if (scrollTop + clientHeight >= scrollHeight - 20 && index < kaspa.utxos.length) {
        setIndex(index + 9)
      }
    }

    const utxosCurrent = utxosRef.current

    if (utxosCurrent) {
      utxosCurrent.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (utxosCurrent) {
        utxosCurrent.removeEventListener('scroll', handleScroll)
      }
    }
  }, [ index ])

  return (
    <div ref={utxosRef} className="h-full overflow-y-scroll no-scrollbar">
      <div className={"grid grid-cols-3 mx-4 gap-2"}>
        {kaspa.utxos.slice(0, index).map((utxo, id) => {
          return (
            <div key={id} className={"flex flex-col items-center py-2 border-2 rounded-xl w-full h-24 " + (utxo.mature ? "hover:border-dashed" : "border-yellow-600")}>
              <p className={"text-lg font-bold"}>{utxo.amount.toFixed(4)}</p>
              <Button variant="link" className={"text-inherit font-extrabold"} onClick={() => {
                window.open(`https://explorer.kaspa.org/txs/${utxo.transaction}`)
              }}>
                {utxo.transaction.substring(0, 8)}...
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
