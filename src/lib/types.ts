export type JournalEntry = {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export type EntryDraft = {
  title: string
  content: string
  tags: string[]
}
