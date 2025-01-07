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
    })
  }, [ password ])

  return (
    <main className="flex flex-col min-h-screen px-3 py-4">
      <div className="navbar gap-4">
        <div className="navbar-start">
          <button className="btn btn-outline text-3xl">Kaspian</button>
        </div>
        <div className="navbar-end">
          <select className="select w-28">
            <option disabled selected>Account #1</option>
          </select>
        </div>
      </div>
      <fieldset className="fieldset border p-4 rounded-box mt-13">
        <legend className="fieldset-legend">Unlock wallet</legend>
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
        <button className="btn btn-ghost">Forgot password</button>
      </fieldset>
    </main>
  )
}