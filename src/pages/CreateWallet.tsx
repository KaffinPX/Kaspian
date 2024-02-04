import { useState } from "react"

import Landing from "@/pages/CreateWallet/Landing"
import Intro from "@/pages/CreateWallet/Intro"
import Create from "@/pages/CreateWallet/Create"
import Password from "@/pages/CreateWallet/Password"
import Success from "@/pages/CreateWallet/Success"
import Import from "@/pages/CreateWallet/Import"

export enum Tabs {
  Landing,
  Intro,
  Create,
  Import,
  Password,
  Success
}

export default function CreateWallet () {
  const [tab, setTab] = useState(Tabs.Landing)
  const [mnemonics, setMnemonics] = useState<string | undefined>(undefined)

  return (
    <>
      {tab === Tabs.Landing && (
        <Landing forward={tab => {
          setTab(tab)
        }}/>
      )}
      {tab === Tabs.Intro && (
        <Intro onConfirm={() => {
          setMnemonics("wawa") // FIXME generate mnemonics

          setTab(Tabs.Create)
        }}/>
      )}
      {typeof mnemonics !== "undefined" && tab === Tabs.Create && (
        <Create
          mnemonics={mnemonics}
          onSaved={() => {
            setTab(Tabs.Password)
          }}
        />
      )}
      {tab === Tabs.Import && (
        <Import
          onMnemonicsSubmit={mnemonics => {
            // FIXME save the mnemonics
            setTab(Tabs.Password)
          }}
        />
        // TODO
      )}
      {tab === Tabs.Password && (
        <Password
          onPasswordSet={() => {
            setTab(Tabs.Success)
          }}
        /> // TODO
      )}
      {tab === Tabs.Success && (
        <Success />
        // TODO
      )}
    </>
  )
}
