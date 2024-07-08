import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import useKaspa from "@/hooks/useKaspa"
import { Button } from "@/components/ui/button"
import { i18n } from "webextension-polyfill"

export default function Network () {
  const { kaspa, request } = useKaspa()

  return (
    <AccordionItem value="account">
      <AccordionTrigger>{i18n.getMessage('account')}</AccordionTrigger>
      <AccordionContent>
        <div className={"flex flex-col gap-2"}>
          <div className={"px-3"}>
            <h3 className={"flex gap-2 font-bold"}>
            {i18n.getMessage('addressTitle')}
            </h3>
            <h4>{i18n.getMessage('addressDescription')}</h4>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center px-4 py-2 bg-card rounded-md">
              <span className="font-medium">{i18n.getMessage('addressReceive')}</span>
              <p className="tabular-nums font-mono">{kaspa.addresses[0].length}</p>
            </div>
            <div className="flex justify-between items-center px-4 py-2 bg-card rounded-md">
              <span className="font-medium">{i18n.getMessage('addressChange')}</span>
              <p className="tabular-nums font-mono">{kaspa.addresses[1].length}</p>
            </div>
          </div>
          <Button variant={"outline"} onClick={({ currentTarget }) => {
            currentTarget.disabled = true

            request('account:scan', []).then(() => {
              currentTarget.disabled = false
            })
          }}>{i18n.getMessage('scan')}</Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}