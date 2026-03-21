'use client';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

interface TaskGridProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskGrid({
  tasks,
  onToggleComplete,
  onDelete,
}: TaskGridProps) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3
                className={`text-base font-semibold ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                }`}
              >
                {task.title}
              </h3>

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

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                task.completed
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-green-500 text-white hover:bg-green-600'
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
          </div>
        </div>
      ))}
    </div>
  );
}