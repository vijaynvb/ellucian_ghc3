import { useState } from "react";

interface TaskFiltersProps {
  onApply: (filters: { status?: string; priority?: string }) => void;
}

export const TaskFilters = ({ onApply }: TaskFiltersProps) => {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

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
      <button onClick={() => onApply({ status: status || undefined, priority: priority || undefined })}>
        Apply
      </button>
    </div>
  );
};
