import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { StatusBar } from "./StatusBar";
import { ToastContainer } from "./ToastContainer";
import { AuthModal } from "../auth/AuthModal";
import type { Page } from "../../types";
import { useApp } from "../../context/AppContext";

interface LayoutProps {
  children: (currentPage: Page) => React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentPage, setCurrentPage } = useApp();

  return (
    <div className="flex flex-col h-full w-full relative z-10 overflow-hidden bg-dark-900">
      <ToastContainer />
      <AuthModal />

      {/* Cinematic Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-dark-900/80"></div>
        
        {/* Floating Glowing Spheres */}
        <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-accent-blue/10 rounded-full blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35vw] h-[35vw] bg-accent-purple/10 rounded-full blur-[150px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite] block" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-accent-cyan/10 rounded-full blur-[150px] mix-blend-screen animate-[pulse_12s_ease-in-out_infinite]" style={{ animationDelay: '4s' }}></div>
        
        {/* Flowing Data Streams (Simulated with Gradient Lines) */}
        <div className="absolute top-0 bottom-0 left-[30%] w-px bg-gradient-to-b from-transparent via-accent-cyan/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-[30%] w-px bg-gradient-to-b from-transparent via-accent-purple/20 to-transparent"></div>

        {/* Animated Perspective Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [transform:rotateX(60deg)_translateY(-100px)_scale(2)] [transform-origin:top_center] [mask-image:linear-gradient(to_bottom,#000_10%,transparent_100%)] opacity-30"></div>
      </div>

      <Header />
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative p-6">
          {children(currentPage)}
        </main>
      </div>
      
      <StatusBar />
    </div>
  );
}
