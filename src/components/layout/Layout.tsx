import React, { useState } from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { Header } from './Header';
import { DemoModeBanner } from '../common/DemoModeBanner';

interface LayoutProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  onOpenAddInstitution: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAddInstitution,
  searchQuery,
  setSearchQuery,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Demo Banner */}
      <DemoModeBanner />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Header
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenAddInstitution={onOpenAddInstitution}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* Footer Branding */}
          <footer className="py-4 px-6 border-t border-slate-200/80 bg-white/50 text-center text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} <strong className="text-slate-700">EduNexa</strong> — Developed by{' '}
              <strong className="text-teal-700">L.Tech Solutions</strong>. One Platform. Every Campus. Connected Education.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Frontend Demonstration Prototype • Phase 1 Super Admin Portal
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
