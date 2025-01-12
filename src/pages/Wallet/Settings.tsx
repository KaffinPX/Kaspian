import { currencies } from "@/contexts/Settings"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"
import { SettingsIcon, NetworkIcon, HammerIcon, DollarSignIcon, SearchIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { runtime } from "webextension-polyfill"

export default function Settings () {
  const { request } = useKaspa()
  const { settings, updateSetting } = useSettings()

  const [ count, setCount ] = useState<number>()

  useEffect(() => {
    if (count === undefined || count <= 0) return

    const timer = setInterval(() => {
      setCount(prevCount => prevCount ? prevCount - 1 : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [ count ])

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
        {typeof count === 'undefined' && (
          <button className="btn btn-error mt-3" onClick={() => {
            setCount(10)
          }}>
            <HammerIcon />
            Reset Wallet
          </button>
        )}
        {typeof count !== 'undefined' && (
          <div className="flex flex-row gap-1 mt-3">
            <button className="btn btn-error" disabled={count !== 0} onClick={() => {
              request('wallet:reset', [])
            }}>
              <HammerIcon />
              Are you sure? ({count})
            </button>
            <button className="btn btn-circle" onClick={() => {
              setCount(undefined)
            }}>
              <XIcon />
            </button>
          </div>
        )}
        <p className="mt-2 text-center font-bold">
          Kaspian {runtime.getManifest().version}
        </p>
      </ul>
    </div>
  )
}