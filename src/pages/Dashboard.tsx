import React, { useState } from 'react';
//import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useAuth } from '../context/AuthContext';
import { useTasksStore } from '../context/useTasksStore';
import type { Task } from '../context/useTasksStore';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/*const stats = [
  { label: 'Total Users', value: 1200, icon: <PersonIcon className="text-primary" />, color: 'bg-gray-100 dark:bg-gray-800' },
  { label: 'Monthly Revenue', value: '$8,500', icon: <ValueIcon className="text-accent" />, color: 'bg-gray-100 dark:bg-gray-800' },
  { label: 'Daily Visits', value: 3200, icon: <RocketIcon className="text-primary-dark" />, color: 'bg-gray-100 dark:bg-gray-800' },
];

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [1200, 1900, 3000, 5000, 2300, 3400],
      backgroundColor: '#6366F1', // primary
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const },
    title: { display: true, text: 'Monthly Revenue' },
  },
};*/

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, addTask, editTask, toggleTask, deleteTask } = useTasksStore();
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Show toast for 1.5s
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1500);
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
      showToast('Task added!');
    }
  };

  // Start editing a task
  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save edited task
  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null && editText.trim()) {
      editTask(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
      showToast('Task updated!');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Delete task
  const handleDeleteTask = (id: number) => {
    deleteTask(id);
    showToast('Task deleted!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center animate-fade-in">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Welcome, {user?.username}!</h1>
        <p className="text-gray-500 text-base mb-8 text-center">
          This is your personalized dashboard. Here you can find quick access to your most important tools and information.
        </p>
        {/* Admin/User Panels (as before) */}
        {user?.role === 'admin' && (
          <div className="w-full mb-6 p-6 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center animate-fade-in">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Admin Panel</h2>
            <p className="text-blue-600 text-center">Exclusive tools and analytics for administrators.</p>
          </div>
        )}
        {user?.role === 'user' && (
          <div className="w-full mb-6 p-6 bg-green-50 border border-green-100 rounded-xl flex flex-col items-center animate-fade-in">
            <h2 className="text-xl font-bold text-green-700 mb-2">User Panel</h2>
            <p className="text-green-600 text-center">Your personal workspace and quick actions.</p>
          </div>
        )}
        {/* Tasks Section */}
        <div className="w-full mb-6 p-6 bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Tasks</h2>
          <form onSubmit={handleAddTask} className="w-full flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition button-press"
            >
              Add
            </button>
          </form>
          <ul className="w-full flex flex-col gap-2">
            {tasks.length === 0 && (
              <li className="flex flex-col items-center gap-2 py-8">
                <CheckCircledIcon className="w-8 h-8 text-blue-200" />
                <span className="text-gray-400 text-center">No tasks yet. Add your first task above!</span>
              </li>
            )}
            {tasks.map((task: Task) => (
              <li key={task.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="accent-blue-600 w-5 h-5"
                />
                {editingId === task.id ? (
                  <form onSubmit={handleEditTask} className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
                      autoFocus
                    />
                    <button type="submit" className="text-blue-600 font-semibold button-press">Save</button>
                    <button type="button" onClick={cancelEdit} className="text-gray-500 font-semibold button-press">Cancel</button>
                  </form>
                ) : (
                  <>
                    <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.text}</span>
                    <button
                      onClick={() => startEdit(task.id, task.text)}
                      className="text-blue-600 font-semibold hover:underline text-sm button-press"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 font-semibold hover:underline text-sm button-press"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Toast/Snackbar */}
        {toast && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
            {toast}
          </div>
        )}
        {/* Common Panel (as before) */}
        <div className="w-full p-6 bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Common Panel</h2>
          <p className="text-gray-600 text-center">This section is visible to all users and contains shared resources.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 