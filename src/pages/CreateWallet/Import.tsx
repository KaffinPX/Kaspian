import { Button } from "@/components/ui/button"
import Heading from "@/components/Heading"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { i18n } from "webextension-polyfill"

export default function Import ({ onMnemonicsSubmit }: {
  onMnemonicsSubmit: (mnemonics: string) => void
}) {
  const [ mnemonic, setMnemonic ] = useState("")

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading title={i18n.getMessage('importWallet')} subtitle={i18n.getMessage('importDescription')} />
      <div className={"flex flex-col items-center"}>
        <Textarea
          placeholder={i18n.getMessage('mnemonic')}
          className={"font-mono w-5/6 h-44 border-2 text-center break-words"}
          value={mnemonic}
          onChange={e => {
            setMnemonic(e.target.value)
          }}
        />
      </div>
      <div className={"flex flex-col items-center gap-2"}>
        <Button
          disabled={mnemonic === ""}
          onClick={() => {
            onMnemonicsSubmit(mnemonic)
          }}
        >
          Import
        </Button>
      </div>
    </main>
  )
}
