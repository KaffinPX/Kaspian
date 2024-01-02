import { Button } from "@/components/ui/button"
import { Import, PlusCircle } from "lucide-react"
import Heading from "@/components/Heading"
import { Tabs } from "../CreateWallet"

export default function Landing({ forward }: { forward: (tab: Tabs) => void }) {
  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Kaspian"}
        subtitle={"Welcome to Kaspian. Let's get you started!"}
      />
      <div className={"mx-auto"}>
        <img src={"favicon.png"} alt={"Landing"} className={"w-60"} />
      </div>
      <div className={"flex flex-col items-center justify-center"}>
        <div className={"flex flex-col items-center"}>
          <p className={"text-lg"}>Create a wallet to get started</p>
          <Button
            onClick={() => {
              forward(Tabs.Intro)
            }}
            className={"gap-2"}
          >
            <PlusCircle />
            Create wallet
          </Button>
        </div>
        <div className={"flex flex-col items-center"}>
          <p className={"text-lg"}>Already have a wallet? Import it here.</p>
          <Button
            className={"gap-2"}
            onClick={() => {
              forward(Tabs.Import)
            }}
          >
            <Import />
            Import wallet
          </Button>
        </div>
      </div>
    </main>
  )
}
