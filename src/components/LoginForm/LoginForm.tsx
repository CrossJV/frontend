import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { login, logout } from '../../store/authSlice'
import styles from './styles.module.css'
import Button from '../ui/Button/Button'
import Input from '../ui/Input/Input'

export function LoginForm() {
  const dispatch = useAppDispatch()
  const { token, status, error } = useAppSelector(s => s.auth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(login({ username, password }))
  }

  if (token) {
    return (
      <div className={styles.loggedInRow}>
        <span>Админ вошёл</span>
        <Button onClick={() => dispatch(logout())}>Выйти</Button>
      </div>
    )
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