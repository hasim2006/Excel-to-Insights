import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, User as UserIcon, Shield, Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, user } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Chief Data Officer');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, role, name || email.split('@')[0]);
  };

  const handleQuickLogin = (demoEmail: string, demoName: string, demoRole: string) => {
    login(demoEmail, demoRole, demoName);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAuthModal(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0d0f12] border border-white/15 rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10"
        >
          {/* Ambient Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent-blue/20 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-white tracking-tight">
                  NexusBI Enterprise Access
                </h3>
                <p className="text-xs text-accent-cyan font-mono tracking-widest uppercase">
                  Zero Trust Identity Layer
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Demo Login Tabs */}
          <div className="mb-6 bg-dark-900/80 p-3 rounded-2xl border border-white/5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" /> 1-Click Demo Profiles:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.vance@enterprise.ai', 'Alex Vance', 'Chief Data Officer')}
                className="p-2 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-accent-cyan transition-colors">Alex Vance</div>
                <div className="text-[9px] text-gray-400 font-mono">Exec CDO</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('maya.lin@data-lab.io', 'Maya Lin', 'Lead Data Scientist')}
                className="p-2 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-accent-purple transition-colors">Maya Lin</div>
                <div className="text-[9px] text-gray-400 font-mono">Data Scientist</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('guest.analyst@nexusbi.cloud', 'Guest Analyst', 'BI Analyst')}
                className="p-2 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-accent-emerald transition-colors">Guest</div>
                <div className="text-[9px] text-gray-400 font-mono">BI Analyst</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="flex border-b border-white/10 pb-2 mb-4 gap-6">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`text-sm font-bold pb-2 transition-all relative ${
                  mode === 'signin' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Sign In
                {mode === 'signin' && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan shadow-[0_0_8px_#00F0FF]"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`text-sm font-bold pb-2 transition-all relative ${
                  mode === 'signup' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Create Account
                {mode === 'signup' && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-cyan shadow-[0_0_8px_#00F0FF]"
                  />
                )}
              </button>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full bg-dark-900/80 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-cyan transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@enterprise.com"
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-cyan transition-colors font-mono"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                  Security Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-dark-900/80 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-accent-cyan transition-colors"
                >
                  <option value="Chief Data Officer">Chief Data Officer</option>
                  <option value="Lead Data Scientist">Lead Data Scientist</option>
                  <option value="Senior BI Analyst">Senior BI Analyst</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Executive Viewer">Executive Viewer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2"
            >
              <span>{mode === 'signin' ? 'Authenticate Session' : 'Create Credentials'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
