import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './contexts/Settings'
import { KaspaProvider } from './contexts/Kaspa'
import Landing from './pages/Landing'
import Creation from './pages/Creation'
import Unlock from './pages/Unlock'
import Wallet from './pages/Wallet'

function App () {
  return (
    <SettingsProvider>
      <KaspaProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/creation" element={<Creation />} />
            <Route path="/unlock" element={<Unlock />} />
            <Route path="/wallet" element={<Wallet />} />
          </Routes>
        </MemoryRouter>
      </KaspaProvider>
    </SettingsProvider>
  )
}

export default App
