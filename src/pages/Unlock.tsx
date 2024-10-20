import useKaspa from "@/hooks/useKaspa"
import { HandMetalIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Unlock () {
  const { request } = useKaspa()
  const navigate = useNavigate()

  const [ password, setPassword ] = useState("")
  const [ isHidden, setIsHidden ] = useState(true)

  const unlockWallet = useCallback(() => {
    request('wallet:unlock', [ password ]).then(() => {
      navigate("/")
    }).catch((err) => {
      // TODO: error handling :3
    })
  }, [ password ])

  return (
    <main className="flex flex-col justify-between min-h-screen px-8 py-8">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center justify-center gap-2">
          <HandMetalIcon strokeWidth={3} size={28}/>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome back!
          </h1>
        </div>
        <p className="font-semibold text-center">
          To enjoy all features of Kaspian, please unlock your wallet first.
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
      </div>
      <div className="flex flex-col gap-1">
        <button className="btn btn-primary">Unlock</button>
      </div>
    </main>
  )
}