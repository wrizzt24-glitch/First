import '../styles/components/entry-list.css'
import type { JournalEntry } from '../lib/types'
import EntryListItem from './EntryListItem'

type EntryListProps = {
  entries: JournalEntry[]
  onDelete: (id: string) => void
  onTagSelect?: (tag: string) => void
  emptyMessage?: string
}

const EntryList = ({ entries, onDelete, onTagSelect, emptyMessage }: EntryListProps) => {
  if (entries.length === 0) {
    return <div className="empty-state">{emptyMessage ?? 'No entries just yet. Hit “New Entry” to start writing!'}</div>
  }

  return (
    <div className="entry-list" role="list">
      {entries.map((entry) => (
        <EntryListItem key={entry.id} entry={entry} onDelete={onDelete} onTagClick={onTagSelect} />
      ))}
    </div>
  )
}

export default EntryList
