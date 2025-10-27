import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home'
import { JournalProvider } from '../../lib/journalContext'
import type { JournalEntry } from '../../lib/types'

const renderHome = (entries: JournalEntry[] = []) =>
  render(
    <MemoryRouter>
      <JournalProvider initialEntries={entries} persist={false}>
        <Home />
      </JournalProvider>
    </MemoryRouter>
  )

describe('Home route', () => {
  it('renders the new entry action and existing entries', () => {
    const sample: JournalEntry = {
      id: '1',
      title: 'First Log',
      content: 'Time to write in style',
      tags: ['retro'],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    renderHome([sample])

    expect(screen.getByText(/New Entry/i)).toBeInTheDocument()
    expect(screen.getByText(/First Log/i)).toBeInTheDocument()
  })
})
