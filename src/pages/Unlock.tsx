import useKaspa from "@/hooks/useKaspa"
import { useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Unlock () {
  const { request } = useKaspa()
  const navigate = useNavigate()

  const [ password, setPassword ] = useState("")
  const [ error, setError ] = useState(false)

  const unlockWallet = useCallback(() => {
    request('wallet:unlock', [ password ]).then(() => {
      navigate("/")
    }).catch(() => {
      setError(true)
    }).finally(() => setPassword(""))
  }, [ password ])

  return (
    <main className="flex flex-col min-h-screen px-3 py-4">
      <div className="navbar">
        <select className="select" defaultValue="Account #1">
          <option disabled>Account #1</option>
        </select>
      </div>
      <h1 className="text-3xl text-center font-extrabold tracking-tight">
        Welcome back, Kaspian!
      </h1>
      <fieldset className="fieldset border p-4 rounded-box mt-8">
        <legend className="fieldset-legend">Unlock account</legend>
        <label className="fieldset-label">Password</label>
        <input
          type={'password'}
          placeholder={'Password'}
          value={password}
          className={`input input-bordered w-full ${error ? "input-error" : ""}`}
          onChange={(e) => { 
            if (error) setError(false)
            setPassword(e.target.value)
          }}
        />
        <button className="btn btn-primary mt-3" onClick={unlockWallet}>Unlock</button>
        <button className="btn btn-ghost" onClick={() => alert("Currently not implemented.")}>Forget password</button>
      </fieldset>
    </main>
  )
}