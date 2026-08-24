'use client';

import { Check } from 'lucide-react';

interface ScriptSelectorProps {
  selectedScript: string;
  onChange: (script: string) => void;
}

export function ScriptSelector({ selectedScript, onChange }: ScriptSelectorProps) {
  const options = [
    {
      id: 'Devanagari',
      title: 'Devanagari (Native Script)',
      example: 'यह प्रोडक्ट बहुत अच्छा है और इसका इस्तेमाल करना काफी आसान है।',
      description: 'Standard native Devanagari script representation for Hindi output.'
    },
    {
      id: 'Roman Hindi',
      title: 'Roman Hindi (Phonetic Latin)',
      example: 'Yeh product bahut accha hai aur iska use karna kaafi easy hai.',
      description: 'Hindi language phonetically written in standard Latin alphabet.'
    },
    {
      id: 'Hinglish',
      title: 'Hinglish (Hybrid Colloquial)',
      example: 'Product strictly top notch hai aur noise cancellation super responsive hai.',
      description: 'Natural colloquial mix of English terms with conversational Hindi.'
    }
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-white">Hindi Output Script & Format Configuration</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((opt) => {
          const isSelected = selectedScript === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-slate-100">{opt.title}</span>
                {isSelected && (
                  <div className="h-4 w-4 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">{opt.description}</p>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/60 font-mono text-[11px] text-indigo-300">
                "{opt.example}"
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
