import { Button } from "@/components/ui/button"
import Heading from "@/components/Heading"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Import({
  onMnemonicsSubmit
}: {
  onMnemonicsSubmit: (mnemonics: string) => void
}) {
  const [mnemonicTextAreaValue, setMnemonicTextAreaValue] = useState("")
  const [mnemonicTextAreaError, setMnemonicTextAreaError] = useState("")
  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Import wallet"}
        subtitle={
          "Enter your 24-word mnemonic phrase below to import your wallet."
        }
      />
      <div className={"flex flex-col items-center"}>
        <Textarea
          placeholder={"Mnemonic phrase"}
          className={
            "font-mono w-3/4 h-32 border-green-500 border-2 text-center break-words"
          }
          value={mnemonicTextAreaValue}
          onChange={e => {
            const lastChar = e.target.value.slice(-1)
            const prevLastChar = e.target.value.slice(-2, -1)
            if (lastChar === " " && prevLastChar === " ") {
              setMnemonicTextAreaValue(e.target.value.slice(0, -1))
              return
            }
            setMnemonicTextAreaValue(e.target.value.replace(/\n/g, ""))
            // FIXME check whether mnemonic is valid
            setMnemonicTextAreaError("")
          }}
        />
        {mnemonicTextAreaError !== "" ? (
          <Label htmlFor={"importWalletButton"} className={"text-red-500 mt-2"}>
            {mnemonicTextAreaError}
          </Label>
        ) : null}
      </div>

      <div className={"flex flex-col items-center gap-2"}>
        <Button
          disabled={
            mnemonicTextAreaValue === "" || mnemonicTextAreaError !== ""
          }
          onClick={() => {
            onMnemonicsSubmit(mnemonicTextAreaValue)
          }}
          id={"importWalletButton"}
        >
          Import wallet
        </Button>
      </div>
    </main>
  )
}

function MnemonicWord(props: { word: string; no: number }) {
  return (
    <div className={"flex flex-col items-center justify-center"}>
      <p className={"text-2xl"}>{props.no}</p>
      <p className={"text-2xl"}>{props.word}</p>
    </div>
  )
}
