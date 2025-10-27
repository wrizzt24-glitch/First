import type { EntryDraft, JournalEntry } from './types'

export const normalizeTags = (tags: string[]): string[] => {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    )
  )
}

export const tagsFromString = (value: string): string[] => {
  return normalizeTags(
    value
      .split(',')
      .map((tag) => tag.replace(/\s+/g, ' '))
  )
}

const createDraft = (draft: EntryDraft): EntryDraft => ({
  title: draft.title.trim(),
  content: draft.content,
  tags: normalizeTags(draft.tags)
})

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).slice(2, 10)
}

const sortEntries = (entries: JournalEntry[]): JournalEntry[] => {
  return [...entries].sort((a, b) => {
    if (b.updatedAt === a.updatedAt) {
      return b.createdAt - a.createdAt
    }

    return b.updatedAt - a.updatedAt
  })
}

export const createEntry = (
  entries: JournalEntry[],
  draft: EntryDraft
): [JournalEntry[], JournalEntry] => {
  const cleanDraft = createDraft(draft)
  const timestamp = Date.now()

  const entry: JournalEntry = {
    id: generateId(),
    title: cleanDraft.title || 'Untitled Entry',
    content: cleanDraft.content,
    tags: cleanDraft.tags,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  const nextEntries = sortEntries([entry, ...entries])

  return [nextEntries, entry]
}

export const updateEntry = (
  entries: JournalEntry[],
  id: string,
  draft: EntryDraft
): [JournalEntry[], JournalEntry | undefined] => {
  const cleanDraft = createDraft(draft)
  let updatedEntry: JournalEntry | undefined

  const nextEntries = sortEntries(
    entries.map((entry) => {
      if (entry.id !== id) {
        return entry
      }

      updatedEntry = {
        ...entry,
        title: cleanDraft.title || 'Untitled Entry',
        content: cleanDraft.content,
        tags: cleanDraft.tags,
        updatedAt: Date.now()
      }

      return updatedEntry
    })
  )

  return [nextEntries, updatedEntry]
}

export const deleteEntry = (entries: JournalEntry[], id: string): JournalEntry[] => {
  return entries.filter((entry) => entry.id !== id)
}

export const getEntryById = (
  entries: JournalEntry[],
  id: string
): JournalEntry | undefined => entries.find((entry) => entry.id === id)

export const mergeEntries = (
  existing: JournalEntry[],
  incoming: JournalEntry[]
): JournalEntry[] => {
  const map = new Map<string, JournalEntry>()

  existing.forEach((entry) => {
    map.set(entry.id, { ...entry })
  })

  incoming.forEach((entry) => {
    const clean = {
      ...entry,
      tags: normalizeTags(entry.tags)
    }

    const prior = map.get(entry.id)
    if (!prior || prior.updatedAt <= clean.updatedAt) {
      map.set(entry.id, clean)
    }
  })

  return sortEntries(Array.from(map.values()))
}

export const sortByUpdated = (entries: JournalEntry[]): JournalEntry[] => sortEntries(entries)
