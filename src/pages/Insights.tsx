import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { cn } from "../lib/utils";
import { useApp } from "../context/AppContext";
import type { DatasetInsight } from "../types";

const iconMap = {
  opportunity: TrendingUp,
  anomaly: AlertTriangle,
  optimization: Zap,
  strategy: Target,
};

const colorMap = {
  opportunity: {
    color: 'text-accent-emerald',
    bgColor: 'bg-accent-emerald/10',
    borderColor: 'border-accent-emerald/20',
  },
  anomaly: {
    color: 'text-accent-orange',
    bgColor: 'bg-accent-orange/10',
    borderColor: 'border-accent-orange/20',
  },
  optimization: {
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
    borderColor: 'border-accent-blue/20',
  },
  strategy: {
    color: 'text-accent-purple',
    bgColor: 'bg-accent-purple/10',
    borderColor: 'border-accent-purple/20',
  },
};

export function Insights() {
  const { dataset, setCurrentPage, sendMessage } = useApp();
  const [selectedInsight, setSelectedInsight] = useState<DatasetInsight | null>(null);

  const handleExpandInChat = (insight: DatasetInsight) => {
    setSelectedInsight(null);
    setCurrentPage('chat');
    sendMessage(`Deep-dive into the following AI insight for ${dataset.fileName}: "${insight.title}". What concrete steps should we take to execute this recommendation?`);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-accent-purple" /> Autonomous AI Insights
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Deep neural networks evaluated {dataset.rowCount.toLocaleString()} records from {dataset.fileName} to isolate high-conviction catalysts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataset.insights.map((insight, i) => {
          const Icon = iconMap[insight.type] || TrendingUp;
          const styling = colorMap[insight.type] || colorMap.opportunity;

          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              key={i} 
              className="glass-card p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-500 flex flex-col justify-between"
            >
              <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 transition-opacity duration-500 group-hover:opacity-40", styling.bgColor)} />
              
              <div className="flex items-start gap-4 mb-6">
                <div className={cn("p-3 rounded-2xl border flex-shrink-0", styling.bgColor, styling.borderColor, styling.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{insight.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Confidence</span>
                      <span className={cn("font-mono font-bold text-sm", styling.color)}>{insight.score}%</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{insight.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Vector: {insight.type}
                </span>
                <button 
                  onClick={() => setSelectedInsight(insight)}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-cyan hover:text-white transition-colors group/btn"
                >
                  <span>View Tactical Action Plan</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Plan Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInsight(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0e1015] border border-white/15 rounded-3xl p-7 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedInsight.title}</h3>
                    <p className="text-xs text-accent-cyan font-mono uppercase">AI Confidence: {selectedInsight.score}%</p>
                  </div>
                </div>
                <button onClick={() => setSelectedInsight(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-dark-900/80 rounded-2xl border border-white/5 space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Insight Summary</div>
                <p className="text-xs text-gray-200 leading-relaxed">{selectedInsight.description}</p>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-accent-cyan uppercase tracking-wider font-mono">Recommended Execution Steps</div>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                    <span>Reallocate 15% budget toward target segment to capture rising velocity.</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-accent-emerald flex-shrink-0 mt-0.5" />
                    <span>Run A/B testing on pricing tier adjustments with low elasticity customer cohort.</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleExpandInChat(selectedInsight)}
                  className="flex-1 bg-white text-black py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  Deep Dive in Chat →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
