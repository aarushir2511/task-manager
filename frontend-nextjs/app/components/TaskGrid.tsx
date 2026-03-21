'use client';

import { useState } from 'react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

interface TaskGridProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
}

export default function TaskGrid({
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskGridProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-900">No tasks yet</h3>
        <p className="text-sm text-gray-500 mt-2">
          Add your first task to get started.
        </p>
      </div>
    );
  }

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (taskId: number) => {
    if (!editText.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    onEdit(taskId, editText.trim());
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {editingId === task.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(task.id);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white text-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              ) : (
                <h3
                  className={`text-base font-semibold ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </h3>
              )}

              <p className="text-sm text-gray-500 mt-2">
                {task.completed ? 'Completed task' : 'Pending task'}
              </p>
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                task.completed
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-amber-50 text-amber-600'
              }`}
            >
              {task.completed ? 'Done' : 'Pending'}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                task.completed
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-green-400 text-white hover:bg-green-500'
              }`}
            >
              {task.completed ? 'Undo' : 'Mark Done'}
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="rounded-xl px-3 py-2 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
            >
              Delete
            </button>

            {editingId === task.id ? (
              <>
                <button
                  onClick={() => saveEdit(task.id)}
                  className="rounded-xl px-3 py-2 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  Save
                </button>

                <button
                  onClick={cancelEditing}
                  className="rounded-xl px-3 py-2 text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => startEditing(task)}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-yellow-400 text-black hover:bg-yellow-500 transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}