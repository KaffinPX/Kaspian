import { SailboatIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import useKaspa from "@/hooks/useKaspa"
import { Textarea } from "@/components/ui/textarea"
import useURLParams from "@/hooks/useURLParams"

export default function ConnectDrawer () { 
  const kaspa = useKaspa()
  const [ hash, params ] = useURLParams()

  return (
    <Sheet defaultOpen={hash === 'connect'} onOpenChange={(open) => {
      if (open) return

      window.close()
    }}>
      <SheetContent side={"bottom"} className={"h-[60%]"}>
        <div className="mx-auto">
          <SheetHeader>
            <SheetTitle>Connection</SheetTitle>
            <SheetDescription>The website is requesting access to your wallet APIs.</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col p-4 pb-0 items-center gap-4">
            <p className={"text-sm font-semibold"}>URL</p>
            <Textarea
              defaultValue={params.get('url')!}
              className={"w-72 resize-none"}
              disabled={true}
            />
            <Button className={"gap-2"} onClick={() => {
              kaspa.request('provider:connect', [ params.get('url')! ]).then(() => {
                window.close()
              })
            }}>
              <SailboatIcon />
              Connect
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
