import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import '../styles/components/forms.css'

type TextInputProps = InputHTMLAttributes<HTMLInputElement>

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', ...props }, ref) => {
    const classes = ['pixel-input', className].filter(Boolean).join(' ')
    return <input ref={ref} className={classes} {...props} />
  }
)

TextInput.displayName = 'TextInput'

export default TextInput
