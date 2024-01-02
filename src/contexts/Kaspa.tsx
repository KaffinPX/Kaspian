import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react"

export const KaspaContext = createContext(null)

export function KaspaProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState(null)
  const [state, _update] = useState({
    error: null,
    locked: true,
    address: null,
    addresses: [],
    addressesInfo: {},
    currentAccountIndex: null
  })
  const update = a => _update(b => ({ ...b, ...a }))

  useEffect(() => {
    const load = async () => {
      try {
        const state = await send("boot")
        update(state)
      } catch (e) {
        setError(e)
        return
      }
    }

    load()
  }, [])

  async function unlock(password) {
    try {
      update(await send("unlock", { password }))
    } catch (e) {
      setError(e)
    }
  }

  async function register(password) {
    try {
      return await send("register", { password })
    } catch (e) {
      setError(e)
    }
  }

  async function importAccount(mnemonic, password) {
    try {
      return await send("importAccount", { mnemonic, password })
    } catch (e) {
      setError(e)
    }
  }

  async function lock() {
    try {
      update(await send("lock"))
    } catch (e) {
      setError(e)
    }
  }

  async function logOut() {
    try {
      update(await send("logOut"))
    } catch (e) {
      setError(e)
    }
  }

  async function createAccount() {
    try {
      update(await send("createAccount"))
    } catch (e) {
      setError(e)
    }
  }

  async function switchAccount(address) {
    try {
      update(await send("switchAccount", { address }))
    } catch (e) {
      setError(e)
    }
  }

  async function saveAccountName(address, name) {
    try {
      update(await send("saveAccountName", { address, name }))
    } catch (e) {
      setError(e)
    }
  }

  async function addNetwork(name, rpcUrl, blockExplorerUrl) {
    try {
      update(await send("addNetwork", { name, rpcUrl, blockExplorerUrl }))
    } catch (e) {
      setError(e)
    }
  }

  async function openPage({ route, queryString }) {
    let extensionURL = chrome.runtime.getURL("popup.html")
    if (route) {
      extensionURL += `#${route}`
    }
    if (queryString) {
      extensionURL += `?${queryString}`
    }
    await chrome.tabs.create({ url: extensionURL })
    window.close()
  }

  async function openImportPage() {
    await openPage({ route: "import" })
  }

  async function openRegisterPage() {
    await openPage({ route: "register" })
  }

  return (
    <KaspaContext.Provider
      value={{
        ...state,
        error,
        setError,
        unlock,
        register,
        importAccount,
        lock,
        logOut,
        createAccount,
        switchAccount,
        saveAccountName,
        addNetwork,
        openImportPage,
        openRegisterPage
      }}
    >
      {children}
    </KaspaContext.Provider>
  )
}

export function useKaspa() {
  const context = useContext(KaspaContext)

  if (!context) {
    throw new Error("Missing Kaspa context")
  }

  return context
}
