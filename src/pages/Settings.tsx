import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Database, 
  Users, 
  Key, 
  Bell, 
  Layout as LayoutIcon,
  Check,
  Save,
  LogIn,
  LogOut,
  Sparkles,
  Server
} from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export function Settings() {
  const { 
    user, 
    logout, 
    setShowAuthModal, 
    models, 
    updateModelApiKey, 
    addToast,
    activeModelId,
    setActiveModelId
  } = useApp();

  const [activeTab, setActiveTab] = useState('general');
  const [systemName, setSystemName] = useState('NexusBI Autonomous Intelligence');
  const [refreshInterval, setRefreshInterval] = useState('5 minutes');
  const [zeroTrust, setZeroTrust] = useState(true);
  const [anomalyThreshold, setAnomalyThreshold] = useState('95%');

  const tabs = [
    { id: 'general', label: 'General', icon: LayoutIcon },
    { id: 'ai', label: 'AI Inference Engines', icon: SettingsIcon },
    { id: 'database', label: 'Data Pipelines', icon: Database },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'users', label: 'User Profile & Roles', icon: Users },
    { id: 'api', label: 'Enterprise API Keys', icon: Key },
    { id: 'notifications', label: 'Alerting Triggers', icon: Bell },
  ];

  const handleSave = () => {
    addToast('Configuration Saved', 'System preferences updated and synced across all nodes.', 'success');
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 flex-shrink-0">
        <h1 className="text-2xl font-display font-bold text-white tracking-tight mb-6">
          System Control & Settings
        </h1>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                  isActive 
                    ? 'bg-white/15 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cyan' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Settings Panel */}
      <div className="flex-1 space-y-6">
        <div className="glass-card p-6 rounded-3xl border border-white/10">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">General Parameters</h2>
                <p className="text-xs text-gray-400 mt-0.5">Global branding and execution parameters for your workspace.</p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5 font-mono">
                    Workspace Identifier
                  </label>
                  <input 
                    type="text" 
                    value={systemName} 
                    onChange={(e) => setSystemName(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5 font-mono">
                    Telemetry Refresh Frequency
                  </label>
                  <select 
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  >
                    <option value="1 minute">Real-Time (1 minute)</option>
                    <option value="5 minutes">Standard (5 minutes)</option>
                    <option value="15 minutes">Batch (15 minutes)</option>
                    <option value="1 hour">Hourly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* AI Models Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">AI Inference Configuration</h2>
                <p className="text-xs text-gray-400 mt-0.5">Configure live API credentials for multi-modal reasoning engines.</p>
              </div>

              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="bg-dark-800/60 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-dark-700 flex items-center justify-center border border-white/5 font-bold text-accent-cyan">
                        {model.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-bold text-sm">{model.name}</h3>
                          {activeModelId === model.id && (
                            <span className="text-[9px] bg-accent-cyan/20 text-accent-cyan px-2 py-0.5 rounded-full font-mono">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{model.description} • {model.latency}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {model.status}
                      </span>
                      <button 
                        onClick={() => {
                          setActiveModelId(model.id);
                          addToast('Model Selected', `Activated ${model.name}`, 'success');
                        }}
                        className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-colors"
                      >
                        Set Active
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Databases Tab */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">Data Lake & Storage Settings</h2>
                <p className="text-xs text-gray-400 mt-0.5">Connection pool limits and caching strategies.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="p-4 bg-dark-800/60 rounded-xl border border-white/10">
                  <div className="text-xs font-bold text-white mb-1">Max Concurrent Queries</div>
                  <div className="text-[11px] text-gray-400 mb-2">Limit parallel vector scans</div>
                  <input type="number" defaultValue={24} className="bg-dark-900 border border-white/10 rounded-lg p-2 text-sm text-white w-full" />
                </div>
                <div className="p-4 bg-dark-800/60 rounded-xl border border-white/10">
                  <div className="text-xs font-bold text-white mb-1">In-Memory Cache Size</div>
                  <div className="text-[11px] text-gray-400 mb-2">Workbook RAM buffer</div>
                  <input type="text" defaultValue="4 GB" className="bg-dark-900 border border-white/10 rounded-lg p-2 text-sm text-white w-full" />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">Security & Zero Trust</h2>
                <p className="text-xs text-gray-400 mt-0.5">Access control and compliance safeguards.</p>
              </div>

              <div className="space-y-3 max-w-xl">
                <div className="p-4 bg-dark-800/60 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Zero Trust Network Architecture</div>
                    <div className="text-[10px] text-gray-400">Authenticate all database API tokens per request</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={zeroTrust} 
                    onChange={(e) => setZeroTrust(e.target.checked)} 
                    className="w-4 h-4 accent-cyan-500" 
                  />
                </div>

                <div className="p-4 bg-dark-800/60 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Row-Level Security (RLS)</div>
                    <div className="text-[10px] text-gray-400">Strict regional isolation on sensitive financial tables</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500" />
                </div>
              </div>
            </div>
          )}

          {/* Users & Profile Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">Active Session & Identity</h2>
                <p className="text-xs text-gray-400 mt-0.5">Manage user credentials and authorized roles.</p>
              </div>

              {user ? (
                <div className="max-w-md bg-dark-800/80 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-blue to-accent-purple overflow-hidden border border-white/20 flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-white">{user.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{user.name}</h3>
                      <p className="text-xs text-accent-cyan font-mono">{user.role}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex gap-3">
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex-1 bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Switch Profile
                    </button>
                    <button
                      onClick={logout}
                      className="flex-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md bg-dark-800/80 border border-white/10 rounded-2xl p-6 text-center space-y-4">
                  <p className="text-xs text-gray-300">You are currently browsing as an unauthenticated guest.</p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full bg-white text-black py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In or Create Account</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">Application API Tokens</h2>
                <p className="text-xs text-gray-400 mt-0.5">Use these keys to ingest datasets programmatically via REST / Python.</p>
              </div>

              <div className="max-w-xl space-y-3">
                <div className="p-4 bg-dark-800/80 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">nex_live_99f2b841a0e7d4</div>
                    <div className="text-[10px] text-gray-400 font-mono">Created Today • Full Read/Write</div>
                  </div>
                  <button 
                    onClick={() => addToast('Key Copied', 'Copied API key to clipboard.', 'success')}
                    className="text-xs text-accent-cyan font-bold hover:underline"
                  >
                    Copy Token
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white">Alerting & Trigger Thresholds</h2>
                <p className="text-xs text-gray-400 mt-0.5">Define automated alerts when metrics diverge from prediction.</p>
              </div>

              <div className="space-y-3 max-w-xl">
                <div className="p-4 bg-dark-800/60 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Autonomous Anomaly Alerting</div>
                    <div className="text-[10px] text-gray-400">Trigger webhook when standard deviation &gt; 2.5</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500" />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
