import { useEffect, useState } from "react"
import { i18n } from "webextension-polyfill"
import {
  ArrowRightCircle,
  BookUser,
  ChevronRight,
  DatabaseBackup,
  MonitorOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Heading"
import { type CarouselApi, Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export default function Intro ({ onConfirm }: {
  onConfirm: () => void 
}) {
  const [ api, setApi ] = useState<CarouselApi>()
  const [ step, setStep ] = useState(1)

  useEffect(() => {
    if (!api) return

    api.on("slidesInView", () => {
      const currentSlide = api.slidesInView()

      setStep(currentSlide[0] + 1)
    })
  }, [ api ])

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={i18n.getMessage('createWallet')}
        subtitle={i18n.getMessage('rules')}
      />
      <div>
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem>
              <div className={"mx-auto text-center px-3"}>
                <DatabaseBackup className={"w-8 h-8 mx-auto text-green-400"} />
                <h3 className={"text-xl"}>{i18n.getMessage('backupWallet')}</h3>
                <p className={"text-sm"}>{i18n.getMessage('selfCustody')}</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className={"mx-auto text-center px-3"}>
                <MonitorOff className={"w-8 h-8 mx-auto text-green-400"} />
                <h3 className={"text-xl"}>{i18n.getMessage('shareMnemonic')}</h3>
                <p className={"text-sm"}>{i18n.getMessage('walletAccess')}</p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className={"mx-auto text-center px-3"}>
                <BookUser className={"w-8 h-8 mx-auto text-green-400"} />
                <h3 className={"text-xl"}>{i18n.getMessage('verifyAddresses')}</h3>
                <p className={"text-sm"}>{i18n.getMessage('immutability')}</p>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      <div className={"mx-auto"}>
        <Button onClick={() => {
          if (step === 3) {
            onConfirm()
          }
          
          api!.scrollNext()
        }} className={"gap-2"}>
          {{
            1: <ChevronRight className={"w-6 h-6"} />,
            2: <ChevronRight className={"w-6 h-6"} />,
            3: <ArrowRightCircle className={"w-6 h-6"} />
          }[step]}
          {{
            1: i18n.getMessage('next'),
            2: i18n.getMessage('next'),
            3: i18n.getMessage('continue')
          }[step]}
        </Button>
      </div>
    </main>
  )
}
