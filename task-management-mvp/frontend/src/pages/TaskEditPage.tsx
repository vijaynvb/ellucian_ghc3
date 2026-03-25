import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tasksApi } from "../api/tasks.api";
import { TaskForm } from "../components/tasks/TaskForm";
import { useTasks } from "../hooks/useTasks";
import { Task } from "../types/api.types";
import { TaskFormValues } from "../validation/task.schema";

export const TaskEditPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { updateTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!taskId) {
      return;
    }

    void (async () => {
      const data = await tasksApi.getById(taskId);
      setTask(data);
    })();
  }, [taskId]);

  if (!taskId) {
    return <p>Missing task id.</p>;
  }

  if (!task) {
    return <p>Loading task...</p>;
  }

  const onSubmit = async (values: TaskFormValues) => {
    await updateTask(taskId, {
      title: values.title,
      description: values.description ?? null,
      priority: values.priority,
      dueDate: values.dueDate ?? null,
      categoryId: values.categoryId ? values.categoryId : null
    });
    navigate("/tasks");
  };

  return (
    <section className="page">
      <h2>Edit Task</h2>
      <TaskForm
        defaultValues={{
          title: task.title,
          description: task.description ?? "",
          priority: task.priority,
          dueDate: task.dueDate ?? "",
          assignedTo: task.assignedTo ?? "",
          categoryId: task.categoryId ?? ""
        }}
        onSubmit={onSubmit}
      />
    </section>
  );
};
