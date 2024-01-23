import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useSettings from "../hooks/useSettings"
import usePromise from "../hooks/usePromise"

export default function Landing() {
  const settings = useSettings()
  const navigate = useNavigate()

  const [ loadedSettings ] = usePromise(() => {
    return settings.load()
  }, [])

  useEffect(() => {
    if (loadedSettings) {
      navigate("/wallet")
    }
  }, [ loadedSettings ])

  return null
}
