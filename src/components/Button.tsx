import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import '../styles/components/buttons.css'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const classes = [
      'pixel-button',
      `pixel-button--${variant}`,
      `pixel-button--${size}`,
      className
    ]
      .filter(Boolean)
      .join(' ')

    return <button ref={ref} className={classes} {...props} />
  }
)

Button.displayName = 'Button'

export default Button
