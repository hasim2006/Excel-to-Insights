import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          const Icon = isSuccess
            ? CheckCircle2
            : isError
            ? AlertCircle
            : isWarning
            ? AlertTriangle
            : Info;

          const colorClasses = isSuccess
            ? 'border-emerald-500/40 bg-dark-900/90 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
            : isError
            ? 'border-rose-500/40 bg-dark-900/90 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
            : isWarning
            ? 'border-amber-500/40 bg-dark-900/90 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
            : 'border-cyan-500/40 bg-dark-900/90 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl flex items-start gap-3.5 ${colorClasses}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  {toast.title}
                </h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
