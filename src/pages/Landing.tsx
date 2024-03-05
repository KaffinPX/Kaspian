import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useSettings from "../hooks/useSettings"
import useKaspa from "../hooks/useKaspa"
import usePromise from "../hooks/usePromise"
import { Status } from "@/wallet/kaspa/wallet"
import { Connection } from "@/wallet/kaspa/node"

export default function Landing() {
  const settings = useSettings()
  const kaspa = useKaspa()
  const navigate = useNavigate()

  const [ loadedSettings ] = usePromise(() => {
    return settings.load()
  }, [])

  const [ loadedKaspa ] = usePromise(() => {
    return kaspa.load()
  }, [])

  useEffect(() => {
    if (loadedSettings && loadedKaspa) {
      if (kaspa.connection === Connection.Disconnected) {
        kaspa.request('node:connect', [ settings.nodes[settings.selectedNode].address ])
      }

      if (kaspa.status === Status.Uninitialized) {
        navigate("/create")
      } else if (kaspa.status === Status.Locked) {
        navigate("/unlock")
      } else if (kaspa.status === Status.Unlocked) {
        navigate("/wallet")
      }
    }
  }, [ loadedSettings, loadedKaspa ])

  return null
}
