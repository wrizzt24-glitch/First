import type { JournalEntry } from './types'

export type SearchOptions = {
  query?: string
  tag?: string | null
}

export const searchEntries = (
  entries: JournalEntry[],
  options: SearchOptions = {}
): JournalEntry[] => {
  const query = options.query?.trim().toLowerCase() ?? ''
  const tag = options.tag?.trim().toLowerCase() ?? ''

  const results = entries
    .map((entry) => {
      if (tag && !entry.tags.some((t) => t.toLowerCase() === tag)) {
        return null
      }

      if (!query) {
        return { entry, score: 0 }
      }

      const titleMatch = entry.title.toLowerCase().includes(query)
      const contentMatch = entry.content.toLowerCase().includes(query)

      if (!titleMatch && !contentMatch) {
        return null
      }

      const score = (titleMatch ? 2 : 0) + (contentMatch ? 1 : 0)

      return { entry, score }
    })
    .filter((value): value is { entry: JournalEntry; score: number } => Boolean(value))
    .sort((a, b) => {
      if (b.score === a.score) {
        return b.entry.updatedAt - a.entry.updatedAt
      }

      return b.score - a.score
    })

  const entriesWithQuery = results.map(({ entry }) => entry)

  if (!query) {
    return entriesWithQuery.sort((a, b) => b.updatedAt - a.updatedAt)
  }

  return entriesWithQuery
}

export const getTagFrequencies = (
  entries: JournalEntry[]
): Array<{ tag: string; count: number }> => {
  const frequencies = new Map<string, number>()

  entries.forEach((entry) => {
    entry.tags.forEach((tag) => {
      const count = frequencies.get(tag) ?? 0
      frequencies.set(tag, count + 1)
    })
  })

  return Array.from(frequencies.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      if (b.count === a.count) {
        return a.tag.localeCompare(b.tag)
      }

      return b.count - a.count
    })
}
