import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

export function StatusBar() {
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset((prev) => (prev - 1) % 1000);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const messages = [
    "Processing 2.4M records/sec",
    "AI Generated 128 Custom Insights",
    "6 Enterprise Data Lakes Connected",
    "Forecast Updated 8 sec ago",
    "Neural Queries Executed 14,328",
    "Anomaly scan complete: 0 critical issues",
    "Model confidence: 99.8%"
  ];

  return (
    <div className="h-8 w-full bg-dark-900 border-t border-white/5 flex items-center px-4 overflow-hidden relative z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
      <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-dark-900 to-transparent z-10 pointer-events-none flex items-center pl-4">
        <Terminal className="w-4 h-4 text-accent-cyan" />
      </div>
      <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-dark-900 to-transparent z-10 pointer-events-none" />
      
      <div className="flex gap-8 whitespace-nowrap pl-16" style={{ transform: `translateX(${tickerOffset}px)` }}>
        {[...Array(5)].map((_, j) => (
          <div key={j} className="flex gap-12">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-accent-emerald uppercase tracking-[0.2em] drop-shadow-[0_0_2px_rgba(0,255,102,0.8)]">Live Telemetry</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">{messages.join(" • ")}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-accent-purple uppercase tracking-[0.2em] drop-shadow-[0_0_2px_rgba(123,44,191,0.8)]">Core Infrastructure</span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Kernel v4.2.0.87-AI | Quantum-Cluster: US-East-1 | Latency: 1.2ms | Throughput: 4.8GB/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
