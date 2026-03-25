import { useEffect, useMemo, useState } from "react";
import { CategoryForm } from "../components/categories/CategoryForm";
import { useCategories } from "../hooks/useCategories";
import { Category } from "../types/api.types";
import { CategoryFormValues } from "../validation/category.schema";

export const CategoriesPage = () => {
  const { categories, loadCategories, createCategory, updateCategory, deleteCategory, isLoading, error } =
    useCategories();
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    void loadCategories({ page: 1, pageSize: 100 });
  }, [loadCategories]);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  const handleSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      description: values.description ?? null,
      isActive: values.isActive ?? true
    };

    try {
      if (editing) {
        await updateCategory(editing.categoryId, payload);
        setEditing(null);
        return;
      }

      await createCategory(payload);
    } catch {
      return;
    }
  };

  return (
    <section className="page">
      <h2>Categories</h2>
      {error && <p className="error">{error}</p>}
      <CategoryForm
        defaultValues={
          editing
            ? {
                name: editing.name,
                description: editing.description ?? "",
                isActive: editing.isActive
              }
            : undefined
        }
        onSubmit={handleSubmit}
        submitLabel={editing ? "Update Category" : "Create Category"}
      />
      {editing && (
        <button onClick={() => setEditing(null)} type="button">
          Cancel Edit
        </button>
      )}

      {isLoading ? (
        <p>Loading categories...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((category) => (
              <tr key={category.categoryId}>
                <td>{category.name}</td>
                <td>{category.description ?? "-"}</td>
                <td>{category.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button type="button" onClick={() => setEditing(category)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteCategory(category.categoryId).catch(() => undefined)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sortedCategories.length === 0 && (
              <tr>
                <td colSpan={4}>No categories yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
};
