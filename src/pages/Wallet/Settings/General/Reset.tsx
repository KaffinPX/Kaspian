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

export default function Reset () {
  const kaspa = useKaspa()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Reset wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone and Kaspian cant help you to get your wallet back.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" variant={"destructive"} onClick={async () => {
            await kaspa.request('wallet:reset', [])
          }}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}