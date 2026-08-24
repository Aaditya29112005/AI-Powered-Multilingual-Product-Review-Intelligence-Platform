'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Sliders, Hash } from 'lucide-react';
import { LanguageConfig } from '@/lib/types';

interface QuantityDistributionProps {
  selectedLanguages: { name: string; code: string; script: string; locale: string }[];
  onDistributionChange: (distribution: LanguageConfig[]) => void;
}

export function QuantityDistribution({ selectedLanguages, onDistributionChange }: QuantityDistributionProps) {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [totalTarget, setTotalTarget] = useState<number>(100);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    en: 50,
    hi: 30,
    'hi-en': 20,
  });

  // Calculate live sum
  const totalSum = selectedLanguages.reduce((sum, lang) => {
    return sum + (quantities[lang.code] || 0);
  }, 0);

  // Auto distribution calculation when totalTarget or mode changes
  useEffect(() => {
    if (mode === 'auto' && selectedLanguages.length > 0) {
      const perLang = Math.floor(totalTarget / selectedLanguages.length);
      const remainder = totalTarget % selectedLanguages.length;
      
      const newQuantities: Record<string, number> = {};
      selectedLanguages.forEach((lang, idx) => {
        newQuantities[lang.code] = perLang + (idx === 0 ? remainder : 0);
      });

      setQuantities(newQuantities);
    }
  }, [mode, totalTarget, selectedLanguages]);

  // Sync to parent
  useEffect(() => {
    const configList: LanguageConfig[] = selectedLanguages.map((lang) => ({
      language: lang.name,
      language_code: lang.code,
      script: lang.script,
      locale: lang.locale,
      quantity: Math.max(0, quantities[lang.code] || 0),
    }));

    onDistributionChange(configList);
  }, [quantities, selectedLanguages]);

  const handleQuantityChange = (code: string, val: number) => {
    const safeVal = Math.max(0, isNaN(val) ? 0 : val);
    setQuantities((prev) => ({ ...prev, [code]: safeVal }));
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('manual')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'manual'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Manual Mode
          </button>
          <button
            onClick={() => setMode('auto')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              mode === 'auto'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Auto AI Distribution Mode
          </button>
        </div>

        {mode === 'auto' && (
          <div className="flex items-center gap-2 pr-2">
            <span className="text-xs text-slate-400 font-medium">Target Total:</span>
            <input
              type="number"
              min={1}
              value={totalTarget}
              onChange={(e) => setTotalTarget(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white font-semibold text-center focus:border-indigo-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Language Quantity Inputs */}
      <div className="space-y-3">
        {selectedLanguages.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500 rounded-xl border border-dashed border-slate-800">
            Please select at least one language above.
          </div>
        ) : (
          selectedLanguages.map((lang) => (
            <div
              key={lang.code}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/40"
            >
              <div>
                <div className="text-sm font-semibold text-white">{lang.name}</div>
                <div className="text-xs text-slate-400">
                  Script: <span className="text-indigo-400">{lang.script}</span> ({lang.locale})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Quantity:</span>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    disabled={mode === 'auto'}
                    value={quantities[lang.code] ?? 0}
                    onChange={(e) => handleQuantityChange(lang.code, parseInt(e.target.value))}
                    className="w-24 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-bold text-center focus:border-indigo-500 focus:outline-none disabled:opacity-60"
                  />
                  <span className="absolute right-2 top-2.5 text-xs text-slate-500 pointer-events-none">
                    items
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mandatory Live Total Validation Summary */}
      <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-indigo-400" />
          <div>
            <span className="text-sm font-semibold text-white">Live Total Quantity:</span>
            <p className="text-xs text-slate-400">Calculated sum across all selected language allocations</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-indigo-400">{totalSum}</span>
          <span className="text-xs text-slate-400 block">Total Content Items</span>
        </div>
      </div>
    </div>
  );
}
