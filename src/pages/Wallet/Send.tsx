import { useState } from "react"
import { XIcon } from "lucide-react"
import Outputs, { type Output } from "./Send/Outputs"
import Finalization from "./Send/Finalization"
import useURLParams from "@/hooks/useURLParams"
import { Input } from "@/provider/protocol"
import Creation from "./Send/Creation"

export default function Send () {
  const [ hash, params ] = useURLParams()

  const [ inputs ] = useState<Input[]>(JSON.parse(params.get('inputs')!) || [])
  const [ outputs, setOutputs ] = useState<Output[]>(JSON.parse(params.get('outputs')!) || [["", ""]])
  const [ transactions, setTransactions ] = useState<string[]>()

  return (
    <dialog id="send_modal" className={`modal modal-bottom ${hash === 'transact' ? 'modal-open' : ''}`}>
      <div className="modal-box flex flex-col gap-2 items-center h-68">
        <div className="flex flex-row gap-2">
          <h3 className="text-2xl font-extrabold tracking-tight">Send KAS</h3>
          <button className="btn btn-circle btn-sm" disabled={!transactions || hash === 'transact'} onClick={() => {
            setTransactions(undefined)
          }}>
            <XIcon />
          </button>
        </div>
        <Outputs outputs={outputs} setOutputs={setOutputs} readOnly={!!transactions || !!params.get('outputs')} />
        {!transactions ? (
          <Creation 
            inputs={inputs} 
            outputs={outputs} 
            setTransactions={setTransactions}
          />
        ) : (
          <Finalization
            transactions={transactions}
            inputs={inputs}
            closeAfter={hash === 'transact'}
          />
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}