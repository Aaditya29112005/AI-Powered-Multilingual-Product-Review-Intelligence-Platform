'use client';

import { Package, Loader2, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface MetricsProps {
  totalProducts?: number;
  processing?: number;
  completed?: number;
  failed?: number;
  totalContentItems?: number;
}

export function MetricsCards({
  totalProducts = 120,
  processing = 8,
  completed = 105,
  failed = 7,
  totalContentItems = 12500,
}: MetricsProps) {
  const cards = [
    {
      title: 'Total Products',
      value: totalProducts.toLocaleString(),
      icon: Package,
      gradient: 'from-blue-500/20 to-indigo-500/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Processing Products',
      value: processing.toLocaleString(),
      icon: Loader2,
      animate: true,
      gradient: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      title: 'Completed Products',
      value: completed.toLocaleString(),
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Failed Products',
      value: failed.toLocaleString(),
      icon: AlertTriangle,
      gradient: 'from-rose-500/20 to-red-500/10',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
    },
    {
      title: 'Total Content Items',
      value: totalContentItems.toLocaleString(),
      icon: FileText,
      gradient: 'from-purple-500/20 to-pink-500/10',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} p-5 backdrop-blur-md shadow-lg transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-900/60 border border-slate-800 ${card.iconColor}`}>
                <Icon className={`h-5 w-5 ${card.animate ? 'animate-spin' : ''}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white tracking-tight">{card.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
