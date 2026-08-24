'use client';

import { LanguageSummary } from '@/lib/types';
import { CheckCircle2, Clock, FileText } from 'lucide-react';

interface LanguageSummaryTableProps {
  summary: LanguageSummary;
}

export function LanguageSummaryTable({ summary }: LanguageSummaryTableProps) {
  return (
    <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">LANGUAGE SUMMARY</h3>
          <p className="text-xs text-slate-400 mt-0.5">Comprehensive breakdown of requested vs approved items by language</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Mandatory Quality Audit
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Language</th>
              <th className="py-3.5 px-6 text-center">Requested</th>
              <th className="py-3.5 px-6 text-center">Generated</th>
              <th className="py-3.5 px-6 text-center">Approved</th>
              <th className="py-3.5 px-6 text-center">Needs Review</th>
              <th className="py-3.5 px-6 text-right">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {summary.summaries.map((item, idx) => {
              const rate = item.requested > 0 ? Math.round((item.approved / item.requested) * 100) : 100;
              return (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      {item.language}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-medium text-slate-300">
                    {item.requested}
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-medium text-indigo-400">
                    {item.generated}
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-bold text-emerald-400">
                    {item.approved}
                  </td>
                  <td className="py-4 px-6 text-center font-mono font-medium text-amber-400">
                    {item.needs_review}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-200">
                    {rate}%
                  </td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-slate-950/80 font-bold border-t-2 border-slate-700 text-slate-100">
              <td className="py-4 px-6 uppercase tracking-wider text-xs text-indigo-400">
                TOTAL
              </td>
              <td className="py-4 px-6 text-center font-mono text-base text-slate-200">
                {summary.total_requested}
              </td>
              <td className="py-4 px-6 text-center font-mono text-base text-indigo-400">
                {summary.total_generated}
              </td>
              <td className="py-4 px-6 text-center font-mono text-base text-emerald-400">
                {summary.total_approved}
              </td>
              <td className="py-4 px-6 text-center font-mono text-base text-amber-400">
                {summary.total_needs_review}
              </td>
              <td className="py-4 px-6 text-right font-mono text-base text-white">
                {summary.total_requested > 0
                  ? Math.round((summary.total_approved / summary.total_requested) * 100)
                  : 100}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
