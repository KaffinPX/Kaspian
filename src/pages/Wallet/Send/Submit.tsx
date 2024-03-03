import { Network } from "lucide-react"
import { Input } from "@/components/ui/input"
import { i18n } from "webextension-polyfill"
import useKaspa from "@/hooks/useKaspa"
import { useState } from "react"
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Summary } from "@/wallet/controller/account"
import { Button } from "@/components/ui/button"


export default function Submit ({ onSubmitted }: {
  onSubmitted: () => void
}) {
  const kaspa = useKaspa()

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Submit Transaction</AlertDialogTitle>
        <AlertDialogDescription>
          Submit your signed transaction to network, miners will add it to a block.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button className={"gap-2"} onClick={async () => {
          await kaspa.request('account:submitSigned', [])

          onSubmitted()
        }}>
          <Network />
          Submit
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
