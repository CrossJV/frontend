import type { InputHTMLAttributes } from 'react'
import styles from './styles.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	className?: string
}

export default function Input({ className, ...rest }: InputProps) {
	const classes = className ? `${styles.input} ${className}` : styles.input
	return <input {...rest} className={classes} />
} 