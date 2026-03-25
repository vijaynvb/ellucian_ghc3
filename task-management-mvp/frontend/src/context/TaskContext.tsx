import { createContext, useCallback, useMemo, useState } from "react";
import { tasksApi } from "../api/tasks.api";
import { Task } from "../types/api.types";

interface TaskContextValue {
  tasks: Task[];
  isLoading: boolean;
  loadTasks: (params?: Record<string, unknown>) => Promise<void>;
  createTask: (payload: {
    title: string;
    description?: string | null;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string | null;
    assignedTo?: string | null;
  }) => Promise<Task>;
  updateTask: (taskId: string, payload: Partial<Task>) => Promise<Task>;
  updateStatus: (taskId: string, status: Task["status"]) => Promise<Task>;
}

export const TaskContext = createContext<TaskContextValue | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadTasks = useCallback(async (params?: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const data = await tasksApi.list(params ?? { page: 1, pageSize: 20 });
      setTasks(data.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (payload: {
    title: string;
    description?: string | null;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string | null;
    assignedTo?: string | null;
  }) => {
    const task = await tasksApi.create(payload);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback(async (taskId: string, payload: Partial<Task>) => {
    const task = await tasksApi.update(taskId, payload);
    setTasks((prev) => prev.map((item) => (item.taskId === taskId ? task : item)));
    return task;
  }, []);

  const updateStatus = useCallback(async (taskId: string, status: Task["status"]) => {
    const task = await tasksApi.updateStatus(taskId, status);
    setTasks((prev) => prev.map((item) => (item.taskId === taskId ? task : item)));
    return task;
  }, []);

  const value = useMemo(
    () => ({ tasks, isLoading, loadTasks, createTask, updateTask, updateStatus }),
    [tasks, isLoading, loadTasks, createTask, updateTask, updateStatus]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
