import { useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import EntryList from '../components/EntryList'
import TagChip from '../components/TagChip'
import TextInput from '../components/TextInput'
import { useJournal } from '../lib/journalContext'
import { parseEntries, serializeEntries } from '../lib/storage'
import { getTagFrequencies, searchEntries } from '../lib/search'
import '../styles/components/layout.css'
import '../styles/components/forms.css'

const Home = () => {
  const { entries, deleteEntry, importEntries } = useJournal()
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredEntries = useMemo(
    () => searchEntries(entries, { query, tag: selectedTag }),
    [entries, query, selectedTag]
  )

  const tagFrequencies = useMemo(() => getTagFrequencies(entries), [entries])

  const handleTagSelect = (tag: string) => {
    setSelectedTag((current) => (current === tag ? null : tag))
  }

  const handleClearFilters = () => {
    setQuery('')
    setSelectedTag(null)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const contents = await file.text()
      const incoming = parseEntries(contents)

      if (incoming.length === 0) {
        window.alert('No entries found in the selected file.')
      } else {
        importEntries(incoming)
        window.alert(`Imported ${incoming.length} entries!`)
      }
    } catch (error) {
      console.error('Failed to import entries', error)
      window.alert('Unable to import entries. Please verify the file and try again.')
    } finally {
      event.target.value = ''
    }
  }

  const handleExport = () => {
    if (entries.length === 0) {
      window.alert('No entries to export yet!')
      return
    }

    const data = serializeEntries(entries)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `journal-entries-${new Date().toISOString()}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <div className="app-content">
      <section className="surface-panel surface-panel--frosted">
        <div className="form-field">
          <label className="form-label" htmlFor="search">
            Search the archives
          </label>
          <TextInput
            id="search"
            name="search"
            placeholder="Type a memory"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="inline-field" role="group" aria-label="Journal actions">
          <Link className="pixel-button" to="/new">
            New Entry
          </Link>
          <Button type="button" variant="secondary" onClick={handleImportClick}>
            Import JSON
          </Button>
          <Button type="button" variant="ghost" onClick={handleExport}>
            Export JSON
          </Button>
          {(query || selectedTag) && (
            <Button type="button" variant="ghost" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {tagFrequencies.length > 0 && (
          <div className="inline-field" role="group" aria-label="Filter by tag">
            {tagFrequencies.map(({ tag, count }) => (
              <TagChip
                key={tag}
                tag={tag}
                count={count}
                active={selectedTag === tag}
                onClick={() => handleTagSelect(tag)}
              />
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept="application/json"
          onChange={handleImportFile}
        />
      </section>

      <section className="surface-panel">
        <EntryList
          entries={filteredEntries}
          onDelete={deleteEntry}
          onTagSelect={handleTagSelect}
          emptyMessage="No entries yet. Be the first to log some radical memories!"
        />
      </section>
    </div>
  )
}

export default Home
