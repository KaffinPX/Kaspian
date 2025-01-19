import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"
import { PlusIcon, SearchIcon, SaveIcon } from "lucide-react"
import { useMemo, useState } from "react"

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
            <select className="select select-ghost" value={settings.selectedNode} onChange={(e) => {
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
          <div className="dropdown dropdown-center w-full">
            <button className="btn btn-outline w-full" tabIndex={0}>
              <PlusIcon />
              Add Node
            </button>
            <div tabIndex={0} className="dropdown-content card card-sm bg-base-200 z-1 w-48">
              <div className="card-body gap-1">
                <input
                  className="input input-xs"
                  value={name}
                  type={"text"}
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="input input-xs"
                  value={address} 
                  type={"text"} 
                  placeholder="Address (WebSockets)"
                  onChange={(e) => setAddress(e.target.value)}
                />
                <button className="btn btn-xs" disabled={name === "" || !addressValidity} onClick={() => {
                  updateSetting('nodes', [
                    ...settings.nodes, {
                      name,
                      address,
                      locked: false
                  }])
                  setName("")
                  setAddress("")
                }}>
                  <SaveIcon size={16}/>
                  Save
                </button>
              </div>
            </div>
          </div>
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
          <button className="btn btn-outline w-full" onClick={({ currentTarget }) => {
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