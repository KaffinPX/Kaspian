import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { UnlockKeyhole } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { i18n } from "webextension-polyfill"

export default function UnlockWallet() {
  const [password, setPassword] = useState<string>("")
  const navigate = useNavigate()
  const unlockWallet = () => {
    // FIXME - Placeholder
    navigate("/main")
  }
  
  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Kaspian"}
        subtitle={i18n.getMessage('unlockIntro')}
      />
      <div className={"mx-auto"}>
        <Input
          type={"password"}
          placeholder={i18n.getMessage('password')}
          className={"w-72"}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <div className={"mx-auto"}>
        <Button
          onClick={() => {
            unlockWallet()
          }}
          disabled={password === ""}
          className={"gap-2"}
        >
          <UnlockKeyhole />
          {i18n.getMessage('unlock')}
        </Button>
      </div>
    </main>
  )
}
