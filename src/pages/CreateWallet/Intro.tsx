import {
  ArrowRightCircle,
  BookUser,
  ChevronRight,
  DatabaseBackup,
  MonitorOff
} from "lucide-react"
import { useEffect, useState } from "react"
import { clsx } from "clsx"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import Heading from "@/components/Heading"
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
export default function Intro({ onConfirm }: { onConfirm: () => void }) {
  const [api, setApi] = useState<CarouselApi>()
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  useEffect(() => {
    if (!api) return
    console.log("api")
    api.on("slidesInView", () => {
      const currentSlide = api.slidesInView()
      console.log(`Step ${currentSlide[0]}`)
      setStep(currentSlide[0] + 1)
    })
  }, [api])
  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Create Wallet"}
        subtitle={
          "This journey will be exciting, but you have to follow some rules."
        }
      />
      <div className={"px-4"}>
        {/* @ts-ignore */}
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem>
              <div className={clsx("mx-auto px-5 text-center")}>
                <DatabaseBackup className={"w-8 h-8 mx-auto text-green-400"} />
                <h3 className={"text-xl"}>Back up your wallet</h3>
                <p className={"text-sm"}>
                  Your wallet is stored locally on your device. If you lose
                  access to your device, or forget the password, you won't be
                  able to recover your wallet without your mnemonic phrase.
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className={clsx("mx-auto px-5 text-center")}>
                <MonitorOff className={"w-8 h-8 mx-auto text-green-400"} />
                <h3 className={"text-xl"}>Never share your mnemonic phrase</h3>
                <p className={"text-sm"}>
                  Your mnemonic phrase is the key to your wallet. Anyone who has
                  access to it can steal your funds.
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className={clsx("mx-auto px-5 text-center")}>
                <BookUser className={"w-8 h-8 mx-auto text-green-400"} />
                <h3 className={"text-xl"}>Verify the addresses you send to</h3>
                <p className={"text-sm"}>
                  Always verify the address you are sending to. If you send to
                  the wrong address, your funds will be lost forever.
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      <div className={"mx-auto"}>
        <Button
          onClick={() => {
            if (step === 3) {
              onConfirm()
            }
            api!.scrollNext()
          }}
          className={"gap-2"}
        >
          {
            {
              1: <ChevronRight className={"w-6 h-6"} />,
              2: <ChevronRight className={"w-6 h-6"} />,
              3: <ArrowRightCircle className={"w-6 h-6"} />
            }[step]
          }
          {
            {
              1: "Next",
              2: "Next",
              3: "Continue"
            }[step]
          }
        </Button>
      </div>
    </main>
  )
}
