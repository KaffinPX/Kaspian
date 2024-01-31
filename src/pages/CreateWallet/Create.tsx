import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Import, PlusCircle } from "lucide-react"
import Heading from "@/components/Heading"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function Create({ mnemonics, onSaved }: {
  mnemonics: string
  onSaved: () => void
}) {
  const [isSaved, setIsSaved] = useState(false)
  const [isHidden, setIsHidden] = useState(true)

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Backup your wallet"}
        subtitle={
          "It's time to save your mnemonic phrase. Write it down and keep it safe."
        }
      />
      <div className={"flex flex-col items-center gap-2"}>
        <div className={"border-2 border-green-500 p-3 mx-5 rounded-xl"}>
          <p className={"text-xl font-mono"}>
            {isHidden ? mnemonics : mnemonics.replace(/[^ ]/g, "*")}
          </p>
        </div>
        <Button
          variant={"ghost"}
          className={"text-green-400 gap-1?" + ""}
          onClick={() => {
            setIsHidden(!isHidden)
          }}
        >
          {!isHidden ? <EyeOff /> : <Eye />}
          {!isHidden ? "Show" : "Hide"}
        </Button>
      </div>

      <div className={"flex flex-col items-center gap-2"}>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="savedConfirmation"
            onCheckedChange={(checked: boolean) => {
              setIsSaved(checked)
            }}
          />
          <label
            htmlFor="savedConfirmation"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I've saved my mnemonic phrase in a safe place
          </label>
        </div>
        <Button disabled={!isSaved} onClick={onSaved}>
          Continue
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
