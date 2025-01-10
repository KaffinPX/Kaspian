import useKaspa from "@/hooks/useKaspa"
import QRCode from "react-qr-code"

export default function Receive () {
  const { kaspa } = useKaspa()

  return (
    <dialog id="receive_modal" className="modal modal-bottom">
      <div className="modal-box flex flex-col gap-1 text-center">
        <p>Address #{kaspa.addresses[0].length - 1}</p>
        <QRCode
          className="mx-auto"
          style={{ height: "auto", width: "180px" }}
          value={`${kaspa.addresses[0][kaspa.addresses[0].length - 1]}`}
        />
        <textarea className="textarea resize-none overflow-hidden" disabled>{kaspa.addresses[0][kaspa.addresses[0].length - 1]}</textarea>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}