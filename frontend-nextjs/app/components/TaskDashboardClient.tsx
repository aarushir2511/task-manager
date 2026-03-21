'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DashboardTopbar from './DashboardTopbar';
import StatsRow from './StatsRow';
import TaskGrid from './TaskGrid';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const API_BASE = 'http://localhost:5000';

export default function TaskDashboardClient() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchTasks = async () => {
    const token = getToken();

    if (!token) {
      router.push('/');
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(`${API_BASE}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again.');
        router.push('/');
        return;
      }

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to fetch tasks');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    const token = getToken();

    if (!token) {
      router.push('/');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const newTask = await res.json();

      if (!res.ok) {
        toast.error(newTask?.msg || 'Failed to create task');
        return;
      }

      setTasks((prev) => [newTask, ...prev]);
      setTitle('');
      toast.success('Task created');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    }
  };

  const handleToggleComplete = async (id: number) => {
    const token = getToken();

    if (!token) {
      router.push('/');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTask = await res.json();

      if (!res.ok) {
        toast.error(updatedTask?.msg || 'Failed to update task');
        return;
      }

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );

      toast.success(
        updatedTask.completed ? 'Marked as complete' : 'Marked as pending'
      );
    } catch (error) {
      console.error('Failed to toggle task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id: number) => {
    const token = getToken();

    if (!token) {
      router.push('/');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.msg || 'Failed to delete task');
        return;
      }

      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = async (id: number, newTitle: string) => {
    const token = getToken();

    if (!token) {
      router.push('/');
      return;
    }

    if (!newTitle.trim()) {
      toast.error('Task title cannot be empty');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      const updatedTask = await res.json();

      if (!res.ok) {
        toast.error(updatedTask?.msg || 'Failed to update task');
        return;
      }

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );

      toast.success('Task updated');
    } catch (error) {
      console.error('Failed to edit task:', error);
      toast.error('Failed to update task');
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'pending' && !task.completed);

      const matchesSearch =
        searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, rate };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f1ff] via-[#f3ecff] to-[#efe7ff] flex flex-col">
      <DashboardTopbar onAddTask={handleAddTask} />

      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10">
        <StatsRow stats={stats} isLoading={isLoading} />

        <div className="mt-7 mb-6 bg-[#faf8ff] rounded-2xl border border-violet-100 p-4 lg:p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3">
            <input
              className="flex-1 rounded-xl border border-violet-200 bg-[#fdfcff] text-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-gray-400"
              placeholder="Add a new task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddTask();
              }}
            />

            <button
              onClick={handleAddTask}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl transition-all"
            >
              Add Task
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
              className="flex-1 rounded-xl border border-violet-200 bg-[#fdfcff] text-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 placeholder:text-gray-400"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as 'all' | 'completed' | 'pending')
              }
              className="rounded-xl border border-violet-200 bg-[#fdfcff] text-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <TaskGrid
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          onEdit={handleEditTask}
        />
      </main>
    </div>
  );
}