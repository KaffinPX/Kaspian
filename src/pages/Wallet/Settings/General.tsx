import { currencies } from "@/contexts/Settings"
import useSettings from "@/hooks/useSettings"
import { DollarSignIcon } from "lucide-react"

export default function General () {
  const { settings, updateSetting } = useSettings()

  return (
    <div className="collapse shadow-md">
      <input type="radio" name="settings-accordion" defaultChecked />
      <div className="collapse-title text-base font-bold">General</div>
      <div className="collapse-content">
        <button className="btn btn-outline w-full" onClick={() => {
          const tickers = Object.keys(currencies)
          const currentIndex = tickers.indexOf(settings.currency)
          const nextCurrency = tickers[(currentIndex + 1) % tickers.length] as keyof typeof currencies

          updateSetting('currency', nextCurrency)
        }}>
          <DollarSignIcon />
          Currency: {settings.currency}
        </button>
      </div>
    </div>
  )
}