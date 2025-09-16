export interface TodoItemProps {
  id: number
  username: string
  email: string
  title: string
  completed: boolean
  editedByAdmin: boolean
  onToggle: (id: number) => void
  onEdit: (id: number, title: string) => void
  isAdmin: boolean
}