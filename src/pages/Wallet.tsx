import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Heading from "@/components/Heading"
import UTXOCard from "@/components/UTXOCard"
import SendDrawer from "@/pages/Wallet/Send"
import SettingsSheet from "@/pages/Wallet/Settings"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import { useEffect } from "react"
import { Status } from "@/wallet/controller/wallet"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"

export default function Wallet () {
  const kaspa = useKaspa()
  const navigate = useNavigate()

  useEffect(() => { // TODO: update status by calling init() on hook by forwarding to landing?
    if (kaspa.status === Status.Uninitialized) {
      navigate("/create")
    } else if (kaspa.status === Status.Locked) {
      navigate("/unlock")
    }
  }, [ kaspa.status ])

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6 gap-2"}>
      <div className={"flex flex-col gap-2"}>
        <div className={"flex flex-row justify-between items-center"}>
          <Heading title={"Kaspian"} />
          <div className={"flex items-center gap-3 mr-2"}>
            <SettingsSheet />
          </div>
        </div>
        <div className={"flex flex-col items-center"}>
          <p className={"text-4xl font-extrabold"}>100 KAS</p>
          <p className={"text-xl font-bold"}>$ 0.00</p>
          <Input
            defaultValue={"kaspa:qpamkvhgh0kzx50gwvvp5xs8ktmqutcy3dfs9dc3w7lm9rq0zs76vf959mmrp"}
            className={"text-s w-72"}
            disabled={true}
          />
        </div>
      </div>

      <div className={"grid grid-cols-3 mx-4 h-fit <this-is-problematic-w-one-line overflow-y-scroll no-scrollbar gap-2"}>
        <div className="bg-primary rounded-xl w-24 h-24 text-center">
          <p className={"text-xl font-bold"}>100,000 KAS</p>
        </div>
      </div>
      <div className={"flex flex-row justify-center gap-5"}>
        <SendDrawer />
        <Button className={"gap-2"} onClick={() => {}}>
          <Download />
          {i18n.getMessage('receive')}
        </Button>
      </div>
    </main>
  )
}
