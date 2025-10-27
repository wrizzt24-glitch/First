import '../styles/components/tags.css'

type TagChipProps = {
  tag: string
  active?: boolean
  count?: number
  onClick?: () => void
}

const TagChip = ({ tag, active = false, count, onClick }: TagChipProps) => {
  const label = count ? `${tag} (${count})` : tag
  const classes = ['tag-chip']

  if (active) {
    classes.push('tag-chip--active')
  }

  return (
    <button type="button" className={classes.join(' ')} onClick={onClick} aria-pressed={active}>
      {label}
    </button>
  )
}

export default TagChip
