import { useState } from "react"
import useKaspa from "@/hooks/useKaspa"
import { SendIcon, PenIcon, EraserIcon } from "lucide-react"
import Outputs, { type Output } from "./Send/Outputs"
import Submit from "./Send/Submit"

export default function Send () {
  const { request } = useKaspa()

  const [ outputs, setOutputs ] = useState<Output[]>([[ "", "" ]])
  const [ feeRate, setFeeRate ] = useState(1)
  const [ priorityFee, setPriorityFee ] = useState("0")

  const [ transactions, setTransactions ] = useState<string[]>()

  return (
    <dialog id="send_modal" className="modal modal-bottom">
      <div className="modal-box flex flex-col gap-2 items-center">
        <div className="flex flex-row gap-2">
          <h3 className="text-2xl font-extrabold tracking-tight">Send KAS</h3>
          <button className="btn btn-circle btn-sm" disabled={!transactions} onClick={() => {
            setTransactions(undefined)
          }}>
            <EraserIcon />
          </button>
        </div>
        <Outputs outputs={outputs} setOutputs={setOutputs} readOnly={!!transactions} />
        <div className="flex flex-row items-center gap-1 p-1">
          <p className="font-semibold">Priority</p>
          <form className="filter">
            <input className="btn btn-xs btn-square" type="reset" value="×" disabled={!!transactions} />
            <input className="btn btn-xs btn-error" type="radio" name="fee" aria-label="Slow" disabled={!!transactions} />
            <input className="btn btn-xs btn-warning" type="radio" name="fee" aria-label="Standard" disabled={!!transactions}/>
            <input className="btn btn-xs btn-success" type="radio" name="fee" aria-label="Fast" disabled={!!transactions}/>
          </form>
        </div>
        {!transactions && (
          <button className="btn btn-outline" onClick={() => {
            request('account:create', [ outputs, feeRate, priorityFee, [] ]).then((transactions) => {
              setTransactions(transactions)
            }).catch((err) => {
              // TODO: handle input errors
            })
          }}>
            <SendIcon />
            Send
          </button>
        )}
        {transactions && (
          <Submit transactions={transactions} />
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}