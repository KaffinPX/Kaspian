import { PenLineIcon } from "lucide-react"

export default function Create({ mnemonic, onSaved }: {
  mnemonic: string
  onSaved: () => void
}) {
  return (
    <main className="flex flex-col justify-between min-h-screen px-6 py-8">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center justify-center gap-2">
          <PenLineIcon strokeWidth={3} size={28}/>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Backup words
          </h1>
        </div>
        <p className="font-semibold text-center tracking-tighter">
          Write mnemonic into a safe place, will be needed in future.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {mnemonic.split(' ').map((word, index) => (
          <label
            key={index}
            className="flex input input-bordered items-center gap-1 h-8"
          >
            {index + 1}
            <input
              value={word}
              className="font-mono max-w-full"
              disabled
            />
          </label>
        ))}
      </div>
      <button className="btn btn-primary" onClick={() => onSaved()}>
        Continue
      </button>
    </main>
  )
}