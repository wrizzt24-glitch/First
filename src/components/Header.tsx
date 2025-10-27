import { Link } from 'react-router-dom'
import Button from './Button'
import '../styles/components/header.css'

type HeaderProps = {
  crtEnabled: boolean
  onToggleCrt: () => void
}

const Header = ({ crtEnabled, onToggleCrt }: HeaderProps) => {
  return (
    <header className="app-header">
      <div className="app-header__top-row">
        <div className="app-header__brand">
          <Link to="/">
            <div>
              <div className="app-header__title">RetroWave Journal</div>
              <div className="app-header__subtitle">Log your neon memories, one entry at a time.</div>
            </div>
          </Link>
          <span role="img" aria-label="sparkles">
            ✨
          </span>
        </div>
        <div className="app-header__actions">
          <Button type="button" variant="ghost" onClick={onToggleCrt} aria-pressed={crtEnabled}>
            {crtEnabled ? 'Disable CRT' : 'Enable CRT'}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
