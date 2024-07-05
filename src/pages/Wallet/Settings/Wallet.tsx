import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import NodePopup from "@/pages/Wallet/Settings/Wallet/Node"
import ExportPopup from "@/pages/Wallet/Settings/Wallet/Export"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import useSettings from "@/hooks/useSettings"

export default function Network () {
  const { settings, updateSetting } = useSettings()
  const { kaspa, request } = useKaspa()

  return (
    <AccordionItem value="wallet">
      <AccordionTrigger>{i18n.getMessage('wallet')}</AccordionTrigger>
      <AccordionContent>
        <div className={"flex flex-col gap-2"}>
          <div className={"px-3"}>
            <h3 className={"flex gap-2 font-bold"}>
              {i18n.getMessage('node')}
              <Badge variant={"outline"} className={kaspa.connected ? "text-green-500" : 'text-red-500'}>
                {kaspa.connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </h3>
            <h4>{i18n.getMessage('nodeDescription')}</h4>
          </div>
          <div className={"flex gap-1 mx-1"}>
            <Select defaultValue={settings.selectedNode.toString()} 
              onValueChange={async (id) => {
                await updateSetting('selectedNode', parseInt(id))
                await request('node:connect', [ settings.nodes[parseInt(id)].address ])
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="h-64">
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
            <NodePopup />
          </div>
          <div className={"px-3"}>
            <h3 className={"flex gap-2 font-bold"}>
              {"Mnemonic"}
            </h3>
            <h4>Backup the only way to import your wallet again</h4>
          </div>
          <div className={"flex gap-1 mx-1"}>
            <ExportPopup />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}