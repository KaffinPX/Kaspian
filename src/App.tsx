import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './contexts/Settings'
import { KaspaProvider } from './contexts/Kaspa'
import { ThemeProvider } from '@/components/ThemeProvider'
import Landing from './pages/Landing'
import CreateWallet from '@/pages/CreateWallet'
import Wallet from '@/pages/Wallet'
import UnlockWallet from '@/pages/Unlock'

function App () {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <KaspaProvider>
          <MemoryRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/create" element={<CreateWallet />} />
              <Route path="/unlock" element={<UnlockWallet />} />
              <Route path="/wallet" element={<Wallet />} />
            </Routes>
          </MemoryRouter>
        </KaspaProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}

export default App
