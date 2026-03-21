'use client';

import { Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DashboardTopbarProps {
  onAddTask: () => void;
}

export default function DashboardTopbar({
  onAddTask,
}: DashboardTopbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-16 lg:h-[68px] flex items-center justify-between gap-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10l4 4 8-8"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight hidden sm:block">
            TaskFlow
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-1 text-sm text-gray-500">
          <span className="font-medium text-gray-700">My Workspace</span>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Task</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}