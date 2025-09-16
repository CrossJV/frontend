import type { SortButtonProps } from "../../types/SortButtonProps.interface";
import Button from "../ui/Button/Button";

export function SortButton({ field, currentSort, order, onChange, children }: SortButtonProps) {
  return (
    <Button onClick={() => onChange(field)}>
      {children} {currentSort === field ? `(${order})` : ""}
    </Button>
  )
}