import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import type { PropsWithChildren } from 'react'
import {
  createEntry as createEntryHelper,
  deleteEntry as deleteEntryHelper,
  mergeEntries,
  sortByUpdated,
  updateEntry as updateEntryHelper
} from './entries'
import { readStorage, writeStorage } from './storage'
import type { EntryDraft, JournalEntry } from './types'

type JournalContextValue = {
  entries: JournalEntry[]
  createEntry: (draft: EntryDraft) => JournalEntry
  updateEntry: (id: string, draft: EntryDraft) => JournalEntry | undefined
  deleteEntry: (id: string) => void
  importEntries: (incoming: JournalEntry[]) => void
  getEntryById: (id: string) => JournalEntry | undefined
}

const JournalContext = createContext<JournalContextValue | undefined>(undefined)

type JournalProviderProps = PropsWithChildren<{
  initialEntries?: JournalEntry[]
  persist?: boolean
}>

export const JournalProvider = ({
  children,
  initialEntries,
  persist = true
}: JournalProviderProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (initialEntries !== undefined) {
      return sortByUpdated(initialEntries)
    }

    return sortByUpdated(readStorage().entries)
  })

  useEffect(() => {
    if (!persist) {
      return
    }

    writeStorage(entries)
  }, [entries, persist])

  const createEntry = useCallback(
    (draft: EntryDraft): JournalEntry => {
      let created: JournalEntry | undefined

      setEntries((previous) => {
        const [nextEntries, entry] = createEntryHelper(previous, draft)
        created = entry
        return nextEntries
      })

      if (!created) {
        throw new Error('Failed to create journal entry')
      }

      return created
    },
    []
  )

  const updateEntry = useCallback(
    (id: string, draft: EntryDraft): JournalEntry | undefined => {
      let updated: JournalEntry | undefined

      setEntries((previous) => {
        const [nextEntries, entry] = updateEntryHelper(previous, id, draft)
        updated = entry
        return nextEntries
      })

      return updated
    },
    []
  )

  const deleteEntry = useCallback((id: string) => {
    setEntries((previous) => sortByUpdated(deleteEntryHelper(previous, id)))
  }, [])

  const importEntriesHandler = useCallback((incoming: JournalEntry[]) => {
    if (incoming.length === 0) {
      return
    }

    setEntries((previous) => mergeEntries(previous, incoming))
  }, [])

  const getEntryById = useCallback(
    (id: string) => entries.find((entry) => entry.id === id),
    [entries]
  )

  const value = useMemo<JournalContextValue>(
    () => ({
      entries,
      createEntry,
      updateEntry,
      deleteEntry,
      importEntries: importEntriesHandler,
      getEntryById
    }),
    [createEntry, deleteEntry, entries, getEntryById, importEntriesHandler, updateEntry]
  )

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
}

export const useJournal = (): JournalContextValue => {
  const context = useContext(JournalContext)

  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider')
  }

  return context
}
