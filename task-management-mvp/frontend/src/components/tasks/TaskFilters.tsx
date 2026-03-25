import { useEffect, useState } from "react";
import { useCategories } from "../../hooks/useCategories";

interface TaskFiltersProps {
  onApply: (filters: { status?: string; priority?: string; categoryId?: string }) => void;
}

export const TaskFilters = ({ onApply }: TaskFiltersProps) => {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const { categories, loadCategories, isLoading } = useCategories();

  useEffect(() => {
    void loadCategories({ page: 1, pageSize: 100, isActive: true });
  }, [loadCategories]);

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
      <select value={status} onChange={(event) => setStatus(event.target.value)}>
        <option value="">All Statuses</option>
        <option value="NEW">NEW</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="BLOCKED">BLOCKED</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <select value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option value="">All Priorities</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
      <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={isLoading}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.categoryId} value={category.categoryId}>
            {category.name}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          onApply({
            status: status || undefined,
            priority: priority || undefined,
            categoryId: categoryId || undefined
          })
        }
      >
        Apply
      </button>
    </div>
  );
};
