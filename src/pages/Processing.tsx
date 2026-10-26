import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Activity, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

interface ProcessingProps {
  onComplete: () => void;
}

const processingSteps = [
  "Mounting Data Lake workbook...",
  "Parsing sheets & data types...",
  "Normalizing numeric columns...",
  "Detecting anomaly clusters...",
  "Synthesizing KPI vectors...",
  "Applying regression trends...",
  "Formatting executive visualization layer...",
  "Finalizing holographic dashboard..."
];

export function Processing({ onComplete }: ProcessingProps) {
  const { dataset, activeModelId, models } = useApp();
  const activeModel = models.find((m) => m.id === activeModelId) || models[0];

  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [logs, setLogs] = useState<string[]>([
    `Initializing ${activeModel.name}...`,
    `Reading ${dataset.rowCount.toLocaleString()} records from ${dataset.fileName}...`,
    `Allocating 2.4 TFLOPS GPU pipeline...`
  ]);

  useEffect(() => {
    const totalDuration = 4000; // 4 seconds for snappy experience
    const intervalTime = 50;
    const stepsCount = totalDuration / intervalTime;
    let currentStep = 0;

    const dynamicLogs = [
      `Detected ${dataset.columnCount} dimensions in ${dataset.fileName}`,
      `Evaluating KPI variance across ${dataset.columns.slice(0, 3).join(', ')}`,
      `Computed revenue total: ${dataset.kpis[0]?.value || 'Optimal'}`,
      `Verified model precision: 99.2%`,
      `Dashboard synthesis complete.`
    ];

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / stepsCount) * 100, 100);
      setProgress(newProgress);
      setTimeLeft(Math.max(4 - Math.floor((newProgress / 100) * 4), 1));
      
      const stepIndex = Math.floor((newProgress / 100) * processingSteps.length);
      setCurrentStepIndex(Math.min(stepIndex, processingSteps.length - 1));

      if (currentStep % 15 === 0) {
        const logIdx = Math.floor((newProgress / 100) * dynamicLogs.length);
        if (dynamicLogs[logIdx] && !logs.includes(dynamicLogs[logIdx])) {
          setLogs((prev) => [...prev, dynamicLogs[logIdx]].slice(-5));
        }
      }

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete, dataset, activeModel.name]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative z-20 bg-[#050505]/85 backdrop-blur-md p-6">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="flex flex-col items-center max-w-2xl w-full relative z-10">
        
        {/* Core Animation */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-8">
          {/* Outer Rotating Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-white/10 border-t-accent-cyan border-r-accent-purple"
          ></motion.div>
          
          {/* Inner Rotating Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-white/10 border-b-accent-blue border-l-accent-emerald"
          ></motion.div>

          {/* Center Pulse */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-10 bg-gradient-to-br from-accent-blue via-accent-purple to-accent-cyan rounded-full blur-xl opacity-60"
          ></motion.div>
          
          <div className="relative z-10 w-20 h-20 bg-[#0a0a0a] rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <Cpu className="w-9 h-9 text-accent-cyan animate-pulse" />
          </div>
        </div>

        {/* Progress Info */}
        <div className="w-full text-center space-y-3 mb-8">
          <motion.h2 
            key={processingSteps[currentStepIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black text-white uppercase tracking-wider flex items-center justify-center gap-3 font-display"
          >
            <Sparkles className="w-5 h-5 text-accent-cyan" />
            {processingSteps[currentStepIndex]}
          </motion.h2>
          
          <div className="flex items-center justify-center gap-6 text-xs font-bold tracking-widest uppercase font-mono text-gray-400">
            <span>Analyzing: <strong className="text-white">{dataset.fileName}</strong></span>
            <span>•</span>
            <span className="text-accent-cyan font-bold">{timeLeft}s remaining</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xl mb-8">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/10">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan shadow-[0_0_15px_rgba(0,240,255,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">
            <span>0%</span>
            <span className="text-accent-cyan font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* System Stats / Logs */}
        <div className="w-full grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-4 flex flex-col justify-end h-28 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10"></div>
             <div className="space-y-1 relative z-0 flex flex-col justify-end">
               {logs.map((log, i) => (
                 <motion.div 
                   key={`${log}-${i}`}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={cn(
                     "text-[10px] font-mono tracking-wider truncate",
                     i === logs.length - 1 ? "text-accent-emerald" : "text-white/40"
                   )}
                 >
                   &gt; {log}
                 </motion.div>
               ))}
             </div>
          </div>
          
          <div className="bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-4 grid grid-cols-2 gap-2">
             <div className="flex flex-col justify-center">
               <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Records</span>
               <span className="text-base font-black text-accent-cyan font-mono">
                 {dataset.rowCount.toLocaleString()}
               </span>
             </div>
             <div className="flex flex-col justify-center">
               <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">AI Engine</span>
               <span className="text-xs font-bold text-white truncate">{activeModel.name.split(' ')[0]}</span>
             </div>
             <div className="flex flex-col justify-center">
               <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Confidence</span>
               <span className="text-sm font-bold text-accent-emerald flex items-center gap-1 font-mono">
                 99.2% <CheckCircle2 className="w-3 h-3" />
               </span>
             </div>
             <div className="flex flex-col justify-center">
               <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Latency</span>
               <span className="text-xs font-bold text-white font-mono">{activeModel.latency}</span>
             </div>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={onComplete}
          className="text-xs text-gray-400 hover:text-white uppercase tracking-widest font-bold flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
        >
          <span>Skip Animation & Open Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}
