import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Sparkles, Cpu, ChevronDown, Check, User as UserIcon } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function Header() {
  const { 
    activeModelId, 
    setActiveModelId, 
    models, 
    dataset, 
    setCurrentPage, 
    sendMessage, 
    user, 
    setShowAuthModal,
    addToast
  } = useApp();

  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [headerQuery, setHeaderQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const activeModel = models.find((m) => m.id === activeModelId) || models[0];

  const handleExecute = () => {
    if (!headerQuery.trim()) return;
    const q = headerQuery;
    setHeaderQuery("");
    setCurrentPage("chat");
    sendMessage(q);
  };

  const handleQuickQuery = (q: string) => {
    setCurrentPage("chat");
    sendMessage(q);
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addToast('Speech Recognition', 'Speech API simulated: Listening for voice commands...', 'info');
      setIsListening(true);
      setTimeout(() => {
        setHeaderQuery("Forecast next quarter sales for APAC region");
        setIsListening(false);
        addToast('Voice Captured', '"Forecast next quarter sales for APAC region"', 'success');
      }, 2000);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        addToast('Voice Listening', 'Speak your query now...', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setHeaderQuery(transcript);
        setIsListening(false);
        addToast('Voice Recognized', transcript, 'success');
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="w-full flex flex-col relative z-20">
      {/* Top Global Status */}
      <div className="h-10 glass-panel border-x-0 border-t-0 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-accent-emerald shadow-[0_0_8px_#00FF66]"></div>
              <div className="absolute inset-0 bg-accent-emerald rounded-full blur-[4px] animate-pulse"></div>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-accent-emerald uppercase drop-shadow-[0_0_2px_rgba(0,255,102,0.5)]">
              GPU Online
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_8px_#00F0FF]"></div>
            <span className="text-[10px] font-bold tracking-widest text-accent-cyan uppercase drop-shadow-[0_0_2px_rgba(0,240,255,0.5)]">
              Core: {dataset.fileName} ({dataset.rowCount.toLocaleString()} Rows)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            {models.slice(0, 3).map((ai) => (
              <button 
                key={ai.id} 
                onClick={() => {
                  setActiveModelId(ai.id);
                  addToast('Model Selected', `Active model set to ${ai.name}`, 'info');
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] transition-all ${
                  activeModelId === ai.id 
                    ? 'bg-white/15 text-white border border-white/25 shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
                    : 'glass-button text-white/60 hover:text-white'
                }`}
              >
                <span className="font-medium">{ai.name.split(' ')[0]}</span>
                <div className={`w-1.5 h-1.5 rounded-full ${ai.status === 'connected' ? 'bg-accent-emerald' : 'bg-orange-400'}`}></div>
              </button>
            ))}
          </div>

          {/* User profile quick toggle */}
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <div className="w-4 h-4 rounded-full bg-accent-cyan/20 flex items-center justify-center">
              <UserIcon className="w-2.5 h-2.5 text-accent-cyan" />
            </div>
            <span className="text-[10px] font-mono text-gray-300">
              {user ? user.name.split(' ')[0] : 'Sign In'}
            </span>
          </button>
        </div>
      </div>

      {/* Header Area */}
      <header className="py-5 px-6 flex flex-col items-center relative z-20">
        <div className="text-center mb-4">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold tracking-tighter text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            AI Command Center
          </motion.h1>
          <p className="text-accent-cyan/80 text-xs font-semibold tracking-widest drop-shadow-[0_0_5px_rgba(0,240,255,0.5)] uppercase font-mono">
            Autonomous Analytics & Execution Engine
          </p>
        </div>

        <div className="w-full max-w-2xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan rounded-2xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500"></div>
          <div className="relative glass-panel rounded-2xl flex items-center p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_15px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:-translate-y-0.5">
            
            {/* Model Selector Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 border-r border-white/10 hover:bg-white/5 rounded-lg transition-colors group/model"
              >
                <Cpu className="w-4 h-4 text-accent-purple drop-shadow-[0_0_5px_rgba(123,44,191,0.8)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white truncate max-w-[90px]">
                  {activeModel.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover/model:text-white transition-colors" />
              </button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-56 bg-[#0e1015] border border-white/15 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl"
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5">
                      Select AI Provider
                    </div>
                    {models.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveModelId(m.id);
                          setModelDropdownOpen(false);
                          addToast('AI Active', `Switched to ${m.name}`, 'info');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          activeModelId === m.id ? 'bg-white/15 text-white font-bold' : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{m.name}</div>
                          <div className="text-[9px] text-gray-400">{m.latency} • {m.status}</div>
                        </div>
                        {activeModelId === m.id && <Check className="w-3.5 h-3.5 text-accent-cyan" />}
                      </button>
                    ))}
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setModelDropdownOpen(false);
                          setCurrentPage('models');
                        }}
                        className="w-full text-center text-[10px] text-accent-cyan font-bold py-1 hover:underline"
                      >
                        Manage Models & Keys →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 text-accent-blue">
              <Sparkles className="w-5 h-5 animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            </div>

            <input 
              type="text" 
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
              placeholder="Ask AI: 'Compare APAC vs Europe revenue and forecast Q4'..."
              className="flex-1 bg-transparent border-none outline-none text-white px-2 placeholder:text-white/40 font-medium text-sm"
            />

            <div className="flex items-center gap-2 px-2">
              <button 
                onClick={toggleMic}
                className={`p-2 rounded-lg text-white transition-colors relative overflow-hidden group/btn ${
                  isListening ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'hover:bg-white/10'
                }`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4 relative z-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
              </button>
              <button 
                onClick={handleExecute}
                className="relative overflow-hidden bg-white text-black px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                <span className="relative z-10">Execute</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-3 justify-center items-center">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Quick queries:</span>
            {['Forecast Next Quarter', 'Find Outliers', 'Executive Summary'].map((q) => (
              <button 
                key={q} 
                onClick={() => handleQuickQuery(q)}
                className="text-[10px] text-accent-cyan/80 hover:text-accent-cyan transition-colors font-medium hover:underline"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}
