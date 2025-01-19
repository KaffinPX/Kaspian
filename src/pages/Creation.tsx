import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useKaspa from "@/hooks/useKaspa"
import Landing from "@/pages/Creation/Landing"
import Create from "@/pages/Creation/Create"
import Password from "@/pages/Creation/Password"
import Import from "@/pages/Creation/Import" 

export enum Tabs {
  Landing,
  Create,
  Import,
  Password
}

export default function Creation () {
  const navigate = useNavigate()
  const { request } = useKaspa()

  const [ tab, setTab ] = useState(Tabs.Landing)
  const [ mnemonic, setMnemonic ] = useState("")

  return (
    {
      [ Tabs.Landing ]: <Landing forward={tab => { 
        setTab(tab) 
      }} />,
      [ Tabs.Import ]: <Import onSubmit={(mnemonic) => {
        setMnemonic(mnemonic)
        setTab(Tabs.Password)
      }} />,
      [ Tabs.Password ]: <Password onSet={async (password) => {
        if (mnemonic) {
          await request('wallet:import', [ mnemonic, password ])

          navigate('/wallet')  
        } else {
          const mnemonic = await request('wallet:create', [ password ])

          setMnemonic(mnemonic)
          setTab(Tabs.Create)
        }
      }} />,
      [ Tabs.Create ]: <Create mnemonic={mnemonic} onSaved={() => navigate('/wallet')} />
    }[ tab ]
  )
}