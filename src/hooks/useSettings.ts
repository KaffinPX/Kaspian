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

  constructor (state: ISettings, setState: any) {
    this.state = state
    this.setState = setState
  }

  async load () {
    const settings = await LocalStorage.get("settings", defaultSettings)

    this.setState(settings)
  }

  get nodes () { return this.state.nodes }
  get selectedNode () { return this.state.selectedNode }

  async addNode (name: string, address: string) {
    // TODO: Address validation

    const nodeList = [
      ...this.state.nodes,
      {
        name,
        address,
        locked: false
      }
    ]

    await this.updateState('nodes', nodeList)
  }

  async changeNode (id: number) {
    if (typeof this.state.nodes[id] === "undefined") throw Error("Inexistent node")

    await this.updateState('selectedNode', id)
  }

  private async updateState <K extends keyof ISettings>(key: K, value: ISettings[K]) {
    this.setState({
      ...this.state,
      [ key ]: value
    })

    await LocalStorage.set("settings", this.state)
  }
}

export default function useSettings () {
  const context = useContext(SettingsContext)

  if (!context) throw new Error("Missing Settings context")

  return new SettingsInterface(context.state, context.setState)
}
