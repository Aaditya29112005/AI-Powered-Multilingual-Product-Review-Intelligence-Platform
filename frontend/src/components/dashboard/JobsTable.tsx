'use client';

import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Job } from '@/lib/types';

interface JobsTableProps {
  jobs: Job[];
}

export function JobsTable({ jobs }: JobsTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </span>
        );
      case 'Generating':
      case 'Extracting':
      case 'Analyzing':
      case 'Validating':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            {status}
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="h-3.5 w-3.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <Clock className="h-3.5 w-3.5" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-xl">
      <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Recent Processing Jobs</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time status of product review generation runs</p>
        </div>
        <Link
          href="/jobs/new"
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          + New Job <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Progress</th>
              <th className="py-3.5 px-6">Languages</th>
              <th className="py-3.5 px-6">Created</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No jobs found. Start by adding a product URL.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-4 px-6 font-medium text-white">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        Product #{job.product_id.substring(0, 8)}
                      </span>
                      <span className="text-xs text-slate-400">
                        Total Items: {job.total_requested || 100}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(job.status)}</td>
                  <td className="py-4 px-6">
                    <div className="w-36">
                      <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                        <span>{Math.round(job.progress)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {job.languages?.map((lang, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {lang.language} ({lang.quantity_requested || 0})
                        </span>
                      )) || (
                        <span className="text-xs text-slate-500">
                          English, Hindi, Hinglish
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400">
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/jobs/${job.id}/results`}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      View Results
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
