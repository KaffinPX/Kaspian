import { useCallback, useState } from "react"
import useKaspa from "@/hooks/useKaspa"
import { SendIcon, PenIcon, EraserIcon } from "lucide-react"
import Outputs, { type Output } from "./Send/Outputs"
import Submit from "./Send/Submit"
import Priority from "./Send/Priority"
import useURLParams from "@/hooks/useURLParams"
import { Input } from "@/provider/protocol"

export default function Send () {
  const { request } = useKaspa()
  const [ hash, params ] = useURLParams()

  const [ inputs ] = useState<Input[]>(JSON.parse(params.get('inputs')!) || [])
  const [ outputs, setOutputs ] = useState<Output[]>(JSON.parse(params.get('outputs')!) || [["", ""]])
  const [ feeRate, setFeeRate ] = useState(1)
  const [ priorityFee ] = useState(params.get('fee') ?? "0")
  const [ transactions, setTransactions ] = useState<string[]>()

  return (
    <dialog id="send_modal" className={`modal modal-bottom ${hash === 'transact' ? 'modal-open' : ''}`}>
      <div className="modal-box flex flex-col gap-2 items-center">
        <div className="flex flex-row gap-2">
          <h3 className="text-2xl font-extrabold tracking-tight">Send KAS</h3>
          <button className="btn btn-circle btn-sm" disabled={!transactions || hash === 'transact'} onClick={() => {
            setTransactions(undefined)
          }}>
            <EraserIcon />
          </button>
        </div>
        <Outputs outputs={outputs} setOutputs={setOutputs} readOnly={!!transactions || !!params.get('outputs')} />
        <Priority feeRate={feeRate} setFeeRate={setFeeRate} readOnly={!!transactions} />
        {!transactions && (
          <button className="btn btn-outline" onClick={() => {
            request('account:create', [ outputs, feeRate, priorityFee, inputs ]).then((transactions) => {
              setTransactions(transactions)
            })
          }}>
            <SendIcon />
            Send
          </button>
        )}
        {transactions && (
          <Submit transactions={transactions} prompt={hash === 'transact'} />
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}