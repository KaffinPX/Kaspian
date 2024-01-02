import Heading from "@/components/Heading"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import React, { useState } from "react"
import WordChecker from "@/components/WordChecker"

export default function Verify({ onVerify }: { onVerify: () => void }) {
  const [firstInput, setFirstInput] = useState<string>("")
  const [secondInput, setSecondInput] = useState<string>("")
  const [thirdInput, setThirdInput] = useState<string>("")
  const [fourthInput, setFourthInput] = useState<string>("")

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Backup your wallet"}
        subtitle={
          "To make sure you saved your mnemonic phrase, please enter the following words from it"
        }
      />
      <div className={"flex flex-col items-center gap-2"}>
        <WordChecker wordNumber={1} onChange={setFirstInput} />
        <WordChecker wordNumber={10} onChange={setSecondInput} />
        <WordChecker wordNumber={15} onChange={setThirdInput} />
        <WordChecker wordNumber={8} onChange={setFourthInput} />
      </div>
      <div className={"mx-auto"}>
        <Button
          className={"gap-2"}
          disabled={
            firstInput === "" ||
            secondInput === "" ||
            thirdInput === "" ||
            fourthInput === ""
          }
          onClick={() => {
            onVerify() // FIXME - Placeholder
          }}
        >
          <CheckCircle2 />
          Verify
        </Button>
      </div>
    </main>
  )
}
