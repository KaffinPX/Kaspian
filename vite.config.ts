import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { ManifestV3Export, crx } from "@crxjs/vite-plugin"
import tailwindcss from '@tailwindcss/vite'
import path from "path"

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "Kaspian",
  version: "0.0.0.5",
  icons: {
    512: "public/favicon.png"
  },
  action: {
    default_popup: "index.html"
  },
  background: {
    service_worker: "src/wallet/index.ts",
    type: "module"
  },
  content_scripts: [{
    matches: [ "<all_urls>" ],
    js: [ "src/provider" ],
    run_at: "document_start"
  }],
  permissions: [ "storage", "alarms", "notifications" ],
  // this is an ID for firefox, but the `ManifestV3Export` type doesn't have it
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  browser_specific_settings: {
    gecko: {
      id: "wallet@kaspian.dev"
    }
  },
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
  },
  default_locale: "en"
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ 
    react(),
    tailwindcss(),
    crx({ manifest })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    strictPort: true,
    hmr: {
      clientPort: 3000,
    },
    port: 3000
  }
})
