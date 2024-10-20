import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useSettings from "../hooks/useSettings"
import useKaspa from "../hooks/useKaspa"
import usePromise from "../hooks/usePromise"
import { Status } from "@/wallet/kaspa/wallet"

export default function Landing() {
  const settings = useSettings()
  const { kaspa, load } = useKaspa()
  const navigate = useNavigate()
  
  const [ loadedSettings ] = usePromise(() => {
    return settings.load()
  }, [])

  const [ loadedKaspa ] = usePromise(() => {
    return load()
  }, [])

  useEffect(() => {
    if (loadedSettings && loadedKaspa) {
      if (kaspa.status === Status.Uninitialized) {
        navigate("/creation")
      } else if (kaspa.status === Status.Locked) {
        navigate("/unlock")
      } else if (kaspa.status === Status.Unlocked) {
        navigate("/:3")
      }
    }
  }, [ loadedSettings, loadedKaspa ])

  return null
}