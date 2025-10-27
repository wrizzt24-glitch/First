import { useNavigate, useParams } from 'react-router-dom'
import EntryForm from '../components/EntryForm'
import { useJournal } from '../lib/journalContext'
import '../styles/components/layout.css'
import '../styles/components/entry-list.css'

const EntryEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { createEntry, updateEntry, getEntryById } = useJournal()

  const isEditing = Boolean(id)
  const entry = isEditing && id ? getEntryById(id) : undefined

  const handleSubmit = (values: { title: string; content: string; tags: string[] }) => {
    if (isEditing && id) {
      const updated = updateEntry(id, values)
      if (!updated) {
        window.alert('Unable to update that entry. It might have been removed.')
        return
      }
      navigate(`/entry/${id}`)
    } else {
      const created = createEntry(values)
      navigate(`/entry/${created.id}`)
    }
  }

  if (isEditing && !entry) {
    return (
      <div className="app-content">
        <section className="surface-panel">
          <p>That entry vanished into the void. Head back home and try again.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="app-content">
      <section className="surface-panel">
        <h1 className="entry-card__title">{isEditing ? 'Edit Entry' : 'New Entry'}</h1>
        <EntryForm
          submitLabel={isEditing ? 'Save Changes' : 'Create Entry'}
          defaultTitle={entry?.title}
          defaultContent={entry?.content}
          defaultTags={entry?.tags}
          onSubmit={handleSubmit}
          onCancel={() => navigate(isEditing && id ? `/entry/${id}` : '/')}
        />
      </section>
    </div>
  )
}

export default EntryEdit
