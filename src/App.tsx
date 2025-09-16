import "./App.css"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { useTasks } from "./hooks/useTasks"
import { TodoItem } from "./components/TodoItem/TodoItem"
import { AddTodoForm } from "./components/AddTodoForm/AddTodoForm"
import { LoginPage } from "./pages/LoginPage/LoginPage"
import Button from "./components/ui/Button/Button"
import { logout } from "./store/authSlice"
import { SortButton } from "./components/SortButton/SortButton"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAppDispatch } from "./store/store"
import { useEffect } from "react"

function AppContent() {
  const {
    items,
    page,
    pages,
    sort,
    order,
    status,
    token,
    addTask,
    toggleTask,
    editTask,
    changeSort,
    goPrev,
    goNext,
  } = useTasks()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <div className="app">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="login">
        {token ? (
          <Button onClick={() => dispatch(logout())}>Выйти</Button>
        ) : (
          <Button onClick={() => navigate("/login")}>Авторизоваться</Button>
        )}
      </div>

      <AddTodoForm onAdd={addTask} />

      <div className="button-wrapper">
        <SortButton field="username" currentSort={sort} order={order} onChange={changeSort}>
          Сортировать по имени
        </SortButton>
        <SortButton field="email" currentSort={sort} order={order} onChange={changeSort}>
          по e-mail
        </SortButton>
        <SortButton field="status" currentSort={sort} order={order} onChange={changeSort}>
          по статусу
        </SortButton>
      </div>

      {status === "loading" ? (
        <div className="loading">Загрузка...</div>
      ) : (
        <div className="todos-list">
          {items.length === 0 ? (
            <p className="empty">Нет задач. Добавьте первую!</p>
          ) : (
            items.map((todo) => (
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

      <div className="button-wrapper">
        <Button onClick={goPrev} disabled={page <= 1}>
          ← Назад
        </Button>
        <span className="paggination-label">
          Страница {page} из {pages}
        </span>
        <Button onClick={goNext} disabled={page >= pages}>
          Вперёд →
        </Button>
      </div>
    </div>
  )
}

function App() {
    const dispatch = useAppDispatch()

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token' && e.newValue === null) {
        dispatch(logout())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [dispatch])

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