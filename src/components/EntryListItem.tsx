import { Link } from 'react-router-dom'
import '../styles/components/entry-list.css'
import Button from './Button'
import TagChip from './TagChip'
import type { JournalEntry } from '../lib/types'

type EntryListItemProps = {
  entry: JournalEntry
  onDelete: (id: string) => void
  onTagClick?: (tag: string) => void
}

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString()
}

const getSnippet = (content: string, length = 180): string => {
  if (content.length <= length) {
    return content
  }

  return `${content.slice(0, length)}...`
}

const EntryListItem = ({ entry, onDelete, onTagClick }: EntryListItemProps) => {
  const handleDelete = () => {
    const confirmed = window.confirm('Delete this entry? This cannot be undone.')
    if (confirmed) {
      onDelete(entry.id)
    }
  }

  return (
    <article className="entry-card" role="listitem">
      <div className="entry-card__header">
        <div>
          <h3 className="entry-card__title">{entry.title}</h3>
          <p className="entry-card__meta">Updated: {formatTimestamp(entry.updatedAt)}</p>
        </div>
        <div className="entry-card__actions">
          <Link className="pixel-button pixel-button--ghost pixel-button--sm" to={`/entry/${entry.id}`}>
            View
          </Link>
          <Link className="pixel-button pixel-button--secondary pixel-button--sm" to={`/edit/${entry.id}`}>
            Edit
          </Link>
          <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <p className="entry-card__content">{getSnippet(entry.content)}</p>
      {entry.tags.length > 0 && (
        <div className="entry-card__tag-row">
          {entry.tags.map((tag) => (
            <TagChip key={tag} tag={tag} onClick={() => onTagClick?.(tag)} />
          ))}
        </div>
      )}
    </article>
  )
}

export default EntryListItem
