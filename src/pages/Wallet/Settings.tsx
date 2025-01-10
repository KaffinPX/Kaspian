import { currencies } from "@/contexts/Settings"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"
import { SettingsIcon, NetworkIcon, HammerIcon, DollarSignIcon, SearchIcon } from "lucide-react"

export default function Receive () {
  const { kaspa } = useKaspa()
  const { settings, updateSetting } = useSettings()


  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-circle">
        <SettingsIcon />
      </button>
      <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 shadow">
        <button className="btn" onClick={() => {
          const tickers = Object.keys(currencies)
          const currentIndex = tickers.indexOf(settings.currency)
          const nextCurrency = tickers[(currentIndex + 1) % tickers.length] as keyof typeof currencies

          updateSetting('currency', nextCurrency)
        }}>
          <DollarSignIcon />
          Currency: {settings.currency}
        </button>
        <button className="btn">
          <NetworkIcon />
          Change Node
        </button>
        <button className="btn">
          <SearchIcon />
          Scan Addresses
        </button>
        <li>
          <button className="btn btn-error">
            <HammerIcon />
            Reset Wallet
          </button>
        </li>
      </ul>
    </div>
  )
}