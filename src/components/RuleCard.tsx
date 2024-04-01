import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

interface RuleCardProps {
  title: string
  description: string
  children: React.ReactNode
}

export default function RuleCard(props: RuleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className={"flex justify-center align-middle"}>
        {props.children}
      </CardContent>
    </Card>
  )
}
