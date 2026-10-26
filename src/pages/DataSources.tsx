import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Server, 
  Cloud, 
  Briefcase, 
  BarChart, 
  FileSpreadsheet, 
  Plus, 
  RefreshCw, 
  Activity, 
  X,
  CheckCircle2,
  ArrowRight,
  UploadCloud
} from "lucide-react";
import { cn } from "../lib/utils";
import { useApp } from "../context/AppContext";

const iconMap = {
  Database,
  Server,
  Cloud,
  Briefcase,
  BarChart,
  FileSpreadsheet
};

export function DataSources() {
  const { dataset, uploadFile, addToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sources, setSources] = useState([
    { id: '1', name: 'Excel Data Lake', type: 'Workbook', status: 'Connected', health: 100, lastSync: 'Just now', size: dataset.fileSize, icon: 'FileSpreadsheet' },
    { id: '2', name: 'Snowflake Enterprise', type: 'Data Warehouse', status: 'Connected', health: 100, lastSync: '1m ago', size: '4.2 TB', icon: 'Database' },
    { id: '3', name: 'PostgreSQL Primary', type: 'Relational DB', status: 'Connected', health: 98, lastSync: '5m ago', size: '850 GB', icon: 'Server' },
    { id: '4', name: 'Salesforce CRM', type: 'Cloud CRM', status: 'Connected', health: 100, lastSync: '10m ago', size: '120 GB', icon: 'Cloud' },
    { id: '5', name: 'SAP ERP System', type: 'Enterprise ERP', status: 'Connected', health: 95, lastSync: '15m ago', size: '2.1 TB', icon: 'Briefcase' },
    { id: '6', name: 'Google Analytics 4', type: 'Telemetry API', status: 'Connected', health: 100, lastSync: '1h ago', size: '45 GB', icon: 'BarChart' },
  ]);

  const [addSourceModal, setAddSourceModal] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState('PostgreSQL');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.98, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const handleSync = async (id: string, name: string) => {
    setSyncingId(id);
    await new Promise((r) => setTimeout(r, 800));
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, lastSync: 'Just now', health: 100 } : s))
    );
    setSyncingId(null);
    addToast('Pipeline Synced', `Successfully refreshed cache for ${name}.`, 'success');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const success = await uploadFile(file);
      if (success) {
        setSources((prev) =>
          prev.map((s) =>
            s.id === '1'
              ? { ...s, name: file.name, size: `${Math.round(file.size / 1024)} KB`, lastSync: 'Just now' }
              : s
          )
        );
      }
    }
  };

  const handleAddSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName) return;

    const newSource = {
      id: `src-${Date.now()}`,
      name: newSourceName,
      type: newSourceType,
      status: 'Connected',
      health: 100,
      lastSync: 'Just now',
      size: '250 MB',
      icon: newSourceType === 'PostgreSQL' ? 'Server' : 'Database',
    };

    setSources((prev) => [newSource, ...prev]);
    setNewSourceName('');
    setAddSourceModal(false);
    addToast('Source Connected', `Integrated ${newSourceName} pipeline successfully.`, 'success');
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[1600px] mx-auto pb-10 space-y-6"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".xlsx,.xls,.csv" 
        className="hidden" 
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Data Pipelines & Storage Nodes
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Manage live data ingestion pipelines, cloud databases, and local workbooks.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
          >
            <UploadCloud className="w-4 h-4 text-accent-cyan" />
            <span>Upload New Excel</span>
          </button>
          <button 
            onClick={() => setAddSourceModal(true)}
            className="flex items-center gap-2 bg-white text-dark-900 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)]"
          >
            <Plus className="w-4 h-4" /> Add Data Source
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sources.map((source) => {
          const Icon = iconMap[source.icon as keyof typeof iconMap] || Database;
          const isConnected = source.status === 'Connected';
          const isSyncing = syncingId === source.id;
          
          return (
            <motion.div key={source.id} variants={item} className="glass-card p-6 group relative overflow-hidden flex flex-col justify-between">
              {isConnected && (
                <div className="absolute top-0 left-0 w-full h-1 bg-dark-800">
                  <motion.div 
                    className="h-full bg-accent-blue"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  />
                </div>
              )}

              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <Icon className="w-6 h-6 text-accent-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white tracking-wide truncate max-w-[180px]">
                        {source.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono">{source.type}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 font-mono",
                    isConnected ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                  )}>
                    {isConnected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    {source.status}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Health</div>
                    <div className="text-sm font-semibold text-white flex items-center gap-1 font-mono">
                      <Activity className="w-3 h-3 text-accent-emerald" /> {source.health}%
                    </div>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Volume</div>
                    <div className="text-sm font-semibold text-white font-mono truncate">{source.size}</div>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-mono">Last Sync</div>
                    <div className="text-sm font-semibold text-white font-mono truncate">{source.lastSync}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button 
                  onClick={() => handleSync(source.id, source.name)}
                  disabled={isSyncing}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl transition-colors border border-white/5 flex items-center justify-center gap-2"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5 text-accent-cyan", isSyncing && "animate-spin")} /> 
                  <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                </button>
                <button 
                  onClick={() => addToast('Configured', `${source.name} ingestion parameters are verified.`, 'info')}
                  className="bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors border border-white/5"
                >
                  Configure
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Source Modal */}
      <AnimatePresence>
        {addSourceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddSourceModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0e1015] border border-white/15 rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Add New Data Source</h3>
                <button onClick={() => setAddSourceModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSourceSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Source Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="e.g. Production Analytics DB"
                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Database Type
                  </label>
                  <select 
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value)}
                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  >
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="Snowflake">Snowflake</option>
                    <option value="Google BigQuery">Google BigQuery</option>
                    <option value="Amazon Redshift">Amazon Redshift</option>
                    <option value="Databricks">Databricks</option>
                    <option value="MySQL">MySQL</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Connection String / URI
                  </label>
                  <input 
                    type="text" 
                    placeholder="postgresql://user:pass@host:5432/dbname"
                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-cyan font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-3.5 rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] mt-2"
                >
                  Connect Pipeline
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
