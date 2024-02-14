import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import Heading from "@/components/Heading"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { i18n } from "webextension-polyfill"

export default function Create({ mnemonic, onSaved }: {
  mnemonic: string
  onSaved: () => void
}) {
  const [ isSaved, setIsSaved ] = useState(false)
  const [ isHidden, setIsHidden ] = useState(true)

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={i18n.getMessage('backupWallet')}
        subtitle={i18n.getMessage('backupMnemonic')}
      />
      <div className={"flex flex-col items-center gap-2"}>
        <div className={"border-2 border-green-500 p-3 mx-5 rounded-xl"}>
          <p className={"text-xl font-mono"}>
            {isHidden ? mnemonic : mnemonic.replace(/[^ ]/g, "*")}
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
          {!isHidden ? i18n.getMessage('show') : i18n.getMessage('hide')}
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
            {i18n.getMessage('confirmBackup')}
          </label>
        </div>
        <Button disabled={!isSaved} onClick={onSaved}>
          {i18n.getMessage('finish')}
        </Button>
      </div>
    </main>
  )
}
