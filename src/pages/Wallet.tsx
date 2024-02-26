import { Button } from "@/components/ui/button"
import { Download, LogOutIcon } from "lucide-react"
import Heading from "@/components/Heading"
// import UTXOCard from "@/components/UTXOCard"
import SendDrawer from "@/pages/Wallet/Send"
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
    <main className={"flex flex-col justify-between min-h-screen py-6 gap-2"}>
      <div className={"flex flex-col gap-2"}>
        <div className={"flex flex-row justify-between items-center"}>
          <Heading title={"Kaspian"} />
          <div className={"flex items-center gap-3 mr-2"}>
            <SettingsSheet />
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => {
                
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
            className={"text-s w-72"}
            disabled={true}
          />
        </div>
      </div>
      <div className={"grid grid-cols-3 mx-4 h-full overflow-y-scroll no-scrollbar gap-2"}>
        <div className="flex flex-col items-center text-center py-2 bg-primary rounded-xl w-24 h-24">
          <p className={"text-xl font-bold"}>1 KAS</p>
          <Button variant="link" className={"text-white font-extrabold"}>4e7726c...</Button>
        </div>
      </div>
      <div className={"flex flex-row justify-center gap-5"}>
        <SendDrawer />
        <Button className={"gap-2"} disabled={true} onClick={() => {}}>
          <Download />
          {i18n.getMessage('receive')}
        </Button>
      </div>
    </main>
  )
}
