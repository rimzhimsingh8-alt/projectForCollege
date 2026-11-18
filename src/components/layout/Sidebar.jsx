import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTimer } from '../../context/TimerContext';
import { calculateLevel } from '../../data/achievementsList';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Timer,
  GraduationCap,
  FileText,
  BarChart3,
  Award,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { tasks, assignments, user } = useApp();
  const { isRunning, formattedTime, mode } = useTimer();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const pendingAssignmentsCount = assignments.filter((a) => !a.completed).length;

  const levelInfo = calculateLevel(user?.totalXP || 0);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare, badge: pendingTasksCount > 0 ? pendingTasksCount : null },
    { name: 'Study Planner', path: '/planner', icon: Calendar },
    {
      name: 'Focus Timer',
      path: '/pomodoro',
      icon: Timer,
      badge: isRunning ? formattedTime : null,
      badgeColor: isRunning ? 'bg-amber-500 text-white animate-pulse' : null
    },
    {
      name: 'Assignments & Exams',
      path: '/assignments',
      icon: GraduationCap,
      badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : null
    },
    { name: 'Quick Notes', path: '/notes', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Achievements', path: '/achievements', icon: Award },
    { name: 'AI Study Assistant', path: '/ai-assistant', icon: Sparkles, isAi: true },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <NavLink
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-tight">
                  Study<span className="text-purple-600 dark:text-purple-400">Flow</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Productivity OS
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group relative ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`
                }
                title={isCollapsed ? item.name : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    item.isAi ? 'text-indigo-500 dark:text-indigo-400 group-hover:rotate-12 transition' : ''
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.name}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                      item.badgeColor || 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="fixed left-20 ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer: Gamification & Streak Widget */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
          {!isCollapsed ? (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Lvl {levelInfo.level}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {user?.totalXP || 0} XP
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  <span>{user?.streak || 0}d</span>
                </div>
              </div>

              {/* Progress to next level */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 dark:bg-purple-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${levelInfo.percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-medium">
                <span>Next level</span>
                <span>{levelInfo.percentage}%</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1 text-amber-500" title={`Level ${levelInfo.level} • ${user?.streak} Day Streak`}>
              <Flame className="w-5 h-5 fill-amber-500" />
              <span className="text-xs font-bold">{user?.streak || 0}d</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
