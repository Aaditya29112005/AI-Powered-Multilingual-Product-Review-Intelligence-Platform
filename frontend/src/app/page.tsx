'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Navbar } from '@/components/layout/Navbar';
import {
  Sparkles,
  ArrowRight,
  Globe,
  FileSpreadsheet,
  Zap,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Download,
  HelpCircle,
  Play
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/30 to-cyan-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 shadow-inner">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Gen AI Review Intelligence & Localization Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Turn Product URLs into{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Structured Multilingual Content Workflows
          </span>{' '}
          with AI.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
          {siteConfig.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/jobs/new"
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Processing</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-800 transition-all hover:border-slate-700"
          >
            <Play className="h-4 w-4 text-cyan-400 fill-cyan-400" />
            <span>View Demo</span>
          </Link>
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-500">reviewflow-ai.dashboard.app</span>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-left space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Total Products</span>
                <p className="text-2xl font-bold text-white mt-1">120</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Total Content Generated</span>
                <p className="text-2xl font-bold text-indigo-400 mt-1">12,500 Items</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Supported Languages</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">19+ Scripts</p>
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">ALL 100</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-xs font-medium">ENGLISH (50)</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-xs font-medium">HINDI (30)</span>
              <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-xs font-medium">HINGLISH (20)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Workflow Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950/60 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Automated 6-Agent AI Architecture
            </h2>
            <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              From raw product URL to validated multilingual CSV datasets in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', name: 'Extraction', desc: 'Parses JSON-LD, Microdata, & DOM attributes' },
              { step: '02', name: 'Understanding', desc: 'Builds structured Product Knowledge Object' },
              { step: '03', name: 'Generation', desc: 'Generates grounded text in 19+ scripts' },
              { step: '04', name: 'Validation', desc: 'Verifies script purity & language confidence' },
              { step: '05', name: 'Quality QC', desc: 'Evaluates relevance & scores 0-100 quality' },
              { step: '06', name: 'Duplicate Check', desc: 'Calculates semantic similarity distance' },
            ].map((st, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 text-left space-y-2">
                <span className="text-xs font-mono font-bold text-indigo-400">STEP {st.step}</span>
                <h4 className="font-bold text-white text-base">{st.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built for Enterprise SaaS Content Workflows
          </h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Compliant, scalable, and localized review intelligence at your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Devanagari, Roman Hindi & Hinglish</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Full support for native script variations including Devanagari Hindi, Romanized Hindi, and colloquial Hinglish hybrid output.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">UTF-8 BOM CSV & ZIP Exporter</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Downloads combined CSVs, per-language files, or packaged ZIP bundles with UTF-8 BOM encoding for seamless Microsoft Excel compatibility.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Strict Compliance & Marking</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Generated synthetic items are explicitly tagged with `Synthetic / AI-Generated` and default to `verified_purchase = false` for regulatory adherence.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              RF
            </div>
            <span className="font-bold text-white text-base">{siteConfig.name}</span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Multilingual Review Intelligence Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
