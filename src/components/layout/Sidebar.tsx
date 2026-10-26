import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Database, 
  FileText, 
  Lightbulb, 
  Settings,
  LogOut,
  LogIn,
  BarChart3,
  Cpu,
  User as UserIcon
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { Page } from "../../types";
import { useApp } from "../../context/AppContext";

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { user, logout, setShowAuthModal, isAuthenticated } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'models', label: 'AI Models', icon: Cpu },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="w-64 glass-panel border-l-0 border-t-0 border-b-0 flex flex-col p-4 gap-2 relative z-10">
      <div className="mb-6 px-2 mt-2 flex items-center justify-between">
        <h2 className="text-xs font-black tracking-widest text-white/70 uppercase flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-accent-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" /> NexusBI
        </h2>
        <span className="text-[9px] bg-accent-blue/20 text-accent-cyan border border-accent-cyan/30 px-2 py-0.5 rounded-full font-mono font-bold">
          v2.4 Core
        </span>
      </div>

      {/* User Status Profile Card */}
      {isAuthenticated && user ? (
        <div className="mb-4 bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center overflow-hidden border border-white/20 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent-emerald border-2 border-[#0d0f12]"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
            <p className="text-[10px] text-accent-cyan truncate font-mono">{user.role}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAuthModal(true)}
          className="mb-4 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 hover:from-accent-blue/30 hover:to-accent-purple/30 border border-accent-cyan/30 rounded-2xl p-3 flex items-center justify-between text-left transition-all"
        >
          <div className="flex items-center gap-2.5">
            <LogIn className="w-4 h-4 text-accent-cyan" />
            <span className="text-xs font-bold text-white">Sign In / Register</span>
          </div>
          <span className="text-[9px] bg-accent-cyan/20 text-accent-cyan px-2 py-0.5 rounded-full uppercase font-bold">
            Auth
          </span>
        </button>
      )}

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "text-white" 
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(0,240,255,0.1)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-cyan rounded-r-full shadow-[0_0_10px_#00F0FF]"></div>
              )}
              {!isActive && (
                <div className="absolute inset-0 bg-white/0 hover:bg-white/5 rounded-xl transition-colors"></div>
              )}
              <Icon className={cn("w-5 h-5 relative z-10 transition-all duration-300", isActive && "text-accent-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] scale-110", !isActive && "group-hover:scale-110")} />
              <span className={cn("text-sm relative z-10 transition-all duration-300", isActive ? "font-semibold uppercase tracking-tight" : "font-medium")}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="glass-card p-4 group hover:border-white/30 transition-all mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-accent-emerald blur-[4px]"></div>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest">GPU CLUSTER: ONLINE</span>
          </div>
          <div className="w-full bg-dark-900/50 h-1 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <motion.div 
              className="bg-gradient-to-r from-accent-blue to-accent-purple h-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" 
              initial={{ width: "0%" }}
              animate={{ width: "78%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium tracking-wide">
            <span>MEM: 78%</span>
            <span className="text-accent-cyan drop-shadow-[0_0_2px_rgba(0,240,255,0.5)]">2.4 TFLOPS</span>
          </div>
        </div>

        {isAuthenticated ? (
          <button 
            onClick={logout}
            className="w-full glass-button flex items-center justify-between p-3 text-gray-400 hover:text-white transition-colors group rounded-xl"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 group-hover:text-accent-pink transition-colors drop-shadow-[0_0_5px_rgba(230,57,70,0)] group-hover:drop-shadow-[0_0_5px_rgba(230,57,70,0.8)]" />
              <span className="text-sm font-medium">Sign Out</span>
            </div>
            <span className="text-[9px] uppercase tracking-widest font-mono text-gray-500 group-hover:text-white transition-colors">End Session</span>
          </button>
        ) : (
          <button 
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-white text-black font-black uppercase text-xs tracking-widest py-3 px-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
}
