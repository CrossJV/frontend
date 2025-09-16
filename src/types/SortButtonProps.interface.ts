export interface SortButtonProps {
  field: "username" | "email" | "status";
  currentSort: string;
  order: "asc" | "desc";
  onChange: (field: "username" | "email" | "status") => void;
  children: React.ReactNode;
}