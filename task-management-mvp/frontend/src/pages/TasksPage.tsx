import { useEffect } from "react";
import { Link } from "react-router-dom";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { TaskTable } from "../components/tasks/TaskTable";
import { useCategories } from "../hooks/useCategories";
import { useTasks } from "../hooks/useTasks";

export const TasksPage = () => {
  const { tasks, loadTasks, updateStatus, isLoading } = useTasks();
  const { categories, loadCategories } = useCategories();

  useEffect(() => {
    void loadTasks({ page: 1, pageSize: 20 });
    void loadCategories({ page: 1, pageSize: 100, isActive: true });
  }, [loadTasks, loadCategories]);

  return (
    <section className="page">
      <h2>Tasks</h2>
      <TaskFilters
        onApply={(filters) => {
          void loadTasks({ page: 1, pageSize: 20, ...filters });
        }}
      />
      <Link to="/tasks/new">Create Task</Link>
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskTable
          tasks={tasks}
          categories={categories}
          onCancel={async (taskId) => {
            await updateStatus(taskId, "CANCELLED");
          }}
        />
      )}
    </section>
  );
};
