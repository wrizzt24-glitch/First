import { beforeEach, describe, expect, it } from 'vitest'
import {
  STORAGE_KEY,
  STORAGE_VERSION,
  clearStorage,
  parseEntries,
  readStorage,
  serializeEntries,
  writeStorage
} from '../storage'
import type { JournalEntry } from '../types'

const createEntry = (overrides: Partial<JournalEntry> = {}): JournalEntry => ({
  id: 'entry-1',
  title: 'Rad Day',
  content: 'Skated at the arcade all afternoon.',
  tags: ['arcade', 'skate'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides
})

beforeEach(() => {
  localStorage.clear()
})

describe('storage utilities', () => {
  it('persists and restores entries', () => {
    const entry = createEntry()
    writeStorage([entry])

    const payload = readStorage()

    expect(payload.version).toBe(STORAGE_VERSION)
    expect(payload.entries).toHaveLength(1)
    expect(payload.entries[0]).toMatchObject({ id: entry.id, title: entry.title })
  })

  it('returns empty payload when version mismatches', () => {
    const snapshot = {
      version: STORAGE_VERSION + 1,
      entries: [createEntry({ id: 'old-id' })]
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))

    const payload = readStorage()
    expect(payload.entries).toHaveLength(0)
  })

  it('parses raw JSON payloads safely', () => {
    const entry = createEntry({ id: 'imported' })
    const json = serializeEntries([entry])

    const imported = parseEntries(json)
    expect(imported).toHaveLength(1)
    expect(imported[0]).toMatchObject({ id: 'imported' })
  })

  it('ignores malformed entries when parsing', () => {
    const items = parseEntries({ entries: [{}, createEntry({ id: 'valid', tags: ['ok', 'ok'] })] })
    expect(items).toHaveLength(1)
    expect(items[0].tags).toEqual(['ok'])
  })

  it('clears stored entries', () => {
    writeStorage([createEntry()])
    clearStorage()

    expect(readStorage().entries).toHaveLength(0)
  })
})
