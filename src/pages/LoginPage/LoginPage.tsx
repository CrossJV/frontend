import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../../components/LoginForm/LoginForm'
import Button from '../../components/ui/Button/Button'

export function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = () => {
    navigate('/')
  }

  return (
    <div className="login-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2>Авторизация</h2>
      <LoginForm onSuccess={handleLoginSuccess} />
      <Button onClick={() => navigate('/')}>Назад</Button>
    </div>
  )
}