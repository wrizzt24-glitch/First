import { describe, expect, it } from 'vitest'
import {
  createEntry,
  deleteEntry,
  mergeEntries,
  tagsFromString,
  updateEntry
} from '../entries'
import type { JournalEntry } from '../types'

const sampleEntry = (overrides: Partial<JournalEntry> = {}): JournalEntry => ({
  id: 'alpha',
  title: 'Untitled Entry',
  content: 'Hello world',
  tags: ['retro'],
  createdAt: 1,
  updatedAt: 1,
  ...overrides
})

describe('entries helpers', () => {
  it('creates an entry with normalized tags', () => {
    const [entries, created] = createEntry([], {
      title: '  Neon Dreams  ',
      content: 'Living in vibrant color',
      tags: [' synth ', 'synth', 'wave']
    })

    expect(entries).toHaveLength(1)
    expect(created.title).toBe('Neon Dreams')
    expect(created.tags).toEqual(['synth', 'wave'])
  })

  it('updates an entry and refreshes the timestamp', () => {
    const original = sampleEntry({ updatedAt: 1 })
    const [entries, updated] = updateEntry([original], 'alpha', {
      title: 'Updated',
      content: 'New content',
      tags: ['arcade']
    })

    expect(entries).toHaveLength(1)
    expect(updated?.title).toBe('Updated')
    expect(updated?.tags).toEqual(['arcade'])
    expect(updated && updated.updatedAt).toBeGreaterThan(original.updatedAt)
  })

  it('deletes an entry', () => {
    const entries = deleteEntry([sampleEntry()], 'alpha')
    expect(entries).toHaveLength(0)
  })

  it('merges entries preferring the latest update', () => {
    const existing = [sampleEntry({ id: 'keep', updatedAt: 5 })]
    const incoming = [
      sampleEntry({ id: 'keep', updatedAt: 10, title: 'Latest' }),
      sampleEntry({ id: 'new', updatedAt: 3 })
    ]

    const merged = mergeEntries(existing, incoming)
    expect(merged).toHaveLength(2)
    expect(merged.find((entry) => entry.id === 'keep')?.title).toBe('Latest')
  })

  it('parses tags from string', () => {
    expect(tagsFromString('retro, synth, retro')).toEqual(['retro', 'synth'])
  })
})
