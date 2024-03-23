import { useEffect, useState } from "react"

export default function useCoingecko (currency: string) {
  const [ price, setPrice ] = useState(0)

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=${currency}`).then(async res => {
      const response = await res.json()

      setPrice(response.kaspa.usd)
    })
  })

  return price
}
