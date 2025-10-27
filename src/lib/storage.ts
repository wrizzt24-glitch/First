import type { JournalEntry } from './types'

export const STORAGE_KEY = 'journal.entries.v1'
export const STORAGE_VERSION = 1

type StoragePayload = {
  version: number
  entries: JournalEntry[]
}

const defaultPayload = (): StoragePayload => ({
  version: STORAGE_VERSION,
  entries: []
})

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const sanitizeEntries = (items: unknown[]): JournalEntry[] =>
  items
    .map((item) => sanitizeEntry(item))
    .filter((entry): entry is JournalEntry => Boolean(entry))

const sanitizeEntry = (value: unknown): JournalEntry | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const draft = value as Record<string, unknown>
  const idValue = draft.id
  const id = typeof idValue === 'string' && idValue.trim() !== '' ? idValue : null
  if (!id) {
    return null
  }

  const createdAtRaw = draft.createdAt
  const updatedAtRaw = draft.updatedAt
  const createdAt = Number(createdAtRaw)
  const updatedAt = Number(updatedAtRaw)

  if (!Number.isFinite(createdAt) || !Number.isFinite(updatedAt)) {
    return null
  }

  const tagsRaw = draft.tags
  const tagList = Array.isArray(tagsRaw) ? tagsRaw : []
  const tags = Array.from(
    new Set(
      tagList
        .map((tag) => (typeof tag === 'string' ? tag : String(tag ?? '')).trim())
        .filter((tag) => tag.length > 0)
    )
  )

  const titleRaw = draft.title
  const contentRaw = draft.content

  return {
    id,
    title: typeof titleRaw === 'string' ? titleRaw : String(titleRaw ?? ''),
    content: typeof contentRaw === 'string' ? contentRaw : String(contentRaw ?? ''),
    tags,
    createdAt,
    updatedAt
  }
}

export const readStorage = (): StoragePayload => {
  if (!isBrowser()) {
    return defaultPayload()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultPayload()
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (Number(parsed.version) !== STORAGE_VERSION) {
      return defaultPayload()
    }

    const entriesRaw = parsed.entries
    if (!Array.isArray(entriesRaw)) {
      return defaultPayload()
    }

    return {
      version: STORAGE_VERSION,
      entries: sanitizeEntries(entriesRaw)
    }
  } catch (error) {
    console.warn('Failed to read journal entries from storage', error)
    return defaultPayload()
  }
}

export const writeStorage = (entries: JournalEntry[]): void => {
  if (!isBrowser()) {
    return
  }

  const payload: StoragePayload = {
    version: STORAGE_VERSION,
    entries
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export const clearStorage = (): void => {
  if (!isBrowser()) {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export const parseEntries = (raw: unknown): JournalEntry[] => {
  let data: unknown = raw

  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw)
    } catch (error) {
      console.warn('Failed to parse entries payload', error)
      return []
    }
  }

  if (Array.isArray(data)) {
    return sanitizeEntries(data)
  }

  if (data && typeof data === 'object') {
    const payload = data as Record<string, unknown>
    if (Array.isArray(payload.entries)) {
      return sanitizeEntries(payload.entries)
    }
  }

  return []
}

export const serializeEntries = (entries: JournalEntry[]): string => {
  const payload: StoragePayload = {
    version: STORAGE_VERSION,
    entries
  }

  return JSON.stringify(payload, null, 2)
}
