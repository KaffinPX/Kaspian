import { Button } from "@/components/ui/button"
import { Download, LogOutIcon } from "lucide-react"
import Heading from "@/components/Heading"
// import UTXOCard from "@/components/UTXOCard"
import SendDrawer from "@/pages/Wallet/Send"
import ReceiveDrawer from "@/pages/Wallet/Receive"
import SettingsSheet from "@/pages/Wallet/Settings"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import { useEffect } from "react"
import { Status } from "@/wallet/controller/wallet"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"

export default function Wallet () {
  const kaspa = useKaspa()
  const navigate = useNavigate()

  useEffect(() => {
    if (kaspa.status !== Status.Unlocked) {
      navigate("/")
    }
  }, [ kaspa.status ])

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6 gap-3"}>
      <div className={"flex flex-col gap-2"}>
        <div className={"flex flex-row justify-between items-center"}>
          <Heading title={"Kaspian"} />
          <div className={"flex items-center gap-3 mr-2"}>
            <SettingsSheet />
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={async () => {
                await kaspa.request('wallet:lock', [])
              }}
            >
              <LogOutIcon />
            </Button>
          </div>
        </div>
        <div className={"flex flex-col items-center"}>
          <p className={"text-4xl font-extrabold"}>{kaspa.balance}</p>
          <p className={"text-xl font-bold"}>$ 0.00</p>
        </div>
        <div className={"flex flex-col items-center"}>
          <Textarea
            defaultValue={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
            className={"w-72"}
            disabled={true}
          />
        </div>
      </div>
      <div className={"grid grid-cols-3 mx-4 h-full overflow-y-scroll no-scrollbar gap-2"}>
        {kaspa.utxos.map((utxo, id) => {
          return (
            <div key={id} className="flex flex-col items-center text-center py-2 border-solid border-2 border-orange-800 hover:border-dashed rounded-xl w-24 h-24">
              <p className={"text-xl font-bold"}>{utxo[0]}</p>
              <Button variant="link" className={"text-white font-extrabold"}>{utxo[1].substring(0, 7)}...</Button>
            </div>
          )
        })}
      </div>
      <div className={"flex flex-row justify-center gap-5"}>
        <SendDrawer />
        <ReceiveDrawer />
      </div>
    </main>
  )
}
