import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  User, 
  Page, 
  AppState, 
  AIModelProvider, 
  DatasetSummary, 
  ChatMessage, 
  ToastNotification 
} from '../types';
import { defaultDataset, parseFileToDataset } from '../lib/dataParser';
import { askAI, testProviderConnection } from '../lib/aiService';

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: string, name?: string) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;

  // App navigation
  appState: AppState;
  setAppState: (state: AppState) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;

  // Dataset
  dataset: DatasetSummary;
  isUploading: boolean;
  uploadFile: (file: File) => Promise<boolean>;
  resetToSampleData: () => void;

  // AI Models
  activeModelId: string;
  setActiveModelId: (id: string) => void;
  models: AIModelProvider[];
  updateModelApiKey: (id: string, apiKey: string) => void;
  toggleModelConnection: (id: string) => void;
  testModel: (id: string) => Promise<{ success: boolean; message: string; latency: string }>;

  // Chat
  chatMessages: ChatMessage[];
  isChatThinking: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const initialModels: AIModelProvider[] = [
  {
    id: 'claude',
    name: 'Anthropic Claude',
    description: 'Claude 3.5 Sonnet, Opus 3',
    status: 'connected',
    latency: '142ms',
    usage: '1.4M',
    cost: '$14.20',
    color: 'from-orange-500/20 to-orange-500/5',
    accent: 'text-orange-500',
    apiKey: 'sk-ant-api03-live-prod••••••••',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Gemini 2.5 Flash, 1.5 Pro',
    status: 'connected',
    latency: '95ms',
    usage: '890K',
    cost: '$4.10',
    color: 'from-cyan-500/20 to-cyan-500/5',
    accent: 'text-cyan-400',
    apiKey: '',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o, o1-preview, GPT-4 Turbo',
    status: 'connected',
    latency: '118ms',
    usage: '2.1M',
    cost: '$28.40',
    color: 'from-emerald-500/20 to-emerald-500/5',
    accent: 'text-emerald-500',
    apiKey: 'sk-proj-live-mock••••••••',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek V3 / R1',
    description: 'Reasoning & Code Analytics',
    status: 'connected',
    latency: '180ms',
    usage: '320K',
    cost: '$1.80',
    color: 'from-blue-500/20 to-blue-500/5',
    accent: 'text-blue-400',
    apiKey: 'sk-ds-prod-mock••••••••',
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    description: 'Llama 3.3, Mistral, Gemma 2',
    status: 'connecting',
    latency: '45ms',
    usage: '0',
    cost: 'Free (Local)',
    color: 'from-gray-500/20 to-gray-500/5',
    accent: 'text-gray-400',
    endpointUrl: 'http://localhost:11434/api/generate',
  },
];

const defaultInitialUser: User = {
  id: 'usr-1',
  name: 'Alex Vance',
  email: 'alex.vance@enterprise.ai',
  role: 'Chief Data Officer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return defaultInitialUser;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  // App navigation state
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // Dataset state
  const [dataset, setDataset] = useState<DatasetSummary>(() => {
    const saved = localStorage.getItem('nexus_dataset');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return defaultDataset;
  });
  const [isUploading, setIsUploading] = useState(false);

  // Models state
  const [models, setModels] = useState<AIModelProvider[]>(() => {
    const saved = localStorage.getItem('nexus_models');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return initialModels;
  });
  const [activeModelId, setActiveModelId] = useState<string>('claude');

  // Toasts state
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'Greetings. I am NexusBI Autonomous Intelligence Engine. Your data core is active and synchronized. How may I assist your business analysis today?',
      timestamp: '09:00 AM',
      model: 'Claude 3.5',
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'Compare APAC vs North America regional sales and profit trajectory.',
      timestamp: '09:02 AM',
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: 'Comparative regional synthesis indicates North America leads in baseline gross revenue (₹6.2 Lakhs), while Asia Pacific exhibits the highest quarter-over-quarter expansion (+34.2%) fueled by enterprise cloud expansion.',
      timestamp: '09:02 AM',
      model: 'Claude 3.5',
      hasChart: true,
      chartData: [
        { name: 'July', q2: 0.40, q3: 0.45 },
        { name: 'Aug', q2: 0.30, q3: 0.38 },
        { name: 'Sep', q2: 0.20, q3: 0.31 },
      ],
    },
  ]);
  const [isChatThinking, setIsChatThinking] = useState(false);

  // Toast Helpers
  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth actions
  const login = (email: string, role = 'Senior Data Analyst', name = 'Alex Vance') => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
    setShowAuthModal(false);
    addToast('Authentication Verified', `Welcome back, ${newUser.name}! Access granted.`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    setAppState('landing');
    addToast('Logged Out', 'You have been securely signed out of NexusBI.', 'info');
  };

  // File Upload Action
  const uploadFile = async (file: File): Promise<boolean> => {
    setIsUploading(true);
    try {
      const parsed = await parseFileToDataset(file);
      setDataset(parsed);
      localStorage.setItem('nexus_dataset', JSON.stringify(parsed));
      addToast('Dataset Ingested', `Successfully loaded "${file.name}" (${parsed.rowCount.toLocaleString()} rows).`, 'success');
      setIsUploading(false);
      return true;
    } catch (err: any) {
      console.error(err);
      addToast('Upload Error', err.message || 'Failed to parse file. Ensure it is a valid CSV or Excel file.', 'error');
      setIsUploading(false);
      return false;
    }
  };

  const resetToSampleData = () => {
    setDataset(defaultDataset);
    localStorage.setItem('nexus_dataset', JSON.stringify(defaultDataset));
    addToast('Sample Restored', 'Restored master enterprise sales dataset.', 'info');
  };

  // Models Actions
  const updateModelApiKey = (id: string, apiKey: string) => {
    setModels((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, apiKey, status: apiKey ? 'connected' as const : 'disconnected' as const } : m));
      localStorage.setItem('nexus_models', JSON.stringify(updated));
      return updated;
    });
    addToast('API Key Saved', `Configuration updated for ${id.toUpperCase()}.`, 'success');
  };

  const toggleModelConnection = (id: string) => {
    setModels((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'connected' ? 'disconnected' as const : 'connected' as const;
          return { ...m, status: nextStatus };
        }
        return m;
      });
      localStorage.setItem('nexus_models', JSON.stringify(updated));
      return updated;
    });
  };

  const testModel = async (id: string) => {
    const targetModel = models.find((m) => m.id === id);
    const result = await testProviderConnection(id, targetModel?.apiKey);
    if (result.success) {
      setModels((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: 'connected', latency: result.latency } : m))
      );
      addToast('Connection Verified', `${result.message} Latency: ${result.latency}`, 'success');
    } else {
      addToast('Connection Failed', result.message, 'error');
    }
    return result;
  };

  // Chat Actions
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatThinking(true);

    try {
      const activeModel = models.find((m) => m.id === activeModelId);
      const response = await askAI(
        text,
        activeModelId,
        activeModel?.apiKey,
        dataset,
        chatMessages
      );

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: activeModel?.name || 'AI Analyst',
        hasChart: response.hasChart,
        chartData: response.chartData,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      addToast('AI Generation Failed', err.message || 'Error communicating with AI engine', 'error');
    } finally {
      setIsChatThinking(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    addToast('Chat Cleared', 'Conversation session restarted.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        showAuthModal,
        setShowAuthModal,
        appState,
        setAppState,
        currentPage,
        setCurrentPage,
        dataset,
        isUploading,
        uploadFile,
        resetToSampleData,
        activeModelId,
        setActiveModelId,
        models,
        updateModelApiKey,
        toggleModelConnection,
        testModel,
        chatMessages,
        isChatThinking,
        sendMessage,
        clearChat,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
