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
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <div className={"flex flex-col gap-2"}>
        <div className={"flex flex-row justify-between items-center"}>
          <Heading title={"Kaspian"} />
          <div className={"flex items-center gap-3 mr-2"}>
            <SettingsSheet />
          </div>
        </div>

        <div className={"flex flex-col items-center"}>
          <p className={"text-4xl font-extrabold"}>100 KAS</p>
        </div>
      </div>

      <div className={"flex flex-col overflow-y-scroll no-scrollbar gap-2 h-80"}>
        <UTXOCard
          amount={100}
          txId={"700c62a084a1b0559a10a70fcd5b9f3d9caca7d5075e5eec4cc9bf53c54b06c3"}
          address={"kaspa:qrlksu3pxp6w7gxe8gw7lpajz8u64t5u958ucwveq49gxttaddetg8300l73p"}
        />
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
