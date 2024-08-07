import { useState, useMemo } from "react"
import { i18n } from "webextension-polyfill"
import Heading from "@/components/Heading"
import { ArrowRightCircle, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

enum PasswordErrors {
  TooShort,
  UpperCase,
  LowerCase,
  Number,
  SpecialCharacter
}

const specialCharacters = new Set([ "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "|", ";", ":", "'", "\"", "<", ">", ",", ".", "?", "/" ])

export default function Password ({ onPasswordSet }: {
  onPasswordSet: (password: string) => void
}) {
  const [ password, setPassword ] = useState("")
  const [ isHidden, setIsHidden ] = useState(true)

  const errors = useMemo(() => {
    const errors = new Set<PasswordErrors>()

    if (password.length < 8) errors.add(PasswordErrors.TooShort)
    if (!/[A-Z]/.test(password)) errors.add(PasswordErrors.UpperCase)
    if (!/[a-z]/.test(password)) errors.add(PasswordErrors.LowerCase)
    if (!/[0-9]/.test(password)) errors.add(PasswordErrors.Number)
    if (![...password].some((character) => specialCharacters.has(character))) errors.add(PasswordErrors.SpecialCharacter)

    return errors
  }, [ password ])

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={i18n.getMessage('setPassword')}
        subtitle={i18n.getMessage('passwordDescription')}
      />
      <div className={"flex flex-col w-60 gap-3 mx-auto"}>
        <div className="flex space-x-2">
          <Input
            id="password"
            placeholder={i18n.getMessage('password')}
            type={isHidden ? 'password' : 'text'}
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            onKeyUp={e => {
              if (e.key !== 'Enter' || password === "") return
              onPasswordSet(password)
            }}  
          />
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => {
              setIsHidden(!isHidden)
            }
          }>
            {!isHidden ? <EyeOff /> : <Eye />}
          </Button>
        </div>
        <Label>
          {errors.has(PasswordErrors.TooShort) ? "❌ " : "✅ "}
          {i18n.getMessage('passwordTooShort')}
        </Label>
        <Label>
          {errors.has(PasswordErrors.UpperCase) ? "❌ " : "✅ "}
          {i18n.getMessage('passwordUpperCase')}
        </Label>
        <Label>
          {errors.has(PasswordErrors.LowerCase) ? "❌ " : "✅ "} 
          {i18n.getMessage('passwordLowerCase')}
        </Label>
        <Label>
          {errors.has(PasswordErrors.Number) ? "❌ " : "✅ "} 
          {i18n.getMessage('passwordNumber')}
        </Label>
        <Label>
          {errors.has(PasswordErrors.SpecialCharacter) ? "❌ " : "✅ "} 
          {i18n.getMessage('passwordSpecialCharacter')}
        </Label>
      </div>
      <div className={"mx-auto"}>
        <Button
          disabled={!!errors.size}
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
