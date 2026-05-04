/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Map as MapIcon, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { cn } from '../lib/utils';

interface NavItemProps {
  key?: string | number;
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

function NavItem({ to, icon: Icon, label, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
        isActive 
          ? "bg-accent text-primary font-bold shadow-lg shadow-accent/20" 
          : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      {({ isActive }) => (
        <>
          <Icon className="w-5 h-5" />
          <span>{label}</span>
          {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
        </>
      )}
    </NavLink>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    api.adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', to: "/admin/dashboard", label: "לוח בקרה", icon: LayoutDashboard },
    { id: 'list', to: "/admin/dashboard/list", label: "רשימת נרשמים", icon: Users },
    { id: 'rsvp', to: "/admin/dashboard/rsvp", label: "אישורי הגעה", icon: CheckCircle2 },
    { id: 'distribution', to: "/admin/dashboard/distribution", label: "התפלגות ערים", icon: MapIcon },
    { id: 'settings', to: "/admin/dashboard/settings", label: "הגדרות", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex overflow-x-hidden">
      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? "80px" : "280px" }}
        className="hidden lg:flex bg-[#1A233A] flex-col p-4 fixed inset-y-0 right-0 z-50 transition-all duration-300 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-10 px-2 min-h-[40px]">
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
              >
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-right">
                  <h2 className="text-white text-sm font-bold leading-tight">ניהול הסעות</h2>
                  <p className="text-white/40 text-[8px] uppercase tracking-widest">Shuttle Admin</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors shrink-0"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", isSidebarCollapsed && "rotate-180")} />
          </button>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group",
                isActive 
                  ? "bg-accent text-primary font-bold shadow-lg shadow-accent/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span className="text-sm">{item.label}</span>}
              {isSidebarCollapsed && (
                <div className="absolute right-full mr-2 px-2 py-1 bg-[#1A233A] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/5">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all mt-auto overflow-hidden",
            isSidebarCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span className="text-sm font-bold">התנתקות</span>}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main 
        className="flex-1 w-full min-h-screen transition-all duration-300"
        initial={false}
        animate={{ 
          paddingRight: window.innerWidth >= 1024 
            ? (isSidebarCollapsed ? "80px" : "280px") 
            : "0px" 
        }}
      >
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-40">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 bg-primary/5 rounded-lg"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-primary text-sm">ניהול הסעות</h1>
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto overflow-hidden">
          {children}
        </div>
      </motion.main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#1A233A]/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[280px] bg-[#1A233A] z-[70] p-6 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-white font-black">תפריט ניהול</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5">
                  <X className="w-5 h-5 text-white/40 hover:text-white" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.id}
                    to={item.to}
                    end
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                      isActive 
                        ? "bg-accent text-primary font-bold shadow-lg shadow-accent/20" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                    <ChevronLeft className="w-4 h-4 mr-auto opacity-20" />
                  </NavLink>
                ))}
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-4 text-red-400 bg-red-400/5 rounded-2xl mt-auto font-bold text-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>התנתקות מהמערכת</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
