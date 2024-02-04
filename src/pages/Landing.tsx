import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useSettings from "../hooks/useSettings"
import useKaspa from "../hooks/useKaspa"
import usePromise from "../hooks/usePromise"
import { Status } from "@/wallet/core/wallet"

export default function Landing() {
  const settings = useSettings()
  const kaspa = useKaspa()
  const navigate = useNavigate()

  const [ loadedSettings ] = usePromise(() => {
    return settings.load()
  }, [])

  const [ loadedKaspa ] = usePromise(() => {
    console.log('synchronizing kaspa')
    
    return kaspa.synchronize()
  }, [])

  useEffect(() => {
    if (loadedSettings && loadedKaspa) {
      if (kaspa.status === Status.Uninitialized) {
        navigate("/create")
      } else if (kaspa.status === Status.Locked) {
        navigate("/unlock")
      } else if (kaspa.status === Status.Unlocked) {
        navigate("/wallet") // TODO: Consider if we should add some checkers to avoid misnavigation
      } else throw Error('Something is wrong with the worker')
    }
  }, [ loadedSettings, loadedKaspa ])

  return null
}
