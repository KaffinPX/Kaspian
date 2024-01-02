// Component for Verify.jsx

import { Input } from "@/components/ui/input"
import React, { useState } from "react"
interface WordCheckerProps {
  wordNumber: number
  onChange: (value: string) => void
}
export default function WordChecker(props: WordCheckerProps) {
  const [input, setInput] = useState<string>("")
  const verifyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Regex for only lowercase letters
    const regex = new RegExp("^[a-z]+$")
    if (regex.test(value) || value === "") {
      setInput(value)
      props.onChange(value)
    }
  }
  return (
    <div className={"flex gap-3 items-center place-content-between w-60"}>
      <p className={"font-bold text-lg"}>Word {props.wordNumber}</p>
      <Input
        value={input}
        className={"w-36"}
        pattern={"^[a-z]+$"}
        onChange={verifyInput}
      />
    </div>
  )
}
