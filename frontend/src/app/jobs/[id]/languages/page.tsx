'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layout/Navbar';
import { LanguagePicker } from '@/components/languages/LanguagePicker';
import { QuantityDistribution } from '@/components/languages/QuantityDistribution';
import { ScriptSelector } from '@/components/languages/ScriptSelector';
import { Sparkles, ArrowRight, Globe } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { LanguageConfig } from '@/lib/types';
import { fetchApi } from '@/lib/api';

export default function LanguageConfigPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.id as string) || 'job-101';

  // Default selected languages: English, Hindi, Hinglish
  const [selectedLanguages, setSelectedLanguages] = useState(
    siteConfig.supportedLanguages.slice(0, 3)
  );

  const [hindiScript, setHindiScript] = useState('Devanagari');
  const [distribution, setDistribution] = useState<LanguageConfig[]>([]);

  const handleNext = async () => {
    try {
      await fetchApi(`/jobs/${jobId}/languages`, {
        method: 'POST',
        body: JSON.stringify({
          job_id: jobId,
          languages: distribution,
          distribution_mode: 'manual',
        }),
      });
    } catch {
      // Proceed gracefully
    }
    router.push(`/jobs/${jobId}/config`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              Step 3 of 4: Multilingual Language & Quantity Configuration
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Configure Target Languages & Distribution
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Select one or multiple target languages, configure Hindi script settings, and define exact quantity allocations.
            </p>
          </div>

          {/* Section 1: Language Picker */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1. Select Target Languages</h3>
                <p className="text-xs text-slate-400">Choose from 19+ supported global languages and regional scripts</p>
              </div>
            </div>

            <LanguagePicker
              selectedLanguages={selectedLanguages}
              onChange={setSelectedLanguages}
            />
          </div>

          {/* Section 2: Hindi Script Selector */}
          {selectedLanguages.some((l) => l.name === 'Hindi' || l.name === 'Hinglish') && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl">
              <ScriptSelector selectedScript={hindiScript} onChange={setHindiScript} />
            </div>
          )}

          {/* Section 3: Quantity Distribution */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">2. Language-Wise Quantity Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Define exact content counts per language with live validation</p>
            </div>

            <QuantityDistribution
              selectedLanguages={selectedLanguages}
              onDistributionChange={setDistribution}
            />

            <div className="pt-6 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={handleNext}
                disabled={distribution.length === 0}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <span>Save & Configure Generation</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
