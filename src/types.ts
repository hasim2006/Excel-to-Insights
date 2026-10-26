export type Page = 'dashboard' | 'chat' | 'sources' | 'reports' | 'insights' | 'models' | 'settings';

export type AppState = 'landing' | 'processing' | 'dashboard' | 'auth';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface KPIData {
  label: string;
  value: string;
  trend: number;
  color: string;
}

export interface ChartData {
  name: string;
  [key: string]: any;
}

export interface AIModelProvider {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'connecting' | 'disconnected';
  latency: string;
  usage: string;
  cost: string;
  color: string;
  accent: string;
  apiKey?: string;
  endpointUrl?: string;
}

export interface DatasetInsight {
  title: string;
  description: string;
  score: number;
  type: 'opportunity' | 'anomaly' | 'optimization' | 'strategy';
}

export interface DatasetSummary {
  fileName: string;
  fileSize: string;
  rowCount: number;
  columnCount: number;
  columns: string[];
  previewRows: Record<string, any>[];
  kpis: KPIData[];
  revenueTrend: ChartData[];
  categoryDistribution: { name: string; value: number }[];
  insights: DatasetInsight[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  model?: string;
  hasChart?: boolean;
  chartData?: ChartData[];
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
