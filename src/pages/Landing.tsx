import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  FileSpreadsheet, 
  FileBox, 
  X, 
  UploadCloud, 
  Cpu, 
  Database, 
  ChevronDown, 
  Check, 
  LogIn, 
  User as UserIcon,
  Layers,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

interface LandingProps {
  onStartProcessing: () => void;
}

export function Landing({ onStartProcessing }: LandingProps) {
  const { 
    dataset, 
    uploadFile, 
    isUploading, 
    models, 
    activeModelId, 
    setActiveModelId, 
    user, 
    setShowAuthModal,
    addToast
  } = useApp();

  const [input, setInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [modelDropdown, setModelDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dbModalOpen, setDbModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeModel = models.find((m) => m.id === activeModelId) || models[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleProcessFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await handleProcessFile(file);
    }
  };

  const handleProcessFile = async (file: File) => {
    setSelectedFile(file);
    const success = await uploadFile(file);
    if (!success) {
      setSelectedFile(null);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    addToast('File Removed', 'Cleared attached data core.', 'info');
  };

  const handleSubmit = () => {
    if (selectedFile || dataset || input.trim()) {
      onStartProcessing();
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center relative z-10 p-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".xlsx,.xls,.csv" 
        className="hidden" 
      />

      {/* Top Bar for Auth & Status */}
      <div className="absolute top-6 right-8 z-30 flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center overflow-hidden border border-white/20">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-none">{user.name}</div>
              <div className="text-[10px] text-accent-cyan font-mono mt-1">{user.role}</div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <LogIn className="w-4 h-4 text-accent-cyan" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>

      {/* Dragging Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-accent-blue/15 backdrop-blur-md border-2 border-dashed border-accent-blue z-50 flex items-center justify-center rounded-3xl m-6 shadow-[inset_0_0_60px_rgba(0,240,255,0.3)]"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-accent-blue/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-pulse">
                <UploadCloud className="w-12 h-12 text-accent-cyan" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white tracking-tight drop-shadow-md">Drop Excel or CSV Core Here</h2>
              <p className="text-accent-cyan font-mono uppercase tracking-widest text-sm">Autonomous parsing engine ready...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-12 relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border border-accent-cyan/30 mb-6 shadow-[0_0_20px_rgba(0,240,255,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
          <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-widest font-mono">Neural BI v2.4 • Online</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tighter text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          Excel to AI Insights
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-accent-cyan/80 text-lg md:text-xl font-medium max-w-2xl mx-auto uppercase tracking-wide drop-shadow-[0_0_5px_rgba(0,240,255,0.5)] font-mono"
        >
          Autonomous Analytics & Real-Time Executive Dashboard
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-4xl relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan rounded-3xl opacity-30 blur-2xl group-hover:opacity-50 transition duration-700"></div>
        <div className="relative glass-panel rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col transform group-hover:-translate-y-1 transition-transform duration-500">
          
          {/* File Card preview */}
          <AnimatePresence>
            {(selectedFile || dataset) && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 14 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="glass-card border border-accent-emerald/30 rounded-2xl p-4 flex items-center justify-between group/file mx-2 mt-2 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-emerald/10 border border-accent-emerald/40 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-accent-emerald/20 blur-[10px]"></div>
                      <FileSpreadsheet className="w-6 h-6 text-accent-emerald drop-shadow-[0_0_5px_rgba(0,255,102,0.8)] relative z-10" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base flex items-center gap-3 tracking-wide">
                        {selectedFile ? selectedFile.name : dataset.fileName}
                        <span className="text-[9px] bg-accent-emerald/15 text-accent-emerald px-2 py-0.5 rounded-sm border border-accent-emerald/40 uppercase tracking-widest font-black font-mono">
                          {isUploading ? 'Parsing...' : 'Data Lake Synced'}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 font-mono flex items-center gap-3">
                        <span>SIZE: {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : dataset.fileSize}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span>ROWS: {dataset.rowCount.toLocaleString()}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span>COLS: {dataset.columnCount}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className="text-accent-cyan font-bold">READY FOR AI SYNTHESIS</span>
                      </p>
                    </div>
                  </div>
                  {selectedFile && (
                    <button 
                      onClick={handleClearFile}
                      className="p-2.5 text-gray-500 hover:text-accent-pink glass-button transition-colors rounded-xl"
                      title="Remove File"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center p-2">
            
            {/* AI Model Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setModelDropdown(!modelDropdown)}
                className="flex items-center gap-2.5 px-4 py-3 border-r border-white/10 hover:bg-white/5 rounded-xl transition-colors mr-3 group/model"
              >
                <Cpu className="w-5 h-5 text-accent-purple group-hover/model:drop-shadow-[0_0_8px_rgba(123,44,191,0.8)] transition-all" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  {activeModel.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover/model:text-white" />
              </button>

              <AnimatePresence>
                {modelDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-3 w-56 bg-[#0e1015] border border-white/15 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl"
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 px-3 py-1.5 font-mono">
                      Target AI Architecture
                    </div>
                    {models.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setActiveModelId(m.id);
                          setModelDropdown(false);
                          addToast('AI Engine Activated', `Switched engine to ${m.name}`, 'info');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${
                          activeModelId === m.id ? 'bg-white/15 text-white font-bold' : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white">{m.name}</div>
                          <div className="text-[9px] text-gray-400 font-mono">{m.latency} • {m.status}</div>
                        </div>
                        {activeModelId === m.id && <Check className="w-3.5 h-3.5 text-accent-cyan" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons: Connect DB and Upload */}
            <div className="flex gap-2 pr-3 border-r border-white/10 mr-3">
              <button 
                type="button"
                onClick={() => setDbModalOpen(true)}
                className="glass-button flex items-center gap-2 px-3.5 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:text-accent-emerald transition-colors"
                title="Connect Cloud Database"
              >
                <Database className="w-4 h-4 text-accent-emerald drop-shadow-[0_0_5px_rgba(0,255,102,0.5)]" /> 
                <span>Connect DB</span>
              </button>

              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="glass-button flex items-center gap-2 px-3.5 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:text-accent-cyan transition-colors"
                title="Select Excel or CSV"
              >
                <FileBox className="w-4 h-4 text-accent-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" /> 
                <span>Upload Excel</span>
              </button>
            </div>
            
            {/* Command / Prompt Input */}
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={selectedFile ? "Instruct AI: 'Detect anomalies and generate Q4 executive deck'..." : "Ask AI to analyze data or load sample..."}
              className="flex-1 bg-transparent border-none outline-none text-white px-4 placeholder:text-gray-500 font-medium min-w-0 text-base tracking-wide"
            />
            
            {/* Execute Button */}
            <div className="flex items-center gap-2 pl-3">
              <button 
                type="button"
                onClick={handleSubmit}
                className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-3 relative overflow-hidden group/submit bg-white text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] cursor-pointer"
              >
                <span className="relative z-10">Execute</span>
                <Send className="w-4 h-4 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/submit:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Connected Nodes */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center items-center">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold font-mono">Connected Pipelines:</span>
          {['Snowflake', 'PostgreSQL', 'Databricks', 'Salesforce', 'SAP ERP'].map((db) => (
            <div key={db} className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald shadow-[0_0_5px_#00FF66] animate-pulse"></div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{db}</span>
            </div>
          ))}
          <button 
            onClick={() => onStartProcessing()}
            className="text-[10px] text-accent-cyan hover:underline font-bold uppercase tracking-wider ml-2"
          >
            Launch Sample Dashboard →
          </button>
        </div>
      </motion.div>

      {/* Database Connect Modal */}
      <AnimatePresence>
        {dbModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDbModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0e1015] border border-white/15 rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-accent-emerald" />
                  <h3 className="text-lg font-bold text-white">Connect Enterprise Lake</h3>
                </div>
                <button onClick={() => setDbModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Select your live data warehouse or relational database to stream real-time queries.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['Snowflake', 'PostgreSQL', 'BigQuery', 'Amazon Redshift', 'Databricks', 'Oracle DB'].map((db) => (
                  <button
                    key={db}
                    onClick={() => {
                      setDbModalOpen(false);
                      addToast('Pipeline Connected', `Stream synchronized with ${db}.`, 'success');
                      onStartProcessing();
                    }}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-colors flex items-center justify-between group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-accent-cyan">{db}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-accent-cyan" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
