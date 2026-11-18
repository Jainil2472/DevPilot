// src/components/layout/AppLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '#/components/layout/Sidebar';
import { Search, Bell, Plus, Menu } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  return (
    <div className="min-h-screen bg-[#06050b] text-white font-sans flex selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Persistent Top Header */}
        <header className="h-16 px-6 lg:px-8 border-b border-white/[0.06] bg-[#08070f]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search projects, tasks, commits..."
                className="w-full rounded-xl bg-[#110f1a] border border-white/[0.08] pl-10 pr-12 py-2 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 transition-all"
              />
              <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-zinc-500 bg-zinc-900 border border-white/10 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <button
              type="button"
              className="relative p-2.5 rounded-xl bg-[#110f1a] border border-white/[0.08] text-zinc-300 hover:text-white hover:border-purple-500/40 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_10px_#a855f7]">
                3
              </span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_24px_rgba(168,85,247,0.6)] hover:brightness-110 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Project</span>
            </button>
          </div>
        </header>

        {/* Child Routes Render Here via <Outlet /> */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet context={{ globalSearch }} />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;