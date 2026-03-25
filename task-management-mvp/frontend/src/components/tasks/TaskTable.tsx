import { Link } from "react-router-dom";
import { Task } from "../../types/api.types";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskTableProps {
  tasks: Task[];
  onCancel: (taskId: string) => Promise<void>;
}

export const TaskTable = ({ tasks, onCancel }: TaskTableProps) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Due Date</th>
          <th>Assignee</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.taskId}>
            <td>{task.title}</td>
            <td>
              <TaskStatusBadge status={task.status} />
            </td>
            <td>{task.priority}</td>
            <td>{task.dueDate ?? "-"}</td>
            <td>{task.assignedTo ?? "-"}</td>
            <td>
              <Link to={`/tasks/${task.taskId}/edit`}>Edit</Link>
              <button onClick={() => void onCancel(task.taskId)}>Cancel</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
