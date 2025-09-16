import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import styles from './styles.module.css'

type ButtonProps = PropsWithChildren<{
	className?: string
}> & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ className, children, ...rest }: ButtonProps) {
	const classes = className ? `${styles.button} ${className}` : styles.button
	return (
		<button {...rest} className={classes}>
			{children}
		</button>
	)
} 