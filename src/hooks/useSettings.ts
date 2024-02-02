import { useContext } from "react"
import LocalStorage from "../storage/LocalStorage"
import {
  ISettings,
  defaultSettings,
  SettingsContext
} from "../contexts/Settings"

class SettingsInterface {
  private state: ISettings
  private setState: React.Dispatch<React.SetStateAction<ISettings>>

  constructor(state: ISettings, setState: any) {
    this.state = state
    this.setState = setState
  }

  async load() {
    const settings = await LocalStorage.get("settings", defaultSettings)

    this.setState(settings)
  }

  get nodes() {
    return this.state.nodes
  }

  addNode(name: string, address: string) {
    // TODO: Address validation

    this.state.nodes.push({
      name,
      address,
      locked: false
    })
  }

  get selectedNode() {
    return this.state.selectedNode
  }

  changeNode(id: number) {
    if (typeof this.state.nodes[id] === "undefined") throw Error("Inexistent node")

    this.state.selectedNode = id
  }

  async sync() {
    await LocalStorage.set("settings", this.state)
  }
}

export default function useSettings() {
  const context = useContext(SettingsContext)

  if (!context) throw new Error("Missing Settings context")

  return new SettingsInterface(context.state, context.setState)
}
