import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Send, 
  Mic, 
  Paperclip, 
  Sparkles, 
  Cpu, 
  ChevronDown, 
  Trash2, 
  FileSpreadsheet,
  Check,
  Bot
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useApp } from "../context/AppContext";

export function Chat() {
  const { 
    chatMessages, 
    sendMessage, 
    isChatThinking, 
    clearChat, 
    activeModelId, 
    setActiveModelId, 
    models, 
    dataset, 
    uploadFile,
    addToast 
  } = useApp();

  const [input, setInput] = useState('');
  const [modelDropdown, setModelDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeModel = models.find((m) => m.id === activeModelId) || models[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatThinking]);

  const handleSend = () => {
    if (!input.trim() || isChatThinking) return;
    const text = input;
    setInput('');
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const success = await uploadFile(file);
      if (success) {
        sendMessage(`I have uploaded a new dataset: ${file.name}. Please summarize its key columns and performance metrics.`);
      }
    }
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addToast('Voice Recognition', 'Listening for speech input...', 'info');
      setIsListening(true);
      setTimeout(() => {
        setInput("Analyze revenue concentration and highlight top performing product categories");
        setIsListening(false);
        addToast('Voice Captured', 'Voice query transcribed.', 'success');
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
        addToast('Listening', 'Please speak into your microphone...', 'info');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto h-[calc(100vh-140px)] flex flex-col pb-6 relative z-10">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileAttach} 
        accept=".xlsx,.xls,.csv" 
        className="hidden" 
      />

      {/* Chat Header Bar */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-blue/15 border border-accent-cyan/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous Analyst Dialogue
              <span className="text-[9px] bg-white/10 text-accent-cyan px-2 py-0.5 rounded-full font-mono">
                {dataset.fileName}
              </span>
            </h2>
            <p className="text-[10px] text-gray-400 font-mono">
              Operating on {dataset.rowCount.toLocaleString()} rows • Connected to {activeModel.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 no-scrollbar pb-8">
        {chatMessages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] flex-shrink-0 border border-white/20 relative group">
                <Sparkles className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
            )}
            
            <div className={`max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-accent-cyan/15 to-accent-blue/15 border border-accent-cyan/30 text-white' 
                : 'glass-card text-gray-200 border-white/10'
            } p-5 rounded-2xl shadow-2xl relative overflow-hidden group`}>
              
              {/* Message Header */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2 font-mono">
                <span className="font-bold text-accent-cyan uppercase tracking-wider">
                  {msg.role === 'user' ? 'Executive Prompt' : (msg.model || activeModel.name)}
                </span>
                <span>{msg.timestamp || 'Just now'}</span>
              </div>

              <div className="leading-relaxed relative z-10 font-medium tracking-wide text-sm whitespace-pre-wrap">
                {msg.content}
              </div>
              
              {/* Embedded Interactive Chart */}
              {msg.hasChart && msg.chartData && (
                <div className="mt-5 h-[260px] w-full bg-dark-900/70 rounded-xl p-4 border border-white/10 relative z-10 shadow-inner">
                  <div className="text-[10px] font-bold text-accent-cyan uppercase tracking-widest mb-3 font-mono">
                    Dynamic Analytical Visualizer
                  </div>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={msg.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chatChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(23,26,33,0.95)', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '10px' }} 
                        itemStyle={{ fontWeight: 600, color: '#fff' }}
                      />
                      <Area type="monotone" dataKey={Object.keys(msg.chartData[0] || {})[1] || 'revenue'} stroke="#00F0FF" fill="url(#chatChartGrad)" strokeWidth={2.5} activeDot={{ r: 5, fill: '#00F0FF', stroke: '#fff', strokeWidth: 2 }} />
                      {Object.keys(msg.chartData[0] || {})[2] && (
                        <Area type="monotone" dataKey={Object.keys(msg.chartData[0] || {})[2]} stroke="#7B2CBF" fill="none" strokeWidth={2} strokeDasharray="4 4" />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-11 h-11 rounded-2xl glass-panel flex items-center justify-center flex-shrink-0 border border-white/10">
                <User className="w-5 h-5 text-accent-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" />
              </div>
            )}
          </motion.div>
        ))}

        {isChatThinking && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 justify-start"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center flex-shrink-0 animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="glass-card p-4 rounded-2xl border-white/10 flex items-center gap-3 text-xs text-accent-cyan font-mono">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>{activeModel.name} synthesizing regression breakdown...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Panel */}
      <div className="mt-auto relative group z-20">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700"></div>
        <div className="relative flex items-end glass-panel rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-transform duration-500">
          
          {/* Active Model Switcher */}
          <div className="relative self-center">
            <button
              type="button"
              onClick={() => setModelDropdown(!modelDropdown)}
              className="flex items-center gap-2 px-3.5 py-3 border-r border-white/10 hover:bg-white/5 rounded-xl transition-colors mr-2 group/model"
            >
              <Cpu className="w-4 h-4 text-accent-purple group-hover/model:drop-shadow-[0_0_8px_rgba(123,44,191,0.8)] transition-all" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {activeModel.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400 group-hover/model:text-white" />
            </button>

            <AnimatePresence>
              {modelDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute bottom-full mb-3 left-0 w-52 bg-[#0e1015] border border-white/15 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl"
                >
                  <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1 font-mono">
                    Routing Engine
                  </div>
                  {models.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setActiveModelId(m.id);
                        setModelDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                        activeModelId === m.id ? 'bg-white/15 text-white font-bold' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{m.name}</span>
                      {activeModelId === m.id && <Check className="w-3.5 h-3.5 text-accent-cyan" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-1.5 p-1 self-center">
            <button 
              type="button"
              onClick={toggleMic}
              className={`p-2 rounded-xl transition-colors ${
                isListening ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              title="Voice Input"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
              title="Attach new Excel/CSV dataset"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${activeModel.name} to compare categories, analyze anomalies, or forecast trends...`}
            className="flex-1 bg-transparent border-none outline-none text-white px-3 py-3 font-medium placeholder:text-white/40 resize-none max-h-32 min-h-[46px] self-center text-sm tracking-wide"
            rows={1}
          />

          <button 
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isChatThinking}
            className={`relative overflow-hidden px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all mb-1 mr-1 self-end ${
              input.trim() && !isChatThinking
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 cursor-pointer'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Execute <Send className="w-3 h-3" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
