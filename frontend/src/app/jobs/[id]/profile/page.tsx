'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layout/Navbar';
import { Sparkles, CheckCircle2, Edit2, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function ProductProfilePage() {
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.id as string) || 'job-101';

  const [name, setName] = useState('Wireless Pro Headphones');
  const [brand, setBrand] = useState('AudioMax');
  const [category, setCategory] = useState('Electronics & Audio');
  const [description, setDescription] = useState(
    'Premium wireless over-ear headphones featuring Hybrid Active Noise Cancellation, high-resolution audio drivers, and crystal-clear hands-free microphone.'
  );
  const [features, setFeatures] = useState<string[]>([
    'Active Noise Cancellation (ANC)',
    '40-Hour Extended Battery Life',
    'Bluetooth 5.3 Low Latency',
    'Fast Charging (10 mins = 5 hours)',
    'Ergonomic Memory Foam Ear Cushions',
  ]);
  const [newFeature, setNewFeature] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const handleDeleteFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleApprove = () => {
    // Proceed to Language Configuration step
    router.push(`/jobs/${jobId}/languages`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3 border border-indigo-500/20">
                <Sparkles className="h-3.5 w-3.5" />
                Step 2 of 4: Extracted Product Profile Review
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Review Extracted Product Profile
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Verify and edit the AI-extracted product attributes before generating content.
              </p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-400 border border-slate-700 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{isEditing ? 'View Mode' : 'Edit Information'}</span>
            </button>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Product Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                ) : (
                  <div className="text-base font-bold text-white">{name}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Brand
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                ) : (
                  <div className="text-base font-semibold text-indigo-400">{brand}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                ) : (
                  <div className="text-base font-medium text-slate-300">{category}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Description
              </label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none"
                />
              ) : (
                <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
              )}
            </div>

            {/* Key Features */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Extracted Key Features
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-slate-200"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteFeature(idx)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Add missing feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Approval Action */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Status: <span className="font-semibold text-amber-400">Awaiting Product Approval</span>
              </div>
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Approve Product Profile</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
