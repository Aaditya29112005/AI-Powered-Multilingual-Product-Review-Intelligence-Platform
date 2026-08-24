'use client';

import { Star, CheckCircle, XCircle, RotateCw, Edit3, ShieldAlert } from 'lucide-react';
import { ContentItem } from '@/lib/types';

interface ReviewCardProps {
  item: ContentItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (item: ContentItem) => void;
  onRegenerate: (id: string) => void;
}

export function ReviewCard({ item, onApprove, onReject, onEdit, onRegenerate }: ReviewCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Needs Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
      {/* Header: Rating & Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= item.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-800 text-slate-700'
                }`}
              />
            ))}
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
              item.status
            )}`}
          >
            {item.status}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-white tracking-tight leading-snug">
          {item.title}
        </h4>

        {/* Content */}
        <p className="text-sm text-slate-300 leading-relaxed font-normal">
          {item.content}
        </p>
      </div>

      {/* Metadata & Compliance Footer */}
      <div className="pt-3 border-t border-slate-800/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">{item.reviewer_name}</span>
            <span className="text-slate-500">•</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              {item.language} ({item.script})
            </span>
          </div>

          {/* Compliance Tag: Synthetic / AI-Generated */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-950 text-slate-400 border border-slate-800">
            <ShieldAlert className="h-3 w-3 text-cyan-400" />
            Synthetic / AI-Generated
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Quality: <strong className="text-slate-300">{item.quality_score}</strong></span>
            <span>Sim: <strong className="text-slate-300">{item.similarity_score}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(item)}
              title="Edit Review"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onRegenerate(item.id)}
              title="Regenerate Item"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onReject(item.id)}
              title="Reject Item"
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/20"
            >
              <XCircle className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onApprove(item.id)}
              title="Approve Item"
              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors border border-emerald-500/20"
            >
              <CheckCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
