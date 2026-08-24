'use client';

import { useState } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface LanguageOption {
  name: string;
  code: string;
  script: string;
  locale: string;
}

interface LanguagePickerProps {
  selectedLanguages: LanguageOption[];
  onChange: (langs: LanguageOption[]) => void;
}

export function LanguagePicker({ selectedLanguages, onChange }: LanguagePickerProps) {
  const [search, setSearch] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [allLanguages, setAllLanguages] = useState<LanguageOption[]>(siteConfig.supportedLanguages);

  const filtered = allLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  const isSelected = (code: string) => selectedLanguages.some((l) => l.code === code);

  const toggleLanguage = (lang: LanguageOption) => {
    if (isSelected(lang.code)) {
      onChange(selectedLanguages.filter((l) => l.code !== lang.code));
    } else {
      onChange([...selectedLanguages, lang]);
    }
  };

  const handleAddCustom = () => {
    if (!customLanguage.trim()) return;
    const name = customLanguage.trim();
    const code = name.toLowerCase().substring(0, 3);
    const newLang: LanguageOption = {
      name,
      code,
      script: 'Standard',
      locale: `${code}-CUSTOM`
    };
    setAllLanguages([...allLanguages, newLang]);
    onChange([...selectedLanguages, newLang]);
    setCustomLanguage('');
    setShowCustomModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search languages (e.g. Hindi, Hinglish, Spanish)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-400 border border-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Custom Language
        </button>
      </div>

      {/* Grid of Languages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
        {filtered.map((lang) => {
          const selected = isSelected(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => toggleLanguage(lang)}
              className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                selected
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-100">{lang.name}</span>
                <span className="text-[11px] text-slate-500">{lang.script}</span>
              </div>
              <div
                className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                  selected
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Language Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-semibold text-white">Add Custom Language</h4>
            <p className="text-xs text-slate-400">
              Specify custom language or dialect for AI review generation.
            </p>
            <input
              type="text"
              placeholder="e.g. Swahili, Tagalog, Esperanto"
              value={customLanguage}
              onChange={(e) => setCustomLanguage(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustom}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white"
              >
                Add Language
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
