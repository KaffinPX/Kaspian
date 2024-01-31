import Heading from "@/components/Heading"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRightCircle } from "lucide-react"
import { i18n } from "webextension-polyfill"

export default function Password ({ onPasswordSet }: {
  onPasswordSet: () => void
}) {
  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={i18n.getMessage('setPassword')}
        subtitle={i18n.getMessage('passwordDescription')}
      />
      <div className={"flex flex-col w-60 gap-3 mx-auto"}>
        <Input type={"password"} placeholder={i18n.getMessage('password')} />
        <Input type={"password"} placeholder={i18n.getMessage('confirmPassword')} />
      </div>
      <div className={"mx-auto"}>
        <Button
          onClick={() => {
            onPasswordSet()
            // FIXME - Placeholder
          }}
          className={"gap-2"}
        >
          <ArrowRightCircle />
          {i18n.getMessage('confirm')}
        </Button>
      </div>
    </main>
  )
}
