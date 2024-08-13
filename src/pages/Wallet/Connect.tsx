import { i18n } from "webextension-polyfill"
import { SailboatIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import useURLParams from "@/hooks/useURLParams"
import useKaspa from "@/hooks/useKaspa"

export default function ConnectDrawer () { 
  const { request } = useKaspa()
  const [ hash, params ] = useURLParams()

  return (
    <Sheet defaultOpen={hash === 'connect'} onOpenChange={(open) => {
      if (open) return

      window.close()
    }}>
      <SheetContent side={"bottom"} className={"h-[60%]"}>
        <div className="mx-auto">
          <SheetHeader>
            <SheetTitle>{i18n.getMessage('connection')}</SheetTitle>
            <SheetDescription>{i18n.getMessage('connectionDescription')}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col p-4 pb-0 items-center gap-4">
            <p className={"text-sm font-semibold"}>{i18n.getMessage('URL')}</p>
            <Textarea
              defaultValue={params.get('url')!}
              className={"w-72 resize-none"}
              disabled={true}
            />
            <Button className={"gap-2"} onClick={() => {
              request('provider:connect', [ params.get('url')! ]).then(() => {
                window.close()
              })
            }}>
              <SailboatIcon />
              {i18n.getMessage('connect')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
