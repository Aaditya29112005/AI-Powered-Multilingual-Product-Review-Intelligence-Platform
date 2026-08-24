export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  source_url: string;
  raw_data?: Record<string, any>;
  structured_data?: {
    name: string;
    brand?: string;
    category?: string;
    description?: string;
    features?: string[];
    specifications?: Record<string, string>;
    price?: string;
    currency?: string;
    images?: string[];
  };
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LanguageConfig {
  id?: string;
  language: string;
  language_code: string;
  script: string;
  locale: string;
  quantity: number;
  quantity_requested?: number;
  quantity_generated?: number;
}

export interface Job {
  id: string;
  user_id: string;
  product_id: string;
  total_requested: number;
  total_generated: number;
  total_approved: number;
  status: string;
  progress: number;
  length: string;
  tone: string;
  content_type: string;
  rating_distribution: Record<string, number>;
  created_at: string;
  completed_at?: string;
  languages?: LanguageConfig[];
}

export interface ContentItem {
  id: string;
  product_id: string;
  job_id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  content: string;
  language: string;
  language_code: string;
  script: string;
  locale: string;
  content_origin: string; // synthetic_ai_generated
  quality_score: number;
  similarity_score: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Review' | 'Regenerated';
  created_at: string;
}

export interface LanguageSummaryItem {
  language: string;
  language_code: string;
  requested: number;
  generated: number;
  approved: number;
  needs_review: number;
}

export interface LanguageSummary {
  job_id: string;
  summaries: LanguageSummaryItem[];
  total_requested: number;
  total_generated: number;
  total_approved: number;
  total_needs_review: number;
}

export interface ExportItem {
  id: string;
  job_id: string;
  export_mode: 'combined' | 'per_language' | 'both';
  file_type: string;
  file_name: string;
  download_url: string;
  created_at: string;
}
