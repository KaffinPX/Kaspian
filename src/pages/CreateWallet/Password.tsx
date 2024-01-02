import Heading from "@/components/Heading"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRightCircle } from "lucide-react"

export default function Password({
  onPasswordSet
}: {
  onPasswordSet: () => void
}) {
  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Set password"}
        subtitle={
          "Time to set a password. This password will be used to encrypt your wallet."
        }
      />
      <div className={"flex flex-col w-60 gap-3 mx-auto"}>
        <Input type={"password"} placeholder={"Password"} />
        <Input type={"password"} placeholder={"Confirm password"} />
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
          Continue
        </Button>
      </div>
    </main>
  )
}
