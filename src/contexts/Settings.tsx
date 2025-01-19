import LocalStorage from "@/storage/LocalStorage"
import { createContext, useState, type ReactNode, useEffect, useCallback } from "react"

export interface ISettings {
  version: number
  theme: "dark" | "light" | "system"
  currency: keyof typeof currencies
  nodes: {
    name: string
    address: string
    locked: boolean
  }[]
  selectedNode: number
}

export const currencies = {
  'USD': '$',
  'EUR': '€'
}

export const defaultSettings: ISettings = {
  version: 1,
  theme: 'system',
  currency: 'USD',
  nodes: [{
    name: "Public node",
    address: "mainnet",
    locked: true
  }, {
    name: "Public node",
    address: "testnet-10",
    locked: true
  }, {
    name: "Public node",
    address: "testnet-11",
    locked: true
  }],
  selectedNode: 0,
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
    const storedSettings = await LocalStorage.get('settings', defaultSettings)

    if (storedSettings.version !== defaultSettings.version) return
    setSettings(storedSettings)
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
