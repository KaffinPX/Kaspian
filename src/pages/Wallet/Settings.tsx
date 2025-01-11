import { currencies } from "@/contexts/Settings"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"
import { SettingsIcon, NetworkIcon, HammerIcon, DollarSignIcon, SearchIcon, WholeWordIcon } from "lucide-react"

export default function Settings () {
  const { kaspa } = useKaspa()
  const { settings, updateSetting } = useSettings()

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-circle">
        <SettingsIcon />
      </button>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-60 shadow-md">
        <div className="divider">General</div>
        <button className="btn" onClick={() => {
          const tickers = Object.keys(currencies)
          const currentIndex = tickers.indexOf(settings.currency)
          const nextCurrency = tickers[(currentIndex + 1) % tickers.length] as keyof typeof currencies

          updateSetting('currency', nextCurrency)
        }}>
          <DollarSignIcon />
          Currency: {settings.currency}
        </button>
        <div className="divider">Wallet</div>
        <button className="btn">
          <NetworkIcon />
          Change Node
        </button>
        <button className="btn">
          <SearchIcon />
          Scan Addresses
        </button>
        <button className="btn">
          <WholeWordIcon />
          Export Wallet
        </button>
        <button className="btn btn-error mt-3">
          <HammerIcon />
          Reset Wallet
        </button>
      </ul>
    </div>
  )
}