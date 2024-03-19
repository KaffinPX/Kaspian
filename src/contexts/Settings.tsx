import LocalStorage from "@/storage/LocalStorage"
import { createContext, useState, type ReactNode, useEffect, useCallback } from "react"

export interface ISettings {
  version: number
  nodes: {
    name: string
    address: string
    locked: boolean
  }[]
  selectedNode: number
}

export const defaultSettings: ISettings = {
  version: 1,
  nodes: [
    {
      name: "Kaspa-NG EU",
      address: "wss://eu-1.kaspa-ng.io/mainnet",
      locked: true
    }
  ],
  selectedNode: 0
}

export const SettingsContext = createContext<{
  load: () => Promise<void>
  settings: ISettings,
  updateSetting: <K extends keyof ISettings>(key: K, value: ISettings[K]) => void
} | undefined>(undefined)

export function SettingsProvider({ children }: {
  children: ReactNode
}) {
  const [ settings, setSettings ] = useState(defaultSettings)

  useEffect(() => {
    LocalStorage.set("settings", settings)
  }, [ settings ])

  const load = useCallback(async () => {
    setSettings(await LocalStorage.get('settings', defaultSettings))
  }, [])

  const updateSetting = useCallback(<K extends keyof ISettings>(key: K, value: ISettings[K]) => {
    setSettings((prevSettings) => ({ 
      ...prevSettings, 
      [ key ]: value 
    }))
  }, [])

  return (
    <SettingsContext.Provider value={{ load, settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}
