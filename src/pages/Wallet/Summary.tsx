import useKaspa from "@/hooks/useKaspa"
import { Tabs } from "../Wallet"
import { currencies } from "@/contexts/Settings"
import useSettings from "@/hooks/useSettings"
import useCoingecko from "@/hooks/useCoingecko"
import { SendToBack, ReceiptIcon, LogOutIcon } from "lucide-react"

export default function Summary ({ forward }: { 
  forward: (tab: Tabs) => void
}) {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)

  return (
    <main className="flex flex-col justify-between min-h-screen px-3 py-4">
      <div className="flex flex-col gap-1">
        <div className="navbar">
          <div className="navbar-start">
            <button className="btn btn-outline text-4xl">Kaspian</button>
          </div>
          <div className="navbar-end">
            <button className="btn btn-circle">
              <LogOutIcon />
            </button>
          </div>
        </div>
        <div className="card bg-primary text-primary-contents">
          <div className="card-body items-center text-center gap-3">
            <div>
              <h2 className="card-title font-extrabold gap-0 h-8">
                <img className="h-11" src="https://kaspa.org/wp-content/uploads/2023/06/Kaspa-Icon-White.svg" />
                {kaspa.balance.toFixed(4)} KAS
              </h2>
              <p className="font-bold font-mono">{currencies[settings.currency]} {(kaspa.balance * price).toFixed(2)}</p>
            </div>
            <div className="card-actions">
              <button className="btn">
                <SendToBack />
                Send
              </button>
              <button className="btn">
                <ReceiptIcon />
                Receive
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}