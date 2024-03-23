import { useEffect, useState } from "react"

export default function useCoingecko () {
  const [ price, setPrice ] = useState(0.00)

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd").then(async res => {
      const response = await res.json()
      setPrice(response.kaspa.usd)
    })
  })

  return price
}
