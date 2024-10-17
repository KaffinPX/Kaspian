import { KeyIcon } from "lucide-react"
import { useState, useMemo } from "react"

enum PasswordErrors {
  TooShort,
  UpperCase,
  LowerCase,
  Number,
  SpecialCharacter
}

const specialCharacters = new Set([ "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "|", ";", ":", "'", "\"", "<", ">", ",", ".", "?", "/" ])

export default function Password ({ onSet }: {
  onSet: (password: string) => void
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
    <main className="flex flex-col justify-between min-h-screen px-8 py-8">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center justify-center gap-2">
          <KeyIcon strokeWidth={3} size={28}/>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Set a password
          </h1>
        </div>
        <p className="font-semibold text-center">
          Will be used for encryption of mnemonic.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <input
          type={isHidden ? 'password' : 'text'}
          placeholder={'Password'}
          value={password}
          className="input input-bordered w-full"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-xs" onClick={() => setIsHidden(!isHidden)}>
          {isHidden ? "Show" : "Hide"}
        </button>
        <div className="flex flex-col gap-0.5">
          <label>
            {errors.has(PasswordErrors.TooShort) ? "❌ " : "✅ "}
            At least 8 characters long.
          </label>
          <label>
            {errors.has(PasswordErrors.UpperCase) ? "❌ " : "✅ "}
            At least one uppercase letter.
          </label>
          <label>
            {errors.has(PasswordErrors.LowerCase) ? "❌ " : "✅ "} 
            At least one lowercase letter.
          </label>
          <label>
            {errors.has(PasswordErrors.Number) ? "❌ " : "✅ "} 
            At least one number.
          </label>
          <label>
            {errors.has(PasswordErrors.SpecialCharacter) ? "❌ " : "✅ "} 
            At least one special character.
          </label>
        </div>
      </div>
      <button className="btn btn-primary" disabled={!!errors.size} onClick={() => onSet(password)}>
         Continue
      </button>
    </main>
  )
}