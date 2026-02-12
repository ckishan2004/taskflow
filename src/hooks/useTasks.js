import { useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

function nextId(tasks) {
  return tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, completionRate };
  }, [tasks]);

  const addTask = (title, description, dueDate, priority) => {
    const id = nextId(tasks);
    const newTask = {
      id,
      title,
      description,
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id, patch) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setTasks(updated);
    return updated.find((t) => t.id === id) || null;
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return null;
    return updateTask(id, { completed: !t.completed });
  };

  return { tasks, setTasks, stats, addTask, updateTask, deleteTask, toggleComplete };
}
