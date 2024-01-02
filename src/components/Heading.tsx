import { Separator } from "@/components/ui/separator"
import { clsx } from "clsx"
interface PageHeadingProps {
  title: string
  subtitle?: string
  underLineClassName?: string
}
export default function Heading(props: PageHeadingProps) {
  return (
    <div className={"px-4"}>
      <h1 className={"text-4xl font-bold text-left"}>{props.title}</h1>
      <Separator
        className={clsx(
          "w-28 mb-1 border-2",
          props.underLineClassName ? props.underLineClassName : "border-primary"
        )}
      />
      {props.subtitle !== undefined ? (
        <h2 className={"text-lg text-left"}>{props.subtitle}</h2>
      ) : null}
    </div>
  )
}
