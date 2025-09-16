import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { login } from '../../store/authSlice'
import styles from './styles.module.css'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector(s => s.auth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(login({ username, password })).unwrap()
      onSuccess?.()
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Input
        type="text"
        placeholder="Логин (admin)"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Пароль (123)"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Входим...' : 'Войти'}
      </Button>
      {error && <span className={styles.error}>{error}</span>}
    </form>
  )
}