import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { i18n } from "webextension-polyfill"
import { useTheme } from "@/components/ThemeProvider"
import { Sun, Moon, Laptop } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function General () {
  const theme = useTheme()

  return (
    <AccordionItem value="general">
      <AccordionTrigger>{i18n.getMessage('general')}</AccordionTrigger>
      <AccordionContent>
        <div className={"flex flex-col gap-2"}>
          <div className={"px-3"}>
            <h3 className={"font-bold"}>{i18n.getMessage('theme')}</h3>
            <h4>{i18n.getMessage('themeDescription')}</h4>
          </div>
          <div className={"flex gap-1"}>
            <ToggleGroup
              type="single"
              defaultValue={theme.theme}
              onValueChange={(value) => {
                theme.setTheme(value as never)
              }}
            >
              <ToggleGroupItem value="light">
                <Sun />
              </ToggleGroupItem>
              <ToggleGroupItem value="dark">
                <Moon />
              </ToggleGroupItem>
              <ToggleGroupItem value="system">
                <Laptop />
              </ToggleGroupItem>
            </ToggleGroup>

            {/* price provider + type */}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}