import { useNavigate } from "react-router-dom";
import { TaskForm } from "../components/tasks/TaskForm";
import { useTasks } from "../hooks/useTasks";
import { TaskFormValues } from "../validation/task.schema";

export const TaskCreatePage = () => {
  const navigate = useNavigate();
  const { createTask } = useTasks();

  const onSubmit = async (values: TaskFormValues) => {
    await createTask({
      title: values.title,
      description: values.description ?? null,
      priority: values.priority,
      dueDate: values.dueDate ?? null,
      assignedTo: values.assignedTo ?? null,
      categoryId: values.categoryId ? values.categoryId : null
    });

    navigate("/tasks");
  };

  return (
    <section className="page">
      <h2>Create Task</h2>
      <TaskForm onSubmit={onSubmit} />
    </section>
  );
};
