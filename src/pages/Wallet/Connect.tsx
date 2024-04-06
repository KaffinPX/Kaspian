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
import { useEffect } from "react"

export default function ConnectDrawer () {
  const kaspa = useKaspa()
  const searchParams = new URLSearchParams(window.location.search)

  useEffect(() => { // TODO: Move it to a more proper location
    const onBeforeUnload = () => {
      if (window.location.hash !== '#connect') return

      kaspa.request('api:disconnect', [])
    }
  
    window.addEventListener('beforeunload', onBeforeUnload)
  
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [])

  return (
    <Sheet open={window.location.hash === '#connect'} onOpenChange={(open) => {
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
              defaultValue={searchParams.get('url')!}
              className={"w-72 resize-none"}
              disabled={true}
            />
            <Button className={"gap-2"} onClick={() => {
              kaspa.request('api:connect', [ searchParams.get('url')! ]).then(() => {
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
