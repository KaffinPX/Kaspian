import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button"
import { ArrowRightCircle } from "lucide-react"

export default function Success() {
  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Success"}
        subtitle={
          "It's about to get exciting. You're all set up and ready to go!"
        }
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
            // FIXME - Placeholder
          }}
          className={"gap-2"}
        >
          <ArrowRightCircle />
          Continue
        </Button>
      </div>
    </main>
  )
}
