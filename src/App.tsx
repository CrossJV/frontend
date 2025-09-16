import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store/store'
import { createTaskThunk, fetchTasks, setPage, setSort, updateTaskThunk, addTaskLocal, updateTaskLocal } from './store/tasksSlice'
import { TodoItem } from './components/TodoItem/TodoItem'
import { AddTodoForm } from './components/AddTodoForm/AddTodoForm'
import { LoginPage } from './pages/LoginPage/LoginPage'
import Button from './components/ui/Button/Button'
import { logout } from './store/authSlice'

function AppContent() {
  const dispatch = useAppDispatch()
  const { items, page, pages, sort, order, status } = useAppSelector(s => s.tasks)
  const { token } = useAppSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch, page, sort, order])

  const addTask = async (username: string, email: string, text: string) => {
    const task = await dispatch(createTaskThunk({ username, email, text })).unwrap()
    dispatch(addTaskLocal(task))
  }

  const toggleTask = (id: number) => {
    if (!token) return
    const task = items.find(t => t.id === id)
    if (!task) return
    dispatch(updateTaskThunk({ id, changes: { completed: !task.completed } }))
      .unwrap()
      .then(updated => dispatch(updateTaskLocal(updated)))
      .catch(() => {})
  }

  const editTask = (id: number, title: string) => {
    if (!token) return
    dispatch(updateTaskThunk({ id, changes: { text: title } }))
      .unwrap()
      .then(updated => dispatch(updateTaskLocal(updated)))
      .catch(() => {})
  }

  const changeSort = (newSort: 'username' | 'email' | 'status') => {
    const newOrder = sort === newSort ? (order === 'asc' ? 'desc' : 'asc') : 'asc'
    dispatch(setSort({ sort: newSort, order: newOrder }))
  }

  return (
    <div className="app">
      {
        token ? <Button onClick={() => dispatch(logout())}>Выйти</Button> : <Button onClick={() => navigate('/login')}>Авторизоваться</Button>
      }
      
      <AddTodoForm onAdd={addTask} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Button onClick={() => changeSort('username')}>Сортировать по имени {sort === 'username' ? `(${order})` : ''}</Button>
        <Button onClick={() => changeSort('email')}>по e-mail {sort === 'email' ? `(${order})` : ''}</Button>
        <Button onClick={() => changeSort('status')}>по статусу {sort === 'status' ? `(${order})` : ''}</Button>
      </div>

      {status === 'loading' ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="todos-list">
          {items.length === 0 ? (
            <p className="empty">Нет задач. Добавьте первую!</p>
          ) : (
            items.map(todo => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                username={todo.username}
                email={todo.email}
                title={todo.text}
                completed={!!todo.completed}
                editedByAdmin={!!todo.edited_by_admin}
                onToggle={toggleTask}
                onEdit={editTask}
                isAdmin={!!token}
              />
            ))
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'center' }}>
        <Button
          onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
          disabled={page <= 1}
        >
          ← Назад
        </Button>
        <span style={{ alignSelf: 'center' }}>
          Страница {page} из {pages}
        </span>
        <Button
          onClick={() => dispatch(setPage(Math.min(pages, page + 1)))}
          disabled={page >= pages}
        >
          Вперёд →
        </Button>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App