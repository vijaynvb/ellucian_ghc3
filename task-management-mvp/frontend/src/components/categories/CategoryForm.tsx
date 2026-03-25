import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { categoryFormSchema, CategoryFormValues } from "../../validation/category.schema";

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  submitLabel: string;
}

export const CategoryForm = ({ defaultValues, onSubmit, submitLabel }: CategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      isActive: defaultValues?.isActive ?? true
    }
  });

  return (
    <form className="form" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      <label>
        Name
        <input {...register("name")} />
      </label>
      {errors.name && <p className="error">{errors.name.message}</p>}

      <label>
        Description
        <textarea {...register("description")} />
      </label>

      <label>
        Active
        <input type="checkbox" {...register("isActive")} />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};
