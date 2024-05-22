import { Button } from "@/components/ui/button"
import { LogOutIcon, CompassIcon } from "lucide-react"
import Heading from "@/components/Heading"
import SendDrawer from "@/pages/Wallet/Send"
import ReceiveDrawer from "@/pages/Wallet/Receive"
import ConnectDrawer from "@/pages/Wallet/Connect"
import SettingsSheet from "@/pages/Wallet/Settings"
import useKaspa from "@/hooks/useKaspa"
import { useEffect } from "react"
import { Status } from "@/wallet/kaspa/wallet"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { currencies } from "@/contexts/Settings"
import useSettings from "@/hooks/useSettings"
import useCoingecko from "@/hooks/useCoingecko"

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
    <main className={"flex flex-col justify-between min-h-screen w-full py-6 gap-3"}>
      <div className={"flex flex-row justify-between items-center"}>
        <Heading title={"Kaspian"} />
        <div className={"flex items-center gap-3 mr-2"}>
          <SettingsSheet />
          {kaspa.connectedURL === "" && <Button size={"icon"} variant={"outline"} onClick={() => {
            request('wallet:lock', [])
          }}>
            <LogOutIcon />
          </Button>}
          {kaspa.connectedURL !== "" && <Button size={"icon"} variant={"outline"} onClick={() => {
            request('provider:disconnect', [])
          }}>
            <CompassIcon />
          </Button>}
        </div>
      </div>
      <div className={"flex flex-col gap-1"}>
        <div className={"flex flex-col items-center"}>
          <p className={"text-4xl font-extrabold"}>{kaspa.balance.toFixed(4)} KAS</p>
          <p className={"text-xl font-bold"}>{currencies[settings.currency]} {(kaspa.balance * price).toFixed(2)}</p>
        </div>
        <div className={"flex flex-col items-center"}>
          <Textarea
            readOnly={true}
            defaultValue={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
            className={"w-72 resize-none"}
          />
        </div>
      </div>
      <div className="h-full">
        <div className={"grid grid-cols-3 mx-4 overflow-y-scroll no-scrollbar gap-2"}>
          {kaspa.utxos.map((utxo, id) => {
            return (
              <div key={id} className={"flex flex-col items-center py-2 border-2 rounded-xl w-full h-24 " + (utxo.mature ? "hover:border-dashed" : "border-yellow-600")}>
                <p className={"text-lg font-bold"}>{utxo.amount.toFixed(4)}</p>
                <Button variant="link" className={"text-inherit font-extrabold"} onClick={() => {
                  window.open(`https://explorer.kaspa.org/txs/${utxo.transaction}`)
                }}>
                  {utxo.transaction.substring(0, 8)}...
                </Button>
              </div>
            )
          })}
        </div>

      </div>
      <div className={"flex flex-row justify-center gap-5"}>
        <SendDrawer />
        <ReceiveDrawer />
        <ConnectDrawer />
      </div>
    </main>
  )
}
