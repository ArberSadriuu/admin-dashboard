import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
  addTask: (text: string) => void;
  editTask: (id: number, text: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (text) => {
        const newTask: Task = {
          id: Date.now(),
          text,
          completed: false,
        };
        set({ tasks: [newTask, ...get().tasks] });
      },
      editTask: (id, text) => {
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, text } : t)),
        });
      },
      toggleTask: (id) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        });
      },
      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },
    }),
    {
      name: 'nexboard-tasks', // localStorage key
    }
  )
); 