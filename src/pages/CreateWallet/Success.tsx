import { useNavigate } from "react-router-dom"
import { i18n } from "webextension-polyfill"
import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { ArrowRightCircle } from "lucide-react"

export default function Success () {
  const navigate = useNavigate()

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={i18n.getMessage('success')}
        subtitle={i18n.getMessage('welcoming')}
      />
      <div className={"mx-auto"}>
        <img
          src={"https://www.svgrepo.com/show/395996/cheese-wedge.svg"}
          className={"animate-spin w-72 h-72"}
        />
      </div>
      <div className={"mx-auto"}>
        <Button
          onClick={() => {
            navigate("/wallet")
          }}
          className={"gap-2"}
        >
          <ArrowRightCircle />
          {i18n.getMessage('continue')}
        </Button>
      </div>
    </main>
  )
}
