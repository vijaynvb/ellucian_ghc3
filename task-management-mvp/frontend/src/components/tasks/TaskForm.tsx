import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { taskFormSchema, TaskFormValues } from "../../validation/task.schema";

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

export const TaskForm = ({ defaultValues, onSubmit }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      priority: defaultValues?.priority ?? "MEDIUM",
      dueDate: defaultValues?.dueDate ?? "",
      assignedTo: defaultValues?.assignedTo ?? ""
    }
  });

  return (
    <form className="form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      <label>
        Title
        <input {...register("title")} />
      </label>
      {errors.title && <p className="error">{errors.title.message}</p>}

      <label>
        Description
        <textarea {...register("description")} />
      </label>

      <label>
        Priority
        <select {...register("priority")}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>
      </label>

      <label>
        Due Date
        <input type="date" {...register("dueDate")} />
      </label>

      <label>
        Assigned User ID
        <input {...register("assignedTo")} />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
};
