import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { i18n } from "webextension-polyfill"
import { UnlockKeyhole } from "lucide-react"
import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useKaspa from "@/hooks/useKaspa"

export default function UnlockWallet() {
  const navigate = useNavigate()
  const { request } = useKaspa()

  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState("")

  const unlockWallet = useCallback(() => {
    request('wallet:unlock', [ password ]).then(() => {
      navigate("/")
    }).catch((err) => {
      setError(err)
    })
  }, [ password ])

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
          onKeyUp={e => {
            if (e.key !== 'Enter' || password === "") return
            unlockWallet()
          }}
          autoFocus
        />
      </div>
      <div className={"mx-auto"}>
        <Button className={"gap-2"} disabled={password === ""} onClick={unlockWallet}>
          <UnlockKeyhole />
          {i18n.getMessage('unlock')}
        </Button>
      </div>
    </main>
  )
}
