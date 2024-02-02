import { MemoryRouter, Route, Routes } from 'react-router-dom'

import Landing from './pages/Landing'
import { SettingsProvider } from './contexts/Settings'
import { ThemeProvider } from '@/components/ThemeProvider'
import CreateWallet from '@/pages/CreateWallet'
import Wallet from '@/pages/Wallet'
import UnlockWallet from '@/pages/Unlock'

function App () {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateWallet />} />
            <Route path="/unlock" element={<UnlockWallet />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </MemoryRouter>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App
