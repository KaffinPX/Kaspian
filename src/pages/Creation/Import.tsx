import { useState, useCallback } from "react"
import { SquareAsteriskIcon } from "lucide-react"

export default function Import ({ onSubmit }: {
  onSubmit: (mnemonic: string) => void
}) {
  const [ mnemonic, setMnemonic ] = useState<string[]>(Array(24).fill(""))

  const changeMnemonicWord = useCallback((index: number, word: string) => {
    setMnemonic((prevWords) => {
      const updatedWords = [ ...prevWords ]
      updatedWords[index] = word

      return updatedWords
    })
  }, [])

  const parsePastedMnemonic = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
    const words = e.clipboardData.getData('text').split(' ')

    if (words.length === 24) {
      setMnemonic(words)
      e.preventDefault()
      e.currentTarget.blur()
    }
  }, [])

  return (
    <main className="flex flex-col justify-between min-h-screen px-6 py-8">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center justify-center gap-2">
          <SquareAsteriskIcon strokeWidth={3} size={28}/>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Import wallet
          </h1>
        </div>
        <p className="font-semibold text-center tracking-tighter">
          Enter mnemonic words, the key of a wallet.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {mnemonic.map((word, index) => (
          <input
            key={index}
            value={word}
            placeholder={`${index + 1}`}
            type="password"
            className="input input-bordered h-8 font-mono"
            onFocus={(e) => e.currentTarget.type = 'text'}
            onBlur={(e) => e.currentTarget.type = 'password'}
            onChange={(e) => changeMnemonicWord(index, e.target.value)}
            onPaste={parsePastedMnemonic}
          />
        ))}
      </div>
      <button className="btn btn-primary" disabled={mnemonic.some(word => word === "")}onClick={() => onSubmit(mnemonic.join(' '))}>
         Next
      </button>
    </main>
  )
}