import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { UnlockKeyhole } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"

export default function UnlockWallet() {
  const navigate = useNavigate()
  const { request } = useKaspa()

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
          value={password}
          error={error}
          onChange={e => {
            if (error) setError("")

            setPassword(e.target.value)
          }}
        />
      </div>
      <div className={"mx-auto"}>
        <Button className={"gap-2"} disabled={password === ""} onClick={() => {
          setPassword("")

          request('wallet:unlock', [ password ]).then(() => {
            navigate("/wallet")
          }).catch((err) => {
            setError(err)
          })
        }}>
          <UnlockKeyhole />
          {i18n.getMessage('unlock')}
        </Button>
      </div>
    </main>
  )
}
