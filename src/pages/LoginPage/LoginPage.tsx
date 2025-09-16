import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../../components/LoginForm/LoginForm'
import Button from '../../components/ui/Button/Button'
import styles from './styles.module.css'

export function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    navigate('/')
  }

  return (
    <div className={styles.loginPage}>
      <h2>Авторизация</h2>
      <LoginForm onSuccess={handleLoginSuccess} />
      <Button onClick={() => navigate('/')}>Назад</Button>
    </div>
  )
}