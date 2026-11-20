// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  KanbanSquare,
  MessageSquare,
  Compass,
  UserPlus,
  Settings,
  Lock,
  LogOut,
  X,
} from 'lucide-react';
import DevPilotLogo from '../ui/DevPilotLogo';

export interface SidebarProps {
  pendingRequestsCount?: number;
  unreadChatsCount?: number;
  userName?: string;
  userHandle?: string;
  userAvatar?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  isEncrypted?: boolean;
  badgeCount?: number;
  hasDot?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pendingRequestsCount = 3,
  unreadChatsCount = 2,
  userName = 'John Carraher',
  userHandle = '@johncarraher',
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Projects Dashboard', icon: LayoutGrid },
    { path: '/tasks', label: 'Task Board', icon: KanbanSquare },
    {
      path: '/chats',
      label: 'Partner Chats',
      icon: MessageSquare,
      isEncrypted: true,
      badgeCount: unreadChatsCount,
    },
    { path: '/discovery', label: 'Project Discovery', icon: Compass },
    {
      path: '/requests',
      label: 'Requests & Invites',
      icon: UserPlus,
      badgeCount: pendingRequestsCount,
      hasDot: pendingRequestsCount > 0,
    },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#09080f] border-r border-white/[0.07] flex flex-col justify-between shrink-0 select-none transition-transform duration-300 ease-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className='flex items-center gap-3 cursor-pointer group'>
                <DevPilotLogo className="h-16 w-auto transition-transform duration-300 group-hover:scale-105" />
              </div>
            </div>

            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Automatic NavLinks */}
          <nav className="p-3.5 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={({ isActive }) =>
                    `w-full group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/25 via-purple-600/15 to-transparent text-white border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.18)]'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04] border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-purple-400 shadow-[0_0_10px_#a855f7]" />
                      )}

                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-purple-400'
                              : 'text-zinc-400 group-hover:text-zinc-200'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.isEncrypted && (
                          <Lock className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                        )}

                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full leading-none ${
                              isActive
                                ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.7)]'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {item.badgeCount}
                          </span>
                        )}

                        {item.hasDot && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                        )}
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="p-3.5 border-t border-white/[0.06]">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#110e1c] border border-white/[0.06] hover:border-purple-500/30 transition-all">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#110e1c]" />
              </div>

              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {userName}
                </div>
                <div className="text-[11px] text-zinc-400 truncate">
                  {userHandle}
                </div>
              </div>
            </div>

            <button
              type="button"
              title="Log out"
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;