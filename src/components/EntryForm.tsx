import { useState } from 'react'
import type { FormEvent } from 'react'
import TextArea from './TextArea'
import TextInput from './TextInput'
import Button from './Button'
import '../styles/components/forms.css'

type EntryFormProps = {
  defaultTitle?: string
  defaultContent?: string
  defaultTags?: string[]
  submitLabel: string
  onSubmit: (values: { title: string; content: string; tags: string[] }) => void
  onCancel?: () => void
}

const EntryForm = ({
  defaultTitle = '',
  defaultContent = '',
  defaultTags = [],
  submitLabel,
  onSubmit,
  onCancel
}: EntryFormProps) => {
  const [title, setTitle] = useState(defaultTitle)
  const [content, setContent] = useState(defaultContent)
  const [tagsValue, setTagsValue] = useState(defaultTags.join(', '))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      title,
      content,
      tags: tagsValue
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      <div className="form-field">
        <label className="form-label" htmlFor="entry-title">
          Title
        </label>
        <TextInput
          id="entry-title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Dear diary..."
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="entry-content">
          Content
        </label>
        <TextArea
          id="entry-content"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What radical adventure did you have today?"
          required
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="entry-tags">
          Tags (comma separated)
        </label>
        <TextInput
          id="entry-tags"
          name="tags"
          value={tagsValue}
          onChange={(event) => setTagsValue(event.target.value)}
          placeholder="gaming, music, school"
        />
      </div>

      <div className="inline-field">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default EntryForm
