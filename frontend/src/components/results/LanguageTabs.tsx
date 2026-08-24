'use client';

interface LanguageTabsProps {
  languages: string[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  counts: Record<string, number>;
}

export function LanguageTabs({ languages, activeTab, onSelectTab, counts }: LanguageTabsProps) {
  const tabs = ['ALL', ...languages];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const isSelected = activeTab.toUpperCase() === tab.toUpperCase();
        const count = counts[tab] || (tab === 'ALL' ? counts.total || 100 : 0);

        return (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{tab}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
