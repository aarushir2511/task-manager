'use client';

import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

interface Stats {
  total: number;
  completed: number;
  pending: number;
  rate: number;
}

interface StatsRowProps {
  stats: Stats;
  isLoading: boolean;
}

const statCards = [
  {
    key: 'total' as const,
    label: 'Total Tasks',
    icon: ListTodo,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    suffix: '',
  },
  {
    key: 'pending' as const,
    label: 'Pending',
    icon: Clock,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    suffix: '',
  },
  {
    key: 'completed' as const,
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    suffix: '',
  },
  {
    key: 'rate' as const,
    label: 'Completion Rate',
    icon: TrendingUp,
    color: 'text-fuchsia-500',
    bg: 'bg-fuchsia-50',
    border: 'border-fuchsia-100',
    suffix: '%',
  },
];

export default function StatsRow({ stats, isLoading }: StatsRowProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#faf8ff] rounded-2xl border border-violet-100 p-5 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-24 h-3.5 bg-violet-100 rounded-full" />
              <div className="w-9 h-9 bg-violet-50 rounded-xl" />
            </div>
            <div className="w-14 h-8 bg-violet-100 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {statCards.map(({ key, label, icon: Icon, color, bg, border, suffix }) => (
        <div
          key={key}
          className="bg-[#faf8ff] rounded-2xl border border-violet-100 p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {label}
            </span>
            <div
              className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl ${bg} border ${border} flex items-center justify-center`}
            >
              <Icon size={17} className={color} />
            </div>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-gray-900 tabular-nums">
            {stats[key]}
            {suffix}
          </p>
        </div>
      ))}
    </div>
  );
}