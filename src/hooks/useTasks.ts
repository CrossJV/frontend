import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store/store"
import {
  createTaskThunk,
  updateTaskThunk,
  addTaskLocal,
  updateTaskLocal,
  setSort,
  setPage,
  fetchTasks,
} from "../store/tasksSlice"
import { toast } from "react-toastify"

export function useTasks() {
  const dispatch = useAppDispatch()
  const { items, page, pages, sort, order, status } = useAppSelector((s) => s.tasks)
  const { token } = useAppSelector((s) => s.auth)

  // Автозагрузка при изменении пагинации/сортировки
  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch, page, sort, order])

  const addTask = async (username: string, email: string, text: string) => {
    const task = await dispatch(createTaskThunk({ username, email, text })).unwrap()
    dispatch(addTaskLocal(task))
    toast.success("Задача успешно добавлена!")
  }

  const toggleTask = (id: number) => {
    if (!token) return
    const task = items.find((t) => t.id === id)
    if (!task) return
    dispatch(updateTaskThunk({ id, changes: { completed: !task.completed } }))
      .unwrap()
      .then((updated) => dispatch(updateTaskLocal(updated)))
      .catch(() => {})
  }

  const editTask = (id: number, title: string) => {
    if (!token) return
    dispatch(updateTaskThunk({ id, changes: { text: title } }))
      .unwrap()
      .then((updated) => dispatch(updateTaskLocal(updated)))
      .catch(() => {})
  }

  const changeSort = (newSort: "username" | "email" | "status") => {
    const newOrder = sort === newSort ? (order === "asc" ? "desc" : "asc") : "asc"
    dispatch(setSort({ sort: newSort, order: newOrder }))
  }

  const goPrev = () => dispatch(setPage(Math.max(1, page - 1)))
  const goNext = () => dispatch(setPage(Math.min(pages, page + 1)))

  return {
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
  }
}