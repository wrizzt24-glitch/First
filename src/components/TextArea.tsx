import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import '../styles/components/forms.css'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', ...props }, ref) => {
    const classes = ['pixel-textarea', className].filter(Boolean).join(' ')
    return <textarea ref={ref} className={classes} {...props} />
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
