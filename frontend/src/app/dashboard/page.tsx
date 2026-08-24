'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Sidebar } from '@/components/layout/Navbar';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { JobsTable } from '@/components/dashboard/JobsTable';
import { PlusCircle, Layers, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { Job } from '@/lib/types';

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchApi<Job[]>('/jobs');
      setJobs(data && data.length > 0 ? data : getSampleJobs());
    } catch {
      setJobs(getSampleJobs());
    } finally {
      setLoading(false);
    }
  };

  const getSampleJobs = (): Job[] => [
    {
      id: 'job-101',
      user_id: 'user-1',
      product_id: 'prod-wireless-headphones',
      total_requested: 100,
      total_generated: 100,
      total_approved: 98,
      status: 'Completed',
      progress: 100,
      length: 'Medium',
      tone: 'Natural',
      content_type: 'Synthetic / Illustrative',
      rating_distribution: { '5': 50, '4': 35, '3': 15 },
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      languages: [
        { language: 'English', language_code: 'en', script: 'Standard', locale: 'en-US', quantity: 50, quantity_requested: 50 },
        { language: 'Hindi', language_code: 'hi', script: 'Devanagari', locale: 'hi-IN', quantity: 30, quantity_requested: 30 },
        { language: 'Hinglish', language_code: 'hi-en', script: 'Hinglish', locale: 'hi-IN', quantity: 20, quantity_requested: 20 },
      ]
    },
    {
      id: 'job-102',
      user_id: 'user-1',
      product_id: 'prod-promax-smartphone',
      total_requested: 50,
      total_generated: 32,
      total_approved: 30,
      status: 'Generating',
      progress: 64,
      length: 'Short',
      tone: 'Conversational',
      content_type: 'Localization Testing',
      rating_distribution: { '5': 60, '4': 40 },
      created_at: new Date(Date.now() - 1800000).toISOString(),
      languages: [
        { language: 'English', language_code: 'en', script: 'Standard', locale: 'en-US', quantity: 25, quantity_requested: 25 },
        { language: 'Spanish', language_code: 'es', script: 'Standard', locale: 'es-ES', quantity: 25, quantity_requested: 25 },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Review Intelligence Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Monitor live product extraction jobs, language distribution, and batch quality status
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadJobs}
                className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/jobs/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Process Product URL</span>
              </Link>
            </div>
          </div>

          {/* Metrics */}
          <MetricsCards
            totalProducts={120}
            processing={8}
            completed={105}
            failed={7}
            totalContentItems={12500}
          />

          {/* Jobs Table */}
          <JobsTable jobs={jobs} />
        </main>
      </div>
    </div>
  );
}
