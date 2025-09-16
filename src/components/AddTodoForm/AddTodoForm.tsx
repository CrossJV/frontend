import { useState } from 'react'
import styles from './styles.module.css'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export interface AddTodoFormProps {
  onAdd: (username: string, email: string, text: string) => Promise<void>
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!username.trim()) {
      setError('Имя пользователя обязательно')
      return
    }
    if (!email.trim()) {
      setError('E-mail обязателен')
      return
    }
    if (!validateEmail(email.trim())) {
      setError('Некорректный e-mail')
      return
    }
    if (!text.trim()) {
      setError('Текст задачи обязателен')
      return
    }
    setLoading(true)
    try {
      await onAdd(username.trim(), email.trim(), text.trim())
      setUsername('')
      setEmail('')
      setText('')
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'message' in e && typeof (e as Record<string, unknown>).message === 'string') {
        setError((e as { message: string }).message)
      } else {
        setError('Ошибка при добавлении задачи')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Имя пользователя"
        aria-invalid={!!error && !username.trim()}
        aria-describedby="username-error"
      />
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        aria-invalid={!!error && (!email.trim() || !validateEmail(email))}
        aria-describedby="email-error"
      />
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Текст задачи"
        aria-invalid={!!error && !text.trim()}
        aria-describedby="text-error"
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Добавление...' : 'Добавить'}
      </Button>
      {error && <div className={styles.error} role="alert">{error}</div>}
    </form>
  )
}