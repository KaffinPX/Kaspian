import useKaspa from "@/hooks/useKaspa"
import useURLParams from "@/hooks/useURLParams"
import { CableIcon } from "lucide-react"

export default function Receive () {
  const { request } = useKaspa()
  const [ hash, params ] = useURLParams()

  return (
    <dialog id="connect_modal" className={`modal modal-bottom sm:modal-middle ${hash === 'connect' ? 'modal-open' : ''}`}>
      <div className="modal-box flex flex-col gap-1 text-center">
        <h3 className="text-2xl font-extrabold tracking-tight">Connect</h3>
        <textarea className="textarea resize-none overflow-hidden" disabled>{params.get("url")}</textarea>
        <button className={"btn"} onClick={() => {
          request('provider:connect', [ params.get('url')! ]).then(() => {
            window.close()
          })
        }}>
          <CableIcon />
          Connect
        </button>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}