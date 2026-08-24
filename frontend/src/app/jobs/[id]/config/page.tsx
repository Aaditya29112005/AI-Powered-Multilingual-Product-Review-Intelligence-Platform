'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layout/Navbar';
import { Sparkles, ArrowRight, Sliders, ShieldCheck, Star } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function GenerationConfigPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.id as string) || 'job-101';

  const [length, setLength] = useState('Medium');
  const [tone, setTone] = useState('Natural');
  const [contentType, setContentType] = useState('Synthetic / Illustrative');
  const [star5, setStar5] = useState(50);
  const [star4, setStar4] = useState(35);
  const [star3, setStar3] = useState(15);

  const handleLaunch = async () => {
    try {
      await fetchApi(`/jobs/${jobId}/config`, {
        method: 'PUT',
        body: JSON.stringify({
          length,
          tone,
          content_type: contentType,
          rating_distribution: { '5': star5, '4': star4, '3': star3 },
        }),
      });

      await fetchApi(`/jobs/${jobId}/start`, { method: 'POST' });
    } catch {
      // Proceed gracefully
    }
    router.push(`/jobs/${jobId}/progress`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Step 4 of 4: AI Generation Settings & Rating Distribution
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Configure Generation Parameters
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Customize output length, brand tone, content origin type, and rating distribution curves.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-8">
            {/* Tone & Length */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Content Length
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Short', 'Medium', 'Long'].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        length === l
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Voice & Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Natural', 'Casual', 'Professional', 'Conversational'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        tone === t
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Use Case / Content Type Tag
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none font-medium"
              >
                <option value="Synthetic / Illustrative">Synthetic / Illustrative Content</option>
                <option value="Demo Content">Demo & Marketing Prototype Content</option>
                <option value="Localization Testing">Localization & QA Testing</option>
                <option value="Internal QA">Internal Product QA</option>
                <option value="Genuine Feedback Assistance">Genuine Customer Review Assistance</option>
              </select>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Rating Distribution Curves
                </label>
                <span className="text-xs text-slate-500">Configurable star percentages</span>
              </div>

              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20 text-xs font-bold text-amber-400">
                    5 <Star className="h-3.5 w-3.5 fill-amber-400" />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={star5}
                    onChange={(e) => setStar5(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="w-12 text-right font-mono text-xs text-slate-200">{star5}%</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20 text-xs font-bold text-amber-400">
                    4 <Star className="h-3.5 w-3.5 fill-amber-400" />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={star4}
                    onChange={(e) => setStar4(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="w-12 text-right font-mono text-xs text-slate-200">{star4}%</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20 text-xs font-bold text-amber-400">
                    3 <Star className="h-3.5 w-3.5 fill-amber-400" />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={star3}
                    onChange={(e) => setStar3(parseInt(e.target.value))}
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="w-12 text-right font-mono text-xs text-slate-200">{star3}%</span>
                </div>
              </div>
            </div>

            {/* Mandated Compliance Callout */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-slate-300 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white mb-0.5">Automated Ethics & Compliance Enforcement:</p>
                <p className="text-slate-400 leading-relaxed">
                  All output items will be permanently stamped with <code className="text-cyan-300">synthetic_ai_generated</code> origin metadata. The <code className="text-cyan-300">verified_purchase</code> flag is defaulted to <code className="text-rose-400">false</code> to prevent deceptive consumer practices.
                </p>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={handleLaunch}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-95 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="h-5 w-5" />
                <span>Launch Multilingual AI Pipeline</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
