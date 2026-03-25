import { Link } from "react-router-dom";
import { Category, Task } from "../../types/api.types";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskTableProps {
  tasks: Task[];
  categories: Category[];
  onCancel: (taskId: string) => Promise<void>;
}

export const TaskTable = ({ tasks, categories, onCancel }: TaskTableProps) => {
  const categoryMap = new Map(categories.map((category) => [category.categoryId, category.name]));

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Due Date</th>
          <th>Category</th>
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
            <td>{task.categoryId ? categoryMap.get(task.categoryId) ?? task.categoryId : "-"}</td>
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
