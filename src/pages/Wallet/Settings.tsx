import { runtime } from "webextension-polyfill"
import { SettingsIcon } from "lucide-react"
import GeneralCategory from "./Settings/General"
import AccountCategory from "./Settings/Account"
import WalletCategory from "./Settings/Wallet"

export default function Settings () {
  return (
    <div className="drawer drawer-end z-[1] w-max">
      <input id="settings-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content justify-end">
        <label htmlFor="settings-drawer" className="btn btn-circle drawer-button">
          <SettingsIcon />
        </label>
      </div>
      <div className="drawer-side align-middle">
        <label htmlFor="settings-drawer" className="drawer-overlay"></label>
        <ul className="menu bg-base-300 text-base-content rounded-l-box min-h-full w-62 p-4">
          <h3 className="text-xl font-extrabold tracking-tight text-center">
            Settings
          </h3>
          <GeneralCategory />
          <AccountCategory />
          <WalletCategory />
          <p className="fixed bottom-4 font-bold">
            Kaspian {runtime.getManifest().version}
          </p>
        </ul>
      </div>
    </div>
  )
}