// world: "main" is not supported by CRX module, remove this when it gets support
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import content from "./content?script&module"

const script = document.createElement("script")
script.src = chrome.runtime.getURL(content)
script.type = "module"

document.head.prepend(script)
