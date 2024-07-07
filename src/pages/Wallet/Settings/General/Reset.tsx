import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useKaspa from "@/hooks/useKaspa"
import { i18n } from "webextension-polyfill"

export default function Reset () {
  const kaspa = useKaspa()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>{i18n.getMessage('resetButton')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.getMessage('resetTitle')}</DialogTitle>
          <DialogDescription>
            {i18n.getMessage('resetDescription')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" variant={"destructive"} onClick={async () => {
            await kaspa.request('wallet:reset', [])
          }}>{i18n.getMessage('confirm')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}