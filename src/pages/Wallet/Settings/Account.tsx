import { useMemo, useState } from "react"
import { PlusIcon, SearchIcon } from "lucide-react"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"

export default function Account () {
  const { kaspa, request } = useKaspa()
  const { settings, updateSetting } = useSettings()

  const [ name, setName ] = useState("")
  const [ address, setAddress ] = useState("")
  
  const addressValidity = useMemo(() => {
    try {
      const parsedUrl = new URL(address)
      return parsedUrl.protocol === "ws:" || parsedUrl.protocol === "wss:"
    } catch (e) {
      return false
    }
  }, [ address ])

  return (
    <div className="collapse shadow-md">
      <input type="radio" name="settings-accordion" />
      <div className="collapse-title text-base font-bold">Account</div>
      <div className="collapse-content flex flex-col gap-3">
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Node</span>
              <div className={`badge label-text-alt badge-outline badge-xs ${kaspa.connected ? 'badge-success' : 'badge-error'}`}>
                {kaspa.connected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            <div className="join">
              <select className="select join-item" value={settings.selectedNode} onChange={(e) => {
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
              <details className="dropdown dropdown-end">
                <summary className="btn btn-primary join-item">
                  <PlusIcon />
                </summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-48 shadow-sm gap-1 mt-1">
                  <input
                    className="input input-xs rounded-xl "
                    value={name}
                    type={"text"}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="input input-xs rounded-xl"
                    value={address} 
                    type={"text"} 
                    placeholder="URL"
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <button className="btn btn-xs rounded-xl" disabled={name === "" || !addressValidity} onClick={() => {
                    updateSetting('nodes', [
                      ...settings.nodes, {
                        name,
                        address,
                        locked: false
                    }])
                    setName("")
                    setAddress("")
                  }}>
                    <PlusIcon />
                    Add Node
                  </button>
                </ul>
              </details>
            </div>
          </label>
        </div>
        <div>
          <div className="flex justify-between py-2 badge w-full">
            <span className="font-medium text-xs">Receive addresses</span>
            <p className="tabular-nums font-mono">{kaspa.addresses[0].length}</p>
          </div>
          <div className="flex justify-between py-2 badge w-full">
            <span className="font-medium text-xs">Change addresses</span>
            <p className="tabular-nums font-mono">{kaspa.addresses[1].length}</p>
          </div>
          <button className="btn btn-primary w-full" onClick={({ currentTarget }) => {
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
    </div>
  )
}