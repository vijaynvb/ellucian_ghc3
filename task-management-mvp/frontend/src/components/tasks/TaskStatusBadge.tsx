import { TaskStatus } from "../../types/api.types";

export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>;
};
