import { useState } from "react"
import { i18n } from "webextension-polyfill"
import Heading from "@/components/Heading"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRightCircle } from "lucide-react"

export default function Password ({ onPasswordSet }: {
  onPasswordSet: (password: string) => void
}) {
  const [ password, setPassword ] = useState("")

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={i18n.getMessage('setPassword')}
        subtitle={i18n.getMessage('passwordDescription')}
      />
      <div className={"flex flex-col w-60 gap-3 mx-auto"}>
        <Input
          placeholder={i18n.getMessage('password')}
          value={password}
          onChange={(e) =>
            // TODO: Password check and disable button if needed + reveal/hide password by type
            setPassword(e.target.value)
          }
        />
      </div>
      <div className={"mx-auto"}>
        <Button
          onClick={() => {
            onPasswordSet(password)
          }}
          className={"gap-2"}
        >
          <ArrowRightCircle />
          {i18n.getMessage('confirm')}
        </Button>
      </div>
    </main>
  )
}
