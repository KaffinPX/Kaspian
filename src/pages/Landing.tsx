import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useSettings from "../hooks/useSettings"
import useKaspa from "../hooks/useKaspa"
import usePromise from "../hooks/usePromise"
import { Status } from "@/wallet/core/wallet"

export default function Landing() {
  const kaspa = useKaspa()
  const settings = useSettings()
  const navigate = useNavigate()

  const [ connectedKaspa ] = usePromise(() => {
    return kaspa.connect()
  }, [])

  const [ loadedSettings ] = usePromise(() => {
    return settings.load()
  }, [])

  useEffect(() => {
    if (loadedSettings && connectedKaspa) {
      if (kaspa.status === Status.Uninitialized) {
        navigate("/create")
      } else if (kaspa.status === Status.Locked) {
        navigate("/unlock")
      } else if (kaspa.status === Status.Unlocked) {
        navigate("/wallet") // TODO: Consider if we should add some checkers to avoid misnavigation
      } else throw Error('Something is wrong with the worker')
    }
  }, [ connectedKaspa, loadedSettings ])

  return null
}
