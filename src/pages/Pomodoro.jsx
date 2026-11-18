import React from 'react';
import { useTimer } from '../context/TimerContext';
import { useApp } from '../context/AppContext';
import { formatDuration } from '../utils/dateUtils';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Coffee,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';

export const Pomodoro = () => {
  const {
    mode,
    formattedTime,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    progressPercent,
    selectedSubject,
    setSelectedSubject
  } = useTimer();

  const { pomodoroHistory, settings } = useApp();

  const availableSubjects = settings?.preferredSubjects || ['Algorithms', 'Calculus', 'Data Science', 'Computer Systems', 'Web Development'];

  // Calculate stats from pomodoro history
  const totalSessions = pomodoroHistory.length;
  const totalMinutes = pomodoroHistory.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = pomodoroHistory.filter((p) => p.timestamp && p.timestamp.startsWith(todayStr));
  const todayMinutes = todaySessions.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pomodoro Focus Timer
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Eliminate distractions with time-boxed intervals and deep work cycles
        </p>
      </div>

      {/* Main Timer Glassmorphic Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center">
        {/* Glow ambient background effect */}
        <div
          className={`absolute inset-0 opacity-10 blur-3xl pointer-events-none transition-colors duration-700 ${
            mode === 'work' ? 'bg-purple-600' : 'bg-emerald-500'
          }`}
        />

        {/* Mode Selector Tabs */}
        <div className="relative z-10 flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'work'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Focus ({settings?.workDuration || 25}m)</span>
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Short Break ({settings?.shortBreakDuration || 5}m)</span>
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'longBreak'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Long Break ({settings?.longBreakDuration || 15}m)</span>
          </button>
        </div>

        {/* Big Circular Clock Display */}
        <div className="relative z-10 my-4 flex flex-col items-center justify-center">
          {/* Radial progress ring SVG */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`transition-all duration-500 ease-out ${
                  mode === 'work' ? 'stroke-purple-600' : 'stroke-emerald-500'
                }`}
                strokeWidth="5"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Timer Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {formattedTime}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                {mode === 'work' ? 'Deep Work Session' : 'Rest & Recharge'}
              </span>
            </div>
          </div>
        </div>

        {/* Subject Focus Selector */}
        {mode === 'work' && (
          <div className="relative z-10 flex items-center gap-2 mt-4 mb-6">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={isRunning}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-purple-700 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-60"
            >
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        {/* Controls: Start/Pause & Reset */}
        <div className="relative z-10 flex items-center gap-4 mt-2">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-base shadow-xl shadow-purple-600/30 transition duration-200"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Focus</span>
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-base shadow-xl shadow-amber-500/30 transition duration-200"
            >
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={() => resetTimer()}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition active:scale-95"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Focus Analytics Mini Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Today's Sessions
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {todaySessions.length}
            </span>
            <span className="text-xs text-slate-500 font-medium block">
              {formatDuration(todayMinutes)} focused today
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Focus Time
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {formatDuration(totalMinutes)}
            </span>
            <span className="text-xs text-slate-500 font-medium block">
              Across {totalSessions} completed cycles
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              XP Earned
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              +{totalSessions * 50} XP
            </span>
            <span className="text-xs text-slate-500 font-medium block">
              50 XP per completed session
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
