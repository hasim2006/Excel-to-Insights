/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { DataSources } from './pages/DataSources';
import { Reports } from './pages/Reports';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { Chat } from './pages/Chat';
import { AIModels } from './pages/AIModels';
import { Landing } from './pages/Landing';
import { Processing } from './pages/Processing';
import { BackgroundParticles } from './components/layout/BackgroundParticles';
import { ToastContainer } from './components/layout/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';
import { AnimatePresence, motion } from "motion/react";
import type { Page } from './types';
import { AppProvider, useApp } from './context/AppContext';

function AppContent() {
  const { appState, setAppState } = useApp();

  const renderPage = (currentPage: Page) => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'sources': return <DataSources />;
      case 'reports': return <Reports />;
      case 'insights': return <Insights />;
      case 'settings': return <Settings />;
      case 'chat': return <Chat />;
      case 'models': return <AIModels />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden text-gray-200 font-sans selection:bg-blue-500/30 relative flex flex-col">
      <BackgroundParticles />
      <ToastContainer />
      <AuthModal />
      
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10"
          >
            <Landing onStartProcessing={() => setAppState('processing')} />
          </motion.div>
        )}
        
        {appState === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-20"
          >
            <Processing onComplete={() => setAppState('dashboard')} />
          </motion.div>
        )}

        {appState === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-10 flex flex-col"
          >
            <Layout>
              {(currentPage) => (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                  >
                    {renderPage(currentPage)}
                  </motion.div>
                </AnimatePresence>
              )}
            </Layout>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
