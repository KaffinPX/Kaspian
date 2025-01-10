import useKaspa from "@/hooks/useKaspa"
import { currencies } from "@/contexts/Settings"
import useSettings from "@/hooks/useSettings"
import useCoingecko from "@/hooks/useCoingecko"
import { SendToBack, ReceiptIcon, LogOutIcon } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'
import { Status } from "@/wallet/kaspa/wallet"
import SendModal from "./Wallet/Send"
import ReceiveModal from "./Wallet/Receive"

export default function Wallet () {
  const { kaspa, request } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)
  const navigate = useNavigate()

  useEffect(() => {
    if (!kaspa.connected) {
      request('node:connect', [ settings.nodes[settings.selectedNode].address ])
    }

    if (kaspa.status !== Status.Unlocked) {
      navigate("/")
    }
  }, [ kaspa.status ])
  
  return (
    <main className="flex flex-col justify-between min-h-screen px-3 py-4">
      <div className="flex flex-col gap-1">
        <div className="navbar">
          <div className="navbar-start">
            <button className="btn btn-outline text-3xl">Kaspian</button>
          </div>
          <div className="navbar-end">
            <button className="btn btn-circle" onClick={() => request('wallet:lock', [])}>
              <LogOutIcon />
            </button>
          </div>
        </div>
        <div className="card bg-primary card-border card-lg shadow-sm">
          <div className="card-body items-center text-center gap-3">
            <div>
              <h2 className="card-title font-extrabold gap-0 h-8">
                <img className="h-11" src="https://kaspa.org/wp-content/uploads/2023/06/Kaspa-Icon-White.svg" />
                {kaspa.balance.toFixed(4)} KAS
              </h2>
              <p className="font-bold font-mono">{currencies[settings.currency]} {(kaspa.balance * price).toFixed(2)}</p>
            </div>
            <div className="card-actions">
              <button className="btn" onClick={() => {
                // @ts-ignore
                document.getElementById('send_modal').showModal()
              }}>
                <SendToBack />
                Send
              </button>
              <button className="btn" onClick={() => {
                // @ts-ignore
                document.getElementById('receive_modal').showModal()
              }}>
                <ReceiptIcon />
                Receive
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`self-end status status-xl ${kaspa.connected ? 'status-success' : 'status-error'}`}></div>
      <SendModal />
      <ReceiveModal />
    </main>
  )
}