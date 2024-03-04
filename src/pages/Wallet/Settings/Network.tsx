import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import NodeDrawer from "@/pages/Wallet/Settings/Node"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"

export default function Network () {
  const settings = useSettings()
  const kaspa = useKaspa()

  return (
    <AccordionItem value="network">
      <AccordionTrigger>{i18n.getMessage('network')}</AccordionTrigger>
      <AccordionContent>
        <div className={"flex flex-col gap-2"}>
          <div className={"px-3"}>
            <h3 className={"font-bold"}>{i18n.getMessage('node')}</h3>
            <h4>{i18n.getMessage('nodeDescription')}</h4>
          </div>
          <div className={"flex gap-1 mx-1"}>
            <Select defaultValue={settings.selectedNode.toString()} 
              onValueChange={async (id) => {
                await kaspa.request('node:connect', [ settings.nodes[parseInt(id)].address ])
                await settings.changeNode(parseInt(id))
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settings.nodes.map((node, id) => {
                  return (
                    <SelectItem key={id} value={id.toString()}>
                      {node.name}
                      <p className={"text-xs"}>{node.address}</p>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <NodeDrawer /> {/* Possibly remove and make it a popup */}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}