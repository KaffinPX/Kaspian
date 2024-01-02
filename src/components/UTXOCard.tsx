import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/smaller-card"
import nf from "@/lib/numberFormatter"
interface UTXOCardProps {
  amount: number
  value: number
  txId: string
  address: string
}

export default function UTXOCard(props: UTXOCardProps) {
  return (
    <Card className={"break-all mx-4"}>
      <CardHeader>
        <CardTitle className={"text-base"}>
          {props.amount} KAS ({nf.format(props.value)})
        </CardTitle>
        <CardDescription className={"text-xs"}>{props.txId}</CardDescription>
      </CardHeader>
      <CardFooter className={"text-primary font-bold"}>
        {props.address}
      </CardFooter>
    </Card>
  )
}
