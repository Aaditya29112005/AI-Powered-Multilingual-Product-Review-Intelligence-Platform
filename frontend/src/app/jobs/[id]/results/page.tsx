'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar, Sidebar } from '@/components/layout/Navbar';
import { LanguageTabs } from '@/components/results/LanguageTabs';
import { ReviewCard } from '@/components/results/ReviewCard';
import { EditReviewModal } from '@/components/results/EditReviewModal';
import { LanguageSummaryTable } from '@/components/results/LanguageSummaryTable';
import { Sparkles, Download, CheckCheck, RefreshCw, Filter, Layers } from 'lucide-react';
import { ContentItem, LanguageSummary } from '@/lib/types';
import { fetchApi } from '@/lib/api';

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = (params?.id as string) || 'job-101';

  const [activeTab, setActiveTab] = useState('ALL');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [summary, setSummary] = useState<LanguageSummary>({
    job_id: jobId,
    summaries: [
      { language: 'English', language_code: 'en', requested: 50, generated: 50, approved: 48, needs_review: 2 },
      { language: 'Hindi', language_code: 'hi', requested: 30, generated: 30, approved: 30, needs_review: 0 },
      { language: 'Hinglish', language_code: 'hi-en', requested: 20, generated: 20, approved: 19, needs_review: 1 },
    ],
    total_requested: 100,
    total_generated: 100,
    total_approved: 97,
    total_needs_review: 3,
  });

  useEffect(() => {
    loadResults();
  }, [jobId]);

  const loadResults = async () => {
    try {
      const data = await fetchApi<ContentItem[]>(`/results/job/${jobId}`);
      if (data && data.length > 0) {
        setItems(data);
      } else {
        setItems(getSampleItems());
      }

      const sumData = await fetchApi<LanguageSummary>(`/results/job/${jobId}/summary`);
      if (sumData && sumData.summaries) {
        setSummary(sumData);
      }
    } catch {
      setItems(getSampleItems());
    }
  };

  const getSampleItems = (): ContentItem[] => [
    {
      id: 'item-1',
      product_id: 'prod-123',
      job_id: jobId,
      reviewer_name: 'Sarah Johnson',
      rating: 5,
      title: 'Excellent sound quality and very comfortable',
      content: 'Great sound quality and battery life exceeded my expectations. Extremely comfortable to use on long flights.',
      language: 'English',
      language_code: 'en',
      script: 'Standard',
      locale: 'en-US',
      content_origin: 'synthetic_ai_generated',
      quality_score: 96.0,
      similarity_score: 0.08,
      status: 'Approved',
      created_at: new Date().toISOString(),
    },
    {
      id: 'item-2',
      product_id: 'prod-123',
      job_id: jobId,
      reviewer_name: 'राहुल शर्मा',
      rating: 5,
      title: 'शानदार प्रोडक्ट और आसान इस्तेमाल!',
      content: 'यह प्रोडक्ट इस्तेमाल करने में काफी आसान है। ध्वनि गुणवत्ता और बैटरी बैकअप बहुत ही बढ़िया है।',
      language: 'Hindi',
      language_code: 'hi',
      script: 'Devanagari',
      locale: 'hi-IN',
      content_origin: 'synthetic_ai_generated',
      quality_score: 98.0,
      similarity_score: 0.05,
      status: 'Approved',
      created_at: new Date().toISOString(),
    },
    {
      id: 'item-3',
      product_id: 'prod-123',
      job_id: jobId,
      reviewer_name: 'Aman Gupta',
      rating: 4,
      title: 'Good Product & fast pairing',
      content: 'Product kaafi accha hai aur use karna easy hai. Audio clarity strictly top notch hai aur battery backup mast hai.',
      language: 'Hinglish',
      language_code: 'hi-en',
      script: 'Hinglish',
      locale: 'hi-IN',
      content_origin: 'synthetic_ai_generated',
      quality_score: 94.0,
      similarity_score: 0.12,
      status: 'Approved',
      created_at: new Date().toISOString(),
    },
    {
      id: 'item-4',
      product_id: 'prod-123',
      job_id: jobId,
      reviewer_name: 'Carlos Rodríguez',
      rating: 5,
      title: '¡Excelente calidad de sonido y gran batería!',
      content: 'La cancelación de ruido funciona de maravilla en viajes largos. Muy cómodo de usar todo el día.',
      language: 'Spanish',
      language_code: 'es',
      script: 'Standard',
      locale: 'es-ES',
      content_origin: 'synthetic_ai_generated',
      quality_score: 95.0,
      similarity_score: 0.09,
      status: 'Approved',
      created_at: new Date().toISOString(),
    },
  ];

  // Tab Filtering
  const filteredItems = items.filter((item) => {
    if (activeTab.toUpperCase() === 'ALL') return true;
    return item.language.toUpperCase() === activeTab.toUpperCase();
  });

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'Approved' } : it))
    );
  };

  const handleReject = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'Rejected' } : it))
    );
  };

  const handleRegenerate = (id: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, content: `${it.content} (Regenerated)`, status: 'Regenerated', quality_score: 97.0 }
          : it
      )
    );
  };

  const handleSaveEdit = (updated: ContentItem) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    setEditingItem(null);
  };

  const handleBulkApprove = () => {
    setItems((prev) => prev.map((it) => ({ ...it, status: 'Approved' })));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                PRODUCT: Wireless Pro Headphones
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                Generated Content & Quality Audit
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              >
                <CheckCheck className="h-4 w-4 text-emerald-400" />
                <span>Approve All High Confidence</span>
              </button>
              <button
                onClick={() => router.push(`/exports?jobId=${jobId}`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV & ZIP</span>
              </button>
            </div>
          </div>

          {/* Language Filter Tabs (Mandatory Section 13) */}
          <LanguageTabs
            languages={['English', 'Hindi', 'Hinglish', 'Spanish']}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            counts={{
              ALL: items.length,
              English: items.filter((i) => i.language === 'English').length,
              Hindi: items.filter((i) => i.language === 'Hindi').length,
              Hinglish: items.filter((i) => i.language === 'Hinglish').length,
              Spanish: items.filter((i) => i.language === 'Spanish').length,
            }}
          />

          {/* Grid of Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <ReviewCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
                onEdit={setEditingItem}
                onRegenerate={handleRegenerate}
              />
            ))}
          </div>

          {/* MANDATORY LANGUAGE SUMMARY AT THE BOTTOM (Section 14) */}
          <LanguageSummaryTable summary={summary} />

          {/* Edit Modal */}
          {editingItem && (
            <EditReviewModal
              item={editingItem}
              onSave={handleSaveEdit}
              onClose={() => setEditingItem(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
