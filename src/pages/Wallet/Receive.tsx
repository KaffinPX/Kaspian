import useKaspa from "@/hooks/useKaspa"
import { useState } from "react"
import QRCode from "react-qr-code"

export default function Receive () {
  const { kaspa } = useKaspa()

  const [ amount, setAmount ] = useState("")

  return (
    <dialog id="receive_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box flex flex-col gap-2 text-center">
        <h3 className="text-2xl font-extrabold tracking-tight">Receive KAS</h3>
        <div className="bg-base-200 rounded-box p-3 w-min mx-auto">
          <QRCode
            style={{ height: "auto", width: "140px" }}
            value={`${kaspa.addresses[0][kaspa.addresses[0].length - 1]}?${amount ? `amount=${amount}` : ''}`}
          />
        </div>
        <div>
          <textarea 
            className="textarea textarea-xs w-full tracking-tighter min-h-0 resize-none overflow-hidden"
            value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
            disabled
          />
          <input
            type="number"
            min={0}
            className="input input-xs w-36 input-ghost text-center"
            placeholder="Amount (as Kaspa)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}