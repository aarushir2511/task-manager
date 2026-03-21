'use client';

import { useState } from 'react';
import { toast } from 'sonner';

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
      <div className="bg-[#faf8ff] border border-violet-100 rounded-2xl p-10 text-center">
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
      toast.error('Task title cannot be empty');
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
          className="bg-[#faf8ff] rounded-2xl border border-violet-100 p-5 shadow-sm hover:shadow-md transition-all duration-200"
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
                  className="w-full rounded-xl border border-violet-200 bg-[#fdfcff] text-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
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
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-fuchsia-50 text-fuchsia-700'
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
                  ? 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                  : 'bg-[#c4b5fd] text-violet-950 hover:bg-[#b8a4fc]'
              }`}
            >
              {task.completed ? 'Undo' : 'Mark Done'}
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="rounded-xl px-3 py-2 text-sm font-semibold bg-[#e9d5ff] text-fuchsia-900 hover:bg-[#ddbefc] transition-all"
            >
              Delete
            </button>

            {editingId === task.id ? (
              <>
                <button
                  onClick={() => saveEdit(task.id)}
                  className="rounded-xl px-3 py-2 text-sm font-semibold bg-[#a78bfa] text-white hover:bg-[#9672f7] transition-all"
                >
                  Save
                </button>

                <button
                  onClick={cancelEditing}
                  className="rounded-xl px-3 py-2 text-sm font-semibold bg-[#ede9fe] text-violet-700 hover:bg-[#ddd6fe] transition-all"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => startEditing(task)}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-[#d8b4fe] text-violet-950 hover:bg-[#cfa0fc] transition-all"
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