import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Landing from "@/pages/CreateWallet/Landing"
import Intro from "@/pages/CreateWallet/Intro"
import Create from "@/pages/CreateWallet/Create"
import Password from "@/pages/CreateWallet/Password"
import Import from "@/pages/CreateWallet/Import"
import useKaspa from "@/hooks/useKaspa"

export enum Tabs {
  Landing,
  Intro,
  Create,
  Import,
  Password
}

export default function CreateWallet () {
  const navigate = useNavigate()
  const { request } = useKaspa()

  const [ tab, setTab ] = useState(Tabs.Landing)
  const [ sensitive, setSensitive ] = useState("")
  const [ isImport, setIsImport ] = useState(false)

  return (
    {
      [ Tabs.Landing ]: <Landing forward={tab => { 
        if (tab === Tabs.Password) setIsImport(true)
        setTab(tab) 
      }} />,
      [ Tabs.Intro ]: <Intro onConfirm={() => { setTab(Tabs.Password) }} />,
      [ Tabs.Password ]: <Password onPasswordSet={async (password) => {
        if (isImport) {
          setSensitive(password)
          setTab(Tabs.Import)
        } else {
          const mnemonic = await request('wallet:create', [ password ])
          
          setSensitive(mnemonic)
          setTab(Tabs.Create)
        }
      }} />,
      [ Tabs.Import ]: <Import onMnemonicsSubmit={async (mnemonic) => {
        await request('wallet:import', [ mnemonic, sensitive ])

        navigate('/wallet')
      }} />,
      [ Tabs.Create ]: <Create mnemonic={sensitive} onSaved={() => { navigate('/wallet') }} />
    }[tab]
  )
}
