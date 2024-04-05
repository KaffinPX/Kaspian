import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import useSettings from "../hooks/useSettings"
import useKaspa from "../hooks/useKaspa"
import usePromise from "../hooks/usePromise"
import { Status } from "@/wallet/kaspa/wallet"

export default function Landing() {
  const settings = useSettings()
  const kaspa = useKaspa()
  const navigate = useNavigate()
  const location = useLocation()
  const [ loadedSettings ] = usePromise(() => {
    return settings.load()
  }, [])

  const [ loadedKaspa ] = usePromise(() => {
    return kaspa.load()
  }, [])

  useEffect(() => {
    console.log(location)
    if (loadedSettings && loadedKaspa) {
      if (kaspa.kaspa.status === Status.Uninitialized) {
        navigate("/create")
      } else if (kaspa.kaspa.status === Status.Locked) {
        navigate("/unlock")
      } else if (kaspa.kaspa.status === Status.Unlocked) {
        navigate("/wallet")
      }
    }
  }, [ loadedSettings, loadedKaspa ])

  return null
}
