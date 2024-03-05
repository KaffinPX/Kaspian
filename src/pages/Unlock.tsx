import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { UnlockKeyhole } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import { Label } from "@radix-ui/react-label"

export default function UnlockWallet() {
  const navigate = useNavigate()
  const kaspa = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")

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
          onChange={e => {
            if (error) setError("")

            setPassword(e.target.value)
          }}
        />
        <p className="text-red-600">{error}</p>
      </div>
      <div className={"mx-auto"}>
        <Button
          onClick={async ({ currentTarget }) => {
            currentTarget.disabled = true

            if (await kaspa.request('wallet:unlock', [ password ]).catch((err) => {
              setError(err)

              currentTarget.disabled = false
            })) {
              navigate("/")
            }
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
