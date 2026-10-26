import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Download, 
  Mail, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  Loader2, 
  X,
  FileSpreadsheet
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function Reports() {
  const { dataset, addToast, activeModelId, models } = useApp();
  const activeModel = models.find((m) => m.id === activeModelId) || models[0];

  const [reports, setReports] = useState([
    { id: '1', name: `${dataset.fileName} Executive Deck`, category: 'Executive', date: 'Today, 09:00 AM', status: 'Ready', format: 'PDF + XLSX' },
    { id: '2', name: 'Q3 Regional Sales & Profit Variance', category: 'Sales', date: 'Yesterday', status: 'Ready', format: 'PDF' },
    { id: '3', name: 'Inventory & Supply Lead-Time Forecast', category: 'Operations', date: 'Oct 12, 2024', status: 'Ready', format: 'XLSX' },
    { id: '4', name: 'High-LTV Customer Segmentation', category: 'Marketing', date: 'Oct 10, 2024', status: 'Ready', format: 'PDF' },
    { id: '5', name: 'Anomaly & Margin Variance Audit', category: 'Finance', date: 'Oct 01, 2024', status: 'Ready', format: 'PDF' },
  ]);

  const [generating, setGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [emailModalReport, setEmailModalReport] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');

  const handleGenerateAI = async () => {
    setGenerating(true);
    addToast('Report Synthesis Initialized', `Compiling executive summary from ${dataset.fileName} using ${activeModel.name}...`, 'info');
    await new Promise((r) => setTimeout(r, 1200));

    const newReport = {
      id: `rep-${Date.now()}`,
      name: `${dataset.fileName.replace(/\.[^/.]+$/, '')} AI Deep Dive Report`,
      category: 'Autonomous AI',
      date: 'Just now',
      status: 'Ready',
      format: 'PDF + Interactive',
    };

    setReports((prev) => [newReport, ...prev]);
    setGenerating(false);
    addToast('Report Generated', `"${newReport.name}" is now ready for export.`, 'success');
  };

  const handleDownload = (reportName: string) => {
    // Generate text/markdown export file
    const content = `# NexusBI Executive Report: ${reportName}
Generated On: ${new Date().toLocaleString()}
Engine: ${activeModel.name}
Dataset Source: ${dataset.fileName}
Total Rows Evaluated: ${dataset.rowCount.toLocaleString()}

## Key Performance Indicators:
${dataset.kpis.map((k) => `- ${k.label}: ${k.value} (Trend: ${k.trend > 0 ? '+' : ''}${k.trend}%)`).join('\n')}

## Market Distribution:
${dataset.categoryDistribution.map((c) => `- ${c.name}: ${c.value}% share`).join('\n')}

## Autonomous AI Recommendations:
${dataset.insights.map((ins, i) => `${i + 1}. [${ins.type.toUpperCase()}] ${ins.title}\n   ${ins.description} (Confidence: ${ins.score}%)`).join('\n\n')}

---
NexusBI Autonomous Analytics Platform. Confidential Enterprise Documentation.
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportName.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('Download Started', `Downloaded "${reportName}" markdown report.`, 'success');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;
    addToast('Email Dispatched', `Report successfully transmitted to ${recipientEmail}`, 'success');
    setEmailModalReport(null);
    setRecipientEmail('');
  };

  const filteredReports = selectedCategory === 'All' 
    ? reports 
    : reports.filter((r) => r.category === selectedCategory);

  return (
    <div className="max-w-[1600px] mx-auto pb-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Executive Report Center
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Access compiled executive dossiers, PDF packages, and autonomous AI audits.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-dark-800 border border-white/10 rounded-xl p-1">
            {['All', 'Executive', 'Sales', 'Operations', 'Finance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  selectedCategory === cat ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleGenerateAI}
            disabled={generating}
            className="flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-blue text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(139,92,246,0.35)]"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Compiling AI Deck...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-dark-800/60 text-xs uppercase tracking-wider text-gray-400 font-mono">
                <th className="p-4 font-bold">Report Title</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Generated</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReports.map((report, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  key={report.id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-200 block">{report.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{report.format}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    <span className="bg-dark-800/80 px-2.5 py-1 rounded-md border border-white/5 text-xs font-mono">
                      {report.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400 font-mono">{report.date}</td>
                  <td className="p-4">
                    <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 flex w-fit items-center gap-1.5 font-mono">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {report.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleDownload(report.name)}
                        className="p-2.5 text-gray-300 hover:text-white bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-bold"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                      <button 
                        onClick={() => setEmailModalReport(report.name)}
                        className="p-2.5 text-gray-300 hover:text-white bg-dark-800 hover:bg-dark-700 rounded-xl transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-bold" 
                        title="Email to Stakeholders"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Modal */}
      <AnimatePresence>
        {emailModalReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmailModalReport(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0e1015] border border-white/15 rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Share Executive Report</h3>
                <button onClick={() => setEmailModalReport(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Distribute <strong>{emailModalReport}</strong> directly to executive leadership.
              </p>
              <form onSubmit={handleSendEmail} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Stakeholder Email
                  </label>
                  <input 
                    type="email" 
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="cfo@enterprise.com"
                    className="w-full bg-dark-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-accent-cyan"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-3.5 rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  Send Report
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
