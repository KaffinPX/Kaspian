import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './contexts/Settings'
import { KaspaProvider } from './contexts/Kaspa'
import Landing from './pages/Landing'
function App () {
  return (
    <SettingsProvider>
      <KaspaProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </MemoryRouter>
      </KaspaProvider>
    </SettingsProvider>
  )
}

export default App
