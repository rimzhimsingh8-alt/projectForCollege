import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTimer } from '../../context/TimerContext';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Timer as TimerIcon,
  Flame,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';

export const Topbar = ({ onOpenMobile, onOpenSearch }) => {
  const location = useLocation();
  const { user, activities, tasks } = useApp();
  const { theme, toggleTheme } = useTheme();
  const { isRunning, formattedTime, mode } = useTimer();
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive title from pathname
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/tasks':
        return 'Task Management';
      case '/planner':
        return 'Study Planner';
      case '/pomodoro':
        return 'Focus Timer';
      case '/assignments':
        return 'Assignments & Exams';
      case '/notes':
        return 'Quick Notes';
      case '/analytics':
        return 'Productivity Analytics';
      case '/achievements':
        return 'Streaks & Achievements';
      case '/ai-assistant':
        return 'AI Study Assistant';
      case '/settings':
        return 'Settings & Preferences';
      default:
        return 'StudyFlow';
    }
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Left: Mobile Menu + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium">
            {currentDateStr}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Floating Active Timer Pill if running */}
        {isRunning && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold animate-pulse">
            <TimerIcon className="w-3.5 h-3.5" />
            <span>{mode === 'work' ? 'Focusing' : 'Break'}: {formattedTime}</span>
          </div>
        )}

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-xs font-medium transition"
          title="Search anything (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 text-slate-400 rounded border border-slate-200 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-3 z-40 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
                  {activities.slice(0, 6).map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span>{act.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {act.detail && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {act.detail}
                        </p>
                      )}
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-xs text-center py-6 text-slate-400">No activities recorded yet</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {user?.name || 'Alex Chen'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {user?.role || 'Student'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
