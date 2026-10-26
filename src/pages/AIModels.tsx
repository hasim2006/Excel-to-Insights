import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Key, 
  CheckCircle2, 
  Lock, 
  Server, 
  Link2, 
  Settings2, 
  Check, 
  Eye, 
  EyeOff, 
  Loader2, 
  Zap, 
  Cpu, 
  X,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { useApp } from "../context/AppContext";

export function AIModels() {
  const { 
    models, 
    activeModelId, 
    setActiveModelId, 
    updateModelApiKey, 
    testModel, 
    addToast 
  } = useApp();

  const [keyInputs, setKeyInputs] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    models.forEach((m) => {
      map[m.id] = m.apiKey || '';
    });
    return map;
  });

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [testingModelId, setTestingModelId] = useState<string | null>(null);
  const [customEndpointModal, setCustomEndpointModal] = useState(false);
  const [routingModal, setRoutingModal] = useState(false);

  // Custom Endpoint state
  const [customName, setCustomName] = useState('Private vLLM Cluster');
  const [customUrl, setCustomUrl] = useState('https://vllm.internal.corp/v1');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const handleKeyChange = (id: string, val: string) => {
    setKeyInputs((prev) => ({ ...prev, [id]: val }));
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveKey = (id: string) => {
    const key = keyInputs[id] || '';
    updateModelApiKey(id, key);
  };

  const handleTestConnection = async (id: string) => {
    setTestingModelId(id);
    await testModel(id);
    setTestingModelId(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 space-y-6 h-full flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 uppercase tracking-tighter">
            AI Models & Inference Engines
          </h1>
          <p className="text-white/40 mt-1 font-medium text-sm">
            Configure LLM endpoints, manage API credentials, and test connection latencies.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setCustomEndpointModal(true)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            <Link2 className="w-4 h-4 text-accent-cyan" /> Custom Endpoint
          </button>
          <button 
            onClick={() => setRoutingModal(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-300 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <Settings2 className="w-4 h-4" /> Global Routing
          </button>
        </div>
      </div>

      {/* Models Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 overflow-y-auto no-scrollbar pb-6"
      >
        {models.map((provider) => {
          const isActive = activeModelId === provider.id;
          const isTesting = testingModelId === provider.id;
          const isConnected = provider.status === 'connected';

          return (
            <motion.div 
              key={provider.id}
              variants={item}
              className={cn(
                "bg-[#111] border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 relative group",
                isActive ? "border-accent-cyan shadow-[0_0_25px_rgba(0,240,255,0.15)]" : "border-white/10 hover:border-white/20"
              )}
            >
              <div className={cn("h-1.5 w-full bg-gradient-to-r", provider.color)}></div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center text-white">
                      {provider.id === 'gemini' ? (
                        <Sparkles className="w-6 h-6 text-cyan-400" />
                      ) : provider.id === 'claude' ? (
                        <Zap className="w-6 h-6 text-orange-400" />
                      ) : provider.id === 'openai' ? (
                        <Cpu className="w-6 h-6 text-emerald-400" />
                      ) : provider.id === 'deepseek' ? (
                        <Zap className="w-6 h-6 text-blue-400" />
                      ) : (
                        <Server className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg leading-tight">{provider.name}</h3>
                        {isActive && (
                          <span className="text-[9px] bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">{provider.description}</p>
                    </div>
                  </div>

                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 font-mono",
                    isConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                    provider.status === 'connecting' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                    "bg-white/5 text-white/40 border-white/10"
                  )}>
                    {isConnected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />}
                    {provider.status === 'connecting' && <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_#f97316]" />}
                    {provider.status === 'disconnected' && <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                    {provider.status}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5">
                    <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">Latency</div>
                    <div className="text-sm font-bold text-white font-mono">{provider.latency}</div>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5">
                    <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">Tokens</div>
                    <div className="text-sm font-bold text-white font-mono">{provider.usage}</div>
                  </div>
                  <div className="bg-[#0a0a0a] rounded-xl p-3 border border-white/5">
                    <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mb-1">Cost (MTD)</div>
                    <div className="text-sm font-bold text-white font-mono">{provider.cost}</div>
                  </div>
                </div>

                {/* API Configuration */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5 block">
                      API Credential Key
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="w-4 h-4 text-white/30" />
                      </div>
                      <input 
                        type={visibleKeys[provider.id] ? "text" : "password"} 
                        value={keyInputs[provider.id] || ''}
                        onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                        placeholder={isConnected ? "Key Configured (Enter to update)" : "Enter API Key (e.g. sk-...)"}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white focus:border-accent-cyan focus:outline-none transition-all font-mono placeholder:text-white/20"
                      />
                      <button 
                        type="button"
                        onClick={() => toggleVisibility(provider.id)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors"
                      >
                        {visibleKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {provider.id === 'ollama' && (
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5 block">
                        Local Host Endpoint URL
                      </label>
                      <input 
                        type="text" 
                        defaultValue={provider.endpointUrl || "http://localhost:11434/api/generate"}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:border-accent-cyan focus:outline-none transition-all font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-auto pt-3 border-t border-white/5 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleTestConnection(provider.id)}
                      disabled={isTesting}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors border border-white/5 flex items-center justify-center gap-1.5"
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-accent-cyan" />
                          <span>Testing...</span>
                        </>
                      ) : (
                        <span>Test Ping</span>
                      )}
                    </button>

                    <button 
                      onClick={() => handleSaveKey(provider.id)}
                      className="flex-1 bg-white/10 hover:bg-white/15 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-lg transition-colors border border-white/10"
                    >
                      Save Key
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveModelId(provider.id);
                      addToast('Active Engine Selected', `${provider.name} is now the primary AI analyst across all pages.`, 'success');
                    }}
                    className={cn(
                      "w-full text-[10px] font-black uppercase tracking-widest py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5",
                      isActive 
                        ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40" 
                        : "bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    )}
                  >
                    {isActive ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Engine</span>
                      </>
                    ) : (
                      <span>Set As Active Engine</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Custom Endpoint Modal */}
      <AnimatePresence>
        {customEndpointModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomEndpointModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0e1015] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-accent-cyan" />
                  <h3 className="text-lg font-bold text-white">Add Custom AI Endpoint</h3>
                </div>
                <button onClick={() => setCustomEndpointModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Cluster Name
                </label>
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  API Base URL
                </label>
                <input 
                  type="text" 
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-cyan font-mono"
                />
              </div>

              <button
                onClick={() => {
                  setCustomEndpointModal(false);
                  addToast('Endpoint Registered', `Connected to custom cluster "${customName}"`, 'success');
                }}
                className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Mount Custom Cluster
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Routing Modal */}
      <AnimatePresence>
        {routingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRoutingModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0e1015] border border-white/15 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-accent-purple" />
                  <h3 className="text-lg font-bold text-white">Global Inference Routing</h3>
                </div>
                <button onClick={() => setRoutingModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Lowest Latency Failover</div>
                    <div className="text-[10px] text-gray-400">Auto-routes to the fastest responsive model</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Cost Optimizer</div>
                    <div className="text-[10px] text-gray-400">Routes batch queries to Gemini Flash or Ollama</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Zero Data Retention Mode</div>
                    <div className="text-[10px] text-gray-400">Enforce enterprise privacy headers</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </div>
              </div>

              <button
                onClick={() => {
                  setRoutingModal(false);
                  addToast('Routing Rules Saved', 'Autonomous inference load balancer configured.', 'success');
                }}
                className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Apply Routing Policy
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
