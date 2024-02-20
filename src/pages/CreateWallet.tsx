import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useKaspa from "@/hooks/useKaspa"

import Landing from "@/pages/CreateWallet/Landing"
import Intro from "@/pages/CreateWallet/Intro"
import Create from "@/pages/CreateWallet/Create"
import Password from "@/pages/CreateWallet/Password"
import Import from "@/pages/CreateWallet/Import"

export enum Tabs {
  Landing,
  Intro,
  Create,
  Import,
  Password
}

export default function CreateWallet () {
  const [ tab, setTab ] = useState(Tabs.Landing)
  const [ mnemonic, setMnemonic ] = useState<string | undefined>()
  const [ password, setPassword ] = useState<string | undefined>()

  const navigate = useNavigate()
  const kaspa = useKaspa()

  return (
    <>
      {tab === Tabs.Landing && (
        <Landing forward={tab => {
          setTab(tab)
        }}/>
      )}
      {tab === Tabs.Intro && (
        <Intro onConfirm={() => {
          setTab(Tabs.Password)
        }}/>
      )}
      {tab === Tabs.Password && (
        <Password onPasswordSet={async (password) => {
          if (!mnemonic) {
            const generatedMnemonic = await kaspa.request('wallet:create', [ password ])

            setMnemonic(generatedMnemonic)
            setTab(Tabs.Create)
          } else {
            setPassword(password)
            setTab(Tabs.Import)
          }
        }} />
      )}
      {tab === Tabs.Import && (
        <Import
          onMnemonicsSubmit={async (mnemonic) => {
            await kaspa.request('wallet:import', [ password!, mnemonic ])

            navigate("/")
          }}
        />
      )}
      {tab === Tabs.Create && (
        <Create
          mnemonic={mnemonic!}
          onSaved={() => {
            navigate("/")
          }}
        />
      )}
    </>
  )
}
