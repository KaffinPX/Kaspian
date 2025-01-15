import { currencies } from "@/contexts/Settings"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"
import { SettingsIcon, HammerIcon, DollarSignIcon, SearchIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { runtime } from "webextension-polyfill"

export default function Settings () {
  const { kaspa, request } = useKaspa()
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
    <div className="drawer drawer-end z-[1] w-max">
      <input id="settings-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content justify-end">
        <label htmlFor="settings-drawer" className="btn btn-circle drawer-button">
          <SettingsIcon />
        </label>
      </div>
      <div className="drawer-side align-middle">
        <label htmlFor="settings-drawer" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content rounded-l-box min-h-full w-60 p-4">
          <div className="collapse shadow-md">
            <input type="radio" name="my-accordion-1" defaultChecked />
            <div className="collapse-title font-bold">General</div>
            <div className="collapse-content">
              <button className="btn" onClick={() => {
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
          <div className="collapse shadow-md">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title font-bold">Network</div>
            <div className="collapse-content">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Node</span>
                  <div className={`badge label-text-alt badge-outline badge-xs ${kaspa.connected ? 'badge-success' : 'badge-error'}`}>
                    {kaspa.connected ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
                <select className="select select-bordered" value={settings.selectedNode} onChange={(e) => {
                  const id = parseInt(e.target.value)

                  updateSetting('selectedNode', id)
                  request('node:connect', [ settings.nodes[id].address ])
                }}>
                  {settings.nodes.map((node, id) => {
                    return (
                      <option key={id} value={id}>{node.name} - {node.address}</option>
                    )
                  })}
                </select>
              </label>
            </div>
          </div>
          <div className="collapse shadow-md">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title font-bold">Account</div>
            <div className="collapse-content">
              <div className="flex justify-between py-2 badge badge-warning w-full">
                <span className="font-medium text-xs">Receive addresses</span>
                <p className="tabular-nums font-mono">{kaspa.addresses[0].length}</p>
              </div>
              <div className="flex justify-between py-2 badge badge-warning w-full">
                <span className="font-medium text-xs">Change addresses</span>
                <p className="tabular-nums font-mono">{kaspa.addresses[1].length}</p>
              </div>
              <button className="btn" onClick={({ currentTarget }) => {
                currentTarget.disabled = true

                request('account:scan', []).then(() => {
                  currentTarget.disabled = false
                })
              }}>
                <SearchIcon />
                Scan Addresses
              </button>
            </div>
          </div>

          <div className="collapse shadow-md">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title font-bold">Wallet</div>
            <div className="collapse-content">
              {typeof count === 'undefined' && (
                <button className="btn btn-error" onClick={() => {
                  setCount(10)
                }}>
                  <HammerIcon />
                  Reset Wallet
                </button>
              )}
              {typeof count !== 'undefined' && (
                <div className="flex flex-row gap-1">
                  <button className="btn btn-error w-40" disabled={count !== 0} onClick={() => {
                    request('wallet:reset', [])
                  }}>
                    Are you sure? ({count})
                  </button>
                  <button className="btn btn-circle" onClick={() => {
                    setCount(undefined)
                  }}>
                    <XIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 text-center font-bold">
            Kaspian {runtime.getManifest().version}
          </p>
        </ul>
      </div>
    </div>
  )
}