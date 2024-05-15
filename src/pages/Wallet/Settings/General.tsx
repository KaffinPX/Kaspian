import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { i18n } from "webextension-polyfill"
import { useTheme } from "@/components/ThemeProvider"
import { Sun, Moon, Laptop } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { currencies } from "@/contexts/Settings"
import useSettings from "@/hooks/useSettings"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function General () {
  const { settings, updateSetting } = useSettings()
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
                if (value === "") return

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
          </div>
          <div className={"px-3"}>
            <h3 className={"flex gap-2 font-bold"}>Currency</h3>
            <h4>Change preferred exchange currency of wallet</h4>
          </div>
          <div className={"flex gap-1 mx-1"}>
            <Select defaultValue={settings.currency} 
              onValueChange={async (currency) => {
                updateSetting('currency', currency as never)
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(currencies).map((currency) => {
                  return (
                    <SelectItem key={currency} value={currency}>
                      {currency} ({currencies[currency as never]})
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}