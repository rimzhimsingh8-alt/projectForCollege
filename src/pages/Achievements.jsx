import React from 'react';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS, calculateLevel } from '../data/achievementsList';
import { ProgressBar } from '../components/common/ProgressBar';
import { formatDate } from '../utils/dateUtils';
import {
  Trophy,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  Clock,
  Crown,
  Calendar,
  BookOpen,
  Lock,
  Sparkles
} from 'lucide-react';

export const Achievements = () => {
  const { user, unlockedAchievements, tasks, pomodoroHistory, assignments, sessions, notes } = useApp();

  const levelInfo = calculateLevel(user?.totalXP || 0);

  // Compute current live metrics to display progress towards badges
  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const focusSessionsCount = pomodoroHistory.length;
  const totalStudyMinutes = pomodoroHistory.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
  const completedAssignmentsCount = assignments.filter((a) => a.completed).length;
  const streak = user?.streak || 0;

  const unlockedMap = new Map();
  unlockedAchievements.forEach((item) => {
    unlockedMap.set(item.id, item.unlockedAt);
  });

  const iconMap = {
    CheckCircle2,
    Flame,
    Trophy,
    Zap,
    Crown,
    Clock,
    Calendar,
    Award,
    BookOpen
  };

  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedMap.has(a.id)).length;
  const totalBadges = ACHIEVEMENTS.length;
  const badgesProgressPercent = Math.round((unlockedCount / totalBadges) * 100);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Streaks & Achievements
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Level up your academic momentum, hit milestones, and earn scholar badges
        </p>
      </div>

      {/* Gamification Level Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden border border-purple-800/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-800/60 px-2.5 py-0.5 rounded-full border border-purple-700">
                  Level {levelInfo.level} Scholar
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  {streak} Day Streak
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {user?.name || 'Alex Chen'}
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {user?.totalXP || 0} Total Experience Points
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs text-purple-200 block font-semibold mb-1">
              Progress to Level {levelInfo.level + 1}
            </span>
            <span className="text-xl font-bold font-mono">
              {levelInfo.progressInLevel} / {levelInfo.neededForNext} XP
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 relative z-10">
          <ProgressBar
            value={levelInfo.progressInLevel}
            max={levelInfo.neededForNext}
            height="h-2.5"
            color="bg-gradient-to-r from-amber-400 to-purple-400"
            trackColor="bg-slate-800"
          />
        </div>
      </div>

      {/* Badges Overview Stat Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Badges Unlocked ({unlockedCount} of {totalBadges})
            </span>
            <span className="block text-[11px] text-slate-400">
              {badgesProgressPercent}% completed
            </span>
          </div>
        </div>
        <div className="w-36">
          <ProgressBar value={unlockedCount} max={totalBadges} height="h-2" color="bg-purple-600" />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedMap.has(ach.id);
          const unlockedAt = unlockedMap.get(ach.id);
          const Icon = iconMap[ach.icon] || Trophy;

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-purple-200 dark:border-purple-900/60 shadow-card hover:shadow-card-hover'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div
                    className={`p-3 rounded-2xl border ${
                      isUnlocked
                        ? ach.tier === 'gold'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : ach.tier === 'silver'
                          ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                          : 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                        : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isUnlocked
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : 'bg-slate-200/60 text-slate-500 dark:bg-slate-800'
                    }`}
                  >
                    +{ach.xp} XP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {ach.title}
                  </h4>
                  {!isUnlocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold">
                {isUnlocked ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked on {formatDate(unlockedAt)}
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Locked Milestone
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
