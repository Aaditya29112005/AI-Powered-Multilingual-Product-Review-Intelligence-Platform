'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layout/Navbar';
import { CheckCircle2, Loader2, Circle, ArrowRight, Sparkles, Cpu } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function ProgressPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.id as string) || 'job-101';

  const [progress, setProgress] = useState(35);
  const [currentStep, setCurrentStep] = useState('Generating Content');
  const [currentLang, setCurrentLang] = useState('Hinglish');

  useEffect(() => {
    // Simulate active agent steps for progress demonstration
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            router.push(`/jobs/${jobId}/results`);
          }, 800);
          return 100;
        }
        return prev + 15;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [jobId, router]);

  const steps = [
    { label: 'Product Extracted', completed: true },
    { label: 'Product Knowledge Analyzed', completed: true },
    { label: 'English Generated (50 / 50)', completed: progress > 30 },
    { label: 'Hindi Generated (30 / 30)', completed: progress > 60 },
    { label: 'Hinglish Generating (20 / 20)', active: progress >= 60 && progress < 90, completed: progress >= 90 },
    { label: 'Language & Quality Validation', completed: progress >= 95 },
    { label: 'Export Dataset Preparation', completed: progress === 100 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
              <Cpu className="h-3.5 w-3.5 animate-pulse" />
              6-Agent AI Execution Pipeline Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Review Intelligence Generation
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Executing multi-language grounding, language validation, quality scoring, and duplicate checks.
            </p>
          </div>

          {/* Progress Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-8">
            {/* Progress Bar Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Overall Pipeline Completion
                </span>
                <span className="text-indigo-400 font-mono font-bold text-lg">{progress}%</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              {steps.map((st, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    {st.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : st.active ? (
                      <Loader2 className="h-5 w-5 text-amber-400 animate-spin shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-700 shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${st.completed ? 'text-slate-200' : st.active ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                      {st.label}
                    </span>
                  </div>
                  {st.completed && (
                    <span className="text-xs font-mono text-emerald-400 font-semibold">Passed</span>
                  )}
                  {st.active && (
                    <span className="text-xs font-mono text-amber-400 font-semibold animate-pulse">Processing...</span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Skip to Results button if needed */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => router.push(`/jobs/${jobId}/results`)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                <span>View Live Results Stream</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
