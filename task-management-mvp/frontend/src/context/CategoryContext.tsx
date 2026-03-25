import { createContext, useCallback, useMemo, useState } from "react";
import { categoriesApi } from "../api/categories.api";
import { Category } from "../types/api.types";

interface CategoryContextValue {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  loadCategories: (params?: Record<string, unknown>) => Promise<void>;
  createCategory: (payload: { name: string; description?: string | null; isActive?: boolean }) => Promise<Category>;
  updateCategory: (
    categoryId: string,
    payload: { name?: string; description?: string | null; isActive?: boolean }
  ) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextValue | null>(null);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async (params?: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await categoriesApi.list(params ?? { page: 1, pageSize: 100 });
      setCategories(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (payload: { name: string; description?: string | null; isActive?: boolean }) => {
      setError(null);
      try {
        const category = await categoriesApi.create(payload);
        setCategories((prev) => [category, ...prev]);
        return category;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create category.");
        throw err;
      }
    },
    []
  );

  const updateCategory = useCallback(
    async (categoryId: string, payload: { name?: string; description?: string | null; isActive?: boolean }) => {
      setError(null);
      try {
        const category = await categoriesApi.update(categoryId, payload);
        setCategories((prev) => prev.map((item) => (item.categoryId === categoryId ? category : item)));
        return category;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update category.");
        throw err;
      }
    },
    []
  );

  const deleteCategory = useCallback(async (categoryId: string) => {
    setError(null);
    try {
      await categoriesApi.remove(categoryId);
      setCategories((prev) => prev.filter((item) => item.categoryId !== categoryId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({ categories, isLoading, error, loadCategories, createCategory, updateCategory, deleteCategory }),
    [categories, isLoading, error, loadCategories, createCategory, updateCategory, deleteCategory]
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
