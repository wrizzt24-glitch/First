import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import TagChip from '../components/TagChip'
import { useJournal } from '../lib/journalContext'
import '../styles/components/layout.css'
import '../styles/components/entry-list.css'

const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString()

const EntryView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getEntryById } = useJournal()
  const entry = id ? getEntryById(id) : undefined

  if (!entry) {
    return (
      <div className="app-content">
        <section className="surface-panel">
          <p>We couldn&apos;t find that entry. It might have been deleted.</p>
          <Button type="button" variant="primary" onClick={() => navigate('/')}>Return Home</Button>
        </section>
      </div>
    )
  }

  return (
    <div className="app-content">
      <section className="surface-panel">
        <header className="entry-card__header">
          <div>
            <h1 className="entry-card__title">{entry.title}</h1>
            <p className="entry-card__meta">
              Created: {formatDate(entry.createdAt)} — Updated: {formatDate(entry.updatedAt)}
            </p>
          </div>
          <div className="entry-card__actions">
            <Link className="pixel-button pixel-button--secondary" to={`/edit/${entry.id}`}>
              Edit Entry
            </Link>
            <Link className="pixel-button pixel-button--ghost" to="/">
              Back
            </Link>
          </div>
        </header>

        <article className="entry-card__content" style={{ whiteSpace: 'pre-wrap' }}>
          {entry.content}
        </article>

        {entry.tags.length > 0 && (
          <footer className="entry-card__tag-row">
            {entry.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </footer>
        )}
      </section>
    </div>
  )
}

export default EntryView
