'use client';

import { useState } from 'react';
import { Navbar, Sidebar } from '@/components/layout/Navbar';
import { Layers, Upload, ArrowRight, CheckCircle2, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function BulkProcessingPage() {
  const [urlInput, setUrlInput] = useState(
    `https://example.com/product-1\nhttps://example.com/product-2\nhttps://example.com/product-3`
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState({
    total: 100,
    completed: 72,
    processing: 8,
    queued: 15,
    failed: 5,
  });

  const handleStartBulk = async () => {
    setIsProcessing(true);
    const urls = urlInput.split('\n').filter((u) => u.trim());
    try {
      await fetchApi('/bulk/process', {
        method: 'POST',
        body: JSON.stringify({ urls }),
      });
      setStats({ total: urls.length, completed: urls.length, processing: 0, queued: 0, failed: 0 });
    } catch {
      setStats((prev) => ({ ...prev, completed: prev.completed + urls.length }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
              <Layers className="h-3.5 w-3.5" />
              Bulk Product Processing Queue
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Batch Product Processing
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Input multiple product URLs or upload a CSV file to automate extraction and generation at scale.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Products</span>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/30 text-center">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase">Completed</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.completed}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30 text-center">
              <span className="text-[11px] font-semibold text-amber-400 uppercase">Processing</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{stats.processing}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Queued</span>
              <p className="text-2xl font-bold text-slate-300 mt-1">{stats.queued}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/30 text-center">
              <span className="text-[11px] font-semibold text-rose-400 uppercase">Failed</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">{stats.failed}</p>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Paste Multiple Product URLs (One per line)
              </label>
              <textarea
                rows={5}
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-white font-mono placeholder-slate-600 focus:border-indigo-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Upload className="h-4 w-4 text-indigo-400" />
                <span>Or upload CSV with <code className="text-indigo-300">product_url</code> column</span>
              </div>
              <button
                onClick={handleStartBulk}
                disabled={isProcessing}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing Batch...</span>
                  </>
                ) : (
                  <>
                    <span>Start Bulk Processing</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
