import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCategories } from "../../hooks/useCategories";
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
      assignedTo: defaultValues?.assignedTo ?? "",
      categoryId: defaultValues?.categoryId ?? ""
    }
  });

  const { categories, loadCategories, isLoading } = useCategories();

  useEffect(() => {
    void loadCategories({ page: 1, pageSize: 100, isActive: true });
  }, [loadCategories]);

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

      <label>
        Category
        <select {...register("categoryId")} disabled={isLoading}>
          <option value="">No Category</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
};
