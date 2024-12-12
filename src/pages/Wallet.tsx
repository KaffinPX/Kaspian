import { useState } from "react"
import { useNavigate } from "react-router-dom"
import useKaspa from "@/hooks/useKaspa"
import Summary from "./Wallet/Summary"

export enum Tabs {
  Summary
}

export default function Creation () {
  const navigate = useNavigate()
  const { kaspa, request } = useKaspa()

  const [ tab, setTab ] = useState(Tabs.Summary)

  return (
    {
      [ Tabs.Summary ]: <Summary forward={tab => { 
        setTab(tab) 
      }} />,
    }[ tab ]
  )
}