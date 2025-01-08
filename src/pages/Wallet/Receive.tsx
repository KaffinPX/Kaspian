import useKaspa from "@/hooks/useKaspa"
import QRCode from "react-qr-code"

export default function Receive () {
  const { kaspa } = useKaspa()

  return (
    <dialog id="receive_modal" className="modal modal-bottom">
      <div className="modal-box flex flex-col text-center">
        <p>Address #{kaspa.addresses[0].length - 1}</p>
        <textarea className="textarea resize-none overflow-hidden" disabled>{kaspa.addresses[0][kaspa.addresses[0].length - 1]}</textarea>
        <QRCode
          className="mx-auto mt-2"
          style={{ height: "auto", width: "70%" }}
          value={`${kaspa.addresses[0][kaspa.addresses[0].length - 1]}`}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}