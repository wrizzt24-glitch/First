import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import { JournalProvider } from './lib/journalContext'
import EntryEdit from './routes/EntryEdit'
import EntryView from './routes/EntryView'
import Home from './routes/Home'
import './styles/components/layout.css'

const CRT_STORAGE_KEY = 'journal.crt.enabled'

const App = () => {
  const [crtEnabled, setCrtEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      const stored = window.localStorage.getItem(CRT_STORAGE_KEY)
      return stored === 'true'
    } catch (error) {
      console.warn('CRT preference unavailable', error)
      return false
    }
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('crt-enabled', crtEnabled)
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(CRT_STORAGE_KEY, String(crtEnabled))
      } catch (error) {
        console.warn('Unable to persist CRT preference', error)
      }
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('crt-enabled')
      }
    }
  }, [crtEnabled])

  const toggleCrt = () => setCrtEnabled((previous) => !previous)

  return (
    <JournalProvider>
      <div className="app-shell">
        <Header crtEnabled={crtEnabled} onToggleCrt={toggleCrt} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<EntryEdit />} />
            <Route path="/edit/:id" element={<EntryEdit />} />
            <Route path="/entry/:id" element={<EntryView />} />
          </Routes>
        </main>
      </div>
    </JournalProvider>
  )
}

export default App
