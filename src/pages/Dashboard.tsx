import { motion } from "motion/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Bar, 
  ComposedChart 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  TrendingUp, 
  Box, 
  Cpu, 
  Activity, 
  UploadCloud, 
  FileSpreadsheet,
  Layers,
  ArrowRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { useApp } from "../context/AppContext";
import { recentActivity, forecastData } from "../data/mockData";
import { useRef } from "react";

export function Dashboard() {
  const { dataset, setCurrentPage, sendMessage, uploadFile, resetToSampleData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto pb-10"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".xlsx,.xls,.csv" 
        className="hidden" 
      />

      {/* Dataset Header Ribbon */}
      <div className="xl:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-accent-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white tracking-wide">{dataset.fileName}</h2>
              <span className="text-[10px] bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30 px-2 py-0.5 rounded-full font-mono font-bold">
                Live Data Core
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              {dataset.rowCount.toLocaleString()} Total Rows • {dataset.columnCount} Dimensions • Size: {dataset.fileSize}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-accent-cyan" />
            <span>Upload New Excel</span>
          </button>
          <button 
            onClick={resetToSampleData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            Reset Sample
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="xl:col-span-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dataset.kpis.map((kpi, i) => (
          <motion.div key={i} variants={item} className="floating-card glass-card p-5 flex flex-col justify-between relative overflow-hidden group">
            <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity", kpi.color.replace('text-', 'bg-'))}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-dark-900/50 border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <Box className={cn("w-4 h-4", kpi.color)} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[85px]">{kpi.label}</span>
              </div>
              <div className={cn("flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-dark-900/50 border border-white/5", kpi.color)}>
                {kpi.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(kpi.trend)}%
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-display font-black text-white leading-none mb-4 relative z-10 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] truncate">
              {kpi.value}
            </div>
            
            {/* Sparkline */}
            <div className="w-full h-8 relative z-10 mt-auto">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataset.revenueTrend.slice(-6)}>
                    <defs>
                      <linearGradient id={`spark-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={kpi.trend > 0 ? '#00FF66' : '#FFB703'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={kpi.trend > 0 ? '#00FF66' : '#FFB703'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="revenue" stroke={kpi.trend > 0 ? '#00FF66' : '#FFB703'} fill={`url(#spark-${i})`} strokeWidth={2} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart area */}
      <motion.div variants={item} className="xl:col-span-3 space-y-6">
        <div className="floating-card glass-card p-6 min-h-[420px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white tracking-tight drop-shadow-md">
                Revenue Trajectory vs Model Benchmark
              </h2>
              <p className="text-xs text-accent-cyan uppercase tracking-widest font-bold mt-1 font-mono">
                Real-Time Ingestion • {dataset.fileName}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-dark-900/50 p-2 rounded-xl border border-white/5 shadow-inner">
              <span className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-accent-blue shadow-[0_0_8px_#00F0FF]"></div> Revenue (Actual)
              </span>
              <span className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <div className="w-2.5 h-2.5 rounded-sm bg-white/20"></div> Benchmark (Target)
              </span>
            </div>
          </div>
          <div className="h-[320px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dataset.revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0.05)"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}L`} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(23,26,33,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(16px)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#e5e7eb', fontWeight: 600 }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                />
                <Bar dataKey="target" barSize={16} fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <Area type="monotone" dataKey="revenue" fill="url(#colorRev)" stroke="#00F0FF" strokeWidth={3} activeDot={{ r: 6, fill: '#00F0FF', stroke: '#fff', strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="floating-card glass-card p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className="text-lg font-display font-bold text-white">AI Demand Forecast</h2>
                <p className="text-[10px] text-accent-purple uppercase tracking-widest font-bold mt-1">Neural Net Prediction</p>
              </div>
              <div className="p-2 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
                <Sparkles className="w-5 h-5 text-accent-purple drop-shadow-[0_0_8px_rgba(123,44,191,0.8)] animate-pulse" />
              </div>
            </div>
            <div className="h-[250px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                   <defs>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7B2CBF" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7B2CBF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} dy={5} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}L`} dx={-5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(23,26,33,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                  />
                  <Bar dataKey="actual" fill="#00F0FF" barSize={12} radius={[4,4,0,0]} />
                  <Area type="monotone" dataKey="forecast" stroke="#7B2CBF" strokeWidth={3} fill="url(#colorForecast)" strokeDasharray="6 4" activeDot={{ r: 5, fill: '#7B2CBF' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="floating-card glass-card p-6 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-panel border border-white/20 mb-2 shadow-[0_10px_30px_rgba(0,240,255,0.2)] transform group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-500">
                <TrendingUp className="w-8 h-8 text-accent-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-2 tracking-tight">Interactive AI Analysis</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  Query this dataset in natural language, request comparative breakdowns, or run predictive regressions.
                </p>
              </div>
              <button 
                onClick={() => {
                  setCurrentPage('chat');
                  sendMessage(`Provide an executive overview of the key performance metrics in ${dataset.fileName}`);
                }}
                className="glass-button w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:border-accent-cyan hover:bg-accent-cyan/10 transition-all text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-cyan" /> Ask AI Analyst
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Sidebar Insights */}
      <motion.div variants={item} className="xl:col-span-1 space-y-6">
        <div className="floating-card glass-card p-6 flex flex-col gap-5 overflow-hidden relative">
          <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-purple/50 to-transparent"></div>

          <h3 className="text-[11px] font-black uppercase tracking-widest text-accent-purple flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Autonomous Insights
          </h3>
          
          <div className="space-y-4">
            {dataset.insights.slice(0, 3).map((insight, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentPage('insights')}
                className="p-4 glass-panel border-l-2 border-accent-emerald rounded-r-xl relative group overflow-hidden hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-emerald/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-bold text-accent-emerald uppercase tracking-widest drop-shadow-[0_0_2px_rgba(0,255,102,0.8)]">
                    {insight.type}
                  </p>
                  <span className="text-[10px] font-mono text-gray-400 font-bold">{insight.score}%</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1">{insight.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-medium line-clamp-2">{insight.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-2">
            <button 
              onClick={() => setCurrentPage('insights')}
              className="w-full py-3 glass-button text-[10px] font-bold uppercase tracking-widest text-white hover:text-accent-cyan transition-colors flex items-center justify-center gap-2"
            >
              <span>View All Insights</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="floating-card glass-card p-6 flex flex-col gap-5">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Activity className="w-4 h-4" /> System Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 group cursor-pointer">
                <div className="mt-1 relative">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]",
                    activity.type === 'alert' ? "bg-accent-pink text-accent-pink" : "",
                    activity.type === 'info' ? "bg-accent-blue text-accent-blue" : "",
                    activity.type === 'success' ? "bg-accent-emerald text-accent-emerald" : "",
                    activity.type === 'warning' ? "bg-accent-orange text-accent-orange" : ""
                  )} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest group-hover:text-white transition-colors">{activity.action}</div>
                  <div className="text-[11px] text-gray-500 mt-1 font-medium">{activity.details}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
