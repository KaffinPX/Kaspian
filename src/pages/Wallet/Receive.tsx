import useKaspa from "@/hooks/useKaspa"
import QRCode from "react-qr-code"

export default function Receive () {
  const { kaspa } = useKaspa()

  return (
    <dialog id="receive_modal" className="modal modal-bottom">
      <div className="modal-box flex flex-col gap-2 text-center">
        <h3 className="text-2xl font-extrabold tracking-tight">Receive KAS</h3>
        <div className="bg-base-200 rounded-box p-4 w-min mx-auto gap-2">
          <QRCode
            style={{ height: "auto", width: "155px" }}
            value={`${kaspa.addresses[0][kaspa.addresses[0].length - 1]}`}
          />
        </div>
        <textarea 
          className="textarea resize-none overflow-hidden mx-auto"
          value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
          disabled
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}