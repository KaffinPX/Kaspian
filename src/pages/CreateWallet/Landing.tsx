import { Button } from "@/components/ui/button"
import { Import, PlusCircle } from "lucide-react"
import Heading from "@/components/Heading"
import { Tabs } from "../CreateWallet"
import { i18n } from "webextension-polyfill"

export default function Landing({ forward }: { 
  forward: (tab: Tabs) => void
}) {
  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Kaspian"}
        subtitle={i18n.getMessage('kaspianIntro')}
      />
      <div className={"mx-auto"}>
        <img src={"favicon.png"} alt={"Landing"} className={"w-60"} />
      </div>
      <div className={"flex flex-col items-center justify-center"}>
        <div className={"flex flex-col items-center"}>
          <p className={"text-lg"}>{i18n.getMessage('createIntro')}</p>
          <Button
            onClick={() => {
              forward(Tabs.Intro)
            }}
            className={"gap-2"}
          >
            <PlusCircle />
            {i18n.getMessage('createWallet')}
          </Button>
        </div>
        <div className={"flex flex-col items-center"}>
          <p className={"text-lg"}>{i18n.getMessage('importIntro')}</p>
          <Button
            className={"gap-2"}
            onClick={() => {
              forward(Tabs.Import)
            }}
          >
            <Import />
            {i18n.getMessage('importWallet')}
          </Button>
        </div>
      </div>
    </main>
  )
}
