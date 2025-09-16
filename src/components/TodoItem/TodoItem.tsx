import { useState, } from 'react'
import styles from './styles.module.css'
import Input from '../ui/Input/Input'
import type { TodoItemProps } from '../../types/TodoItemProps.interface'

export function TodoItem({
  id,
  username,
  email,
  title,
  completed,
  editedByAdmin,
  onToggle,
  onEdit,
  isAdmin,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)

  const handleSave = () => {
    if (!isAdmin) return
    if (editTitle.trim()) {
      onEdit(id, editTitle.trim())
      setIsEditing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditTitle(title)
      setIsEditing(false)
    }
  }

  return (
    <div className={styles.todoItem}>
      <Input
        type="checkbox"
        checked={completed}
        onChange={() => isAdmin && onToggle(id)}
        className={styles.checkbox}
        disabled={!isAdmin}
      />
      <div className={styles.content}>
        <div className={styles.infoRow}>
          <strong>{username}</strong>
          <span className={styles.email}>&lt;{email}&gt;</span>
          {completed && <span className={styles.edited}>(выполнено)</span>}
          {editedByAdmin && <span className={styles.edited}>(отредактировано админом)</span>} 
        </div>
        {isEditing ? (
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyPress}
            className={styles.editInput}
            autoFocus
            disabled={!isAdmin}
          />
        ) : (
          <span
            className={`${styles.title} ${completed ? styles.completed : ''}`}
            onDoubleClick={() => isAdmin && setIsEditing(true)}
            style={{ cursor: isAdmin ? 'pointer' : 'default' }}
          >
            {title}
          </span>
        )}
      </div>
    </div>
  )
}