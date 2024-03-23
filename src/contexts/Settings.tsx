import LocalStorage from "@/storage/LocalStorage"
import { createContext, useState, type ReactNode, useEffect, useCallback } from "react"

export interface ISettings {
  version: number
  currencies: {
    ticker: string,
    symbol: string
  }[]
  nodes: {
    name: string
    address: string
    locked: boolean
  }[]
  selectedCurrency: number
  selectedNode: number
}

// Consider moving currencies to an another file w constants as its not dynamic(would mean update-compatibility)

export const defaultSettings: ISettings = {
  version: 3,
  currencies: [{
    ticker: "USD",
    symbol: "$"
  }, {
    ticker: "EUR",
    symbol: "€"
  }],
  nodes: [{
      name: "Kaspa-NG EU",
      address: "wss://eu-1.kaspa-ng.io/mainnet",
      locked: true
  }],
  selectedCurrency: 0,
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
