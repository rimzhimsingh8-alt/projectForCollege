import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  Settings as SettingsIcon,
  User,
  Sun,
  Moon,
  Clock,
  Volume2,
  VolumeX,
  Trash2,
  RotateCcw,
  Plus,
  X,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const Settings = () => {
  const { user, setUser, settings, setSettings, clearAllData, resetToSampleData, showToast } = useApp();
  const { theme, setTheme } = useTheme();

  // Local editable states
  const [name, setName] = useState(user?.name || 'Alex Chen');
  const [role, setRole] = useState(user?.role || 'Computer Science & AI Major');
  const [dailyGoalHours, setDailyGoalHours] = useState(user?.dailyGoalHours || 4);
  const [workDuration, setWorkDuration] = useState(settings?.workDuration || 25);
  const [shortBreakDuration, setShortBreakDuration] = useState(settings?.shortBreakDuration || 5);
  const [longBreakDuration, setLongBreakDuration] = useState(settings?.longBreakDuration || 15);
  const [soundEnabled, setSoundEnabled] = useState(settings?.soundEnabled ?? true);
  const [subjects, setSubjects] = useState(settings?.preferredSubjects || ['Algorithms', 'Calculus', 'Data Science', 'Computer Systems', 'Web Development']);
  const [newSubjectInput, setNewSubjectInput] = useState('');

  // Modals for destructive actions
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleSaveProfileAndTimer = (e) => {
    e.preventDefault();

    // Update user profile
    setUser((prev) => ({
      ...prev,
      name,
      role,
      dailyGoalHours: parseFloat(dailyGoalHours)
    }));

    // Update settings
    setSettings((prev) => ({
      ...prev,
      studentName: name,
      workDuration: parseInt(workDuration, 10),
      shortBreakDuration: parseInt(shortBreakDuration, 10),
      longBreakDuration: parseInt(longBreakDuration, 10),
      soundEnabled,
      preferredSubjects: subjects
    }));

    showToast('Settings saved successfully', 'success');
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    const trimmed = newSubjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setNewSubjectInput('');
    }
  };

  const handleRemoveSubject = (subToRemove) => {
    setSubjects(subjects.filter((s) => s !== subToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Customize your study experience, timer parameters, profile info, and application storage
        </p>
      </div>

      <form onSubmit={handleSaveProfileAndTimer} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Student Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Chen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Major / Academic Program
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Computer Science Major"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Daily Study Goal (Hours): {dailyGoalHours} hours/day
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={dailyGoalHours}
              onChange={(e) => setDailyGoalHours(e.target.value)}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
              <span>1 hr (Light)</span>
              <span>4 hrs (Target)</span>
              <span>10 hrs (Intensive)</span>
            </div>
          </div>
        </div>

        {/* Theme & Display */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sun className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interface Theme
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex items-center justify-between transition ${
                theme === 'light'
                  ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/20 ring-2 ring-purple-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">Light Mode</span>
                  <span className="text-xs text-slate-400">Clean, crisp white styling</span>
                </div>
              </div>
              {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex items-center justify-between transition ${
                theme === 'dark'
                  ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/20 ring-2 ring-purple-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">Dark Mode</span>
                  <span className="text-xs text-slate-400">Sleek midnight palette</span>
                </div>
              </div>
              {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* Pomodoro Timer Configuration */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Focus Timer Durations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Focus Session (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={workDuration}
                onChange={(e) => setWorkDuration(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Short Break (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreakDuration}
                onChange={(e) => setShortBreakDuration(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Long Break (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>
        </div>

        {/* Preferred Subjects Manager */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <SettingsIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Course & Subject Catalog
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.map((sub) => (
              <span
                key={sub}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80 text-xs font-bold"
              >
                <span>{sub}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(sub)}
                  className="p-0.5 rounded-md hover:bg-purple-200/60 dark:hover:bg-purple-800 text-purple-500 hover:text-purple-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-md pt-2">
            <input
              type="text"
              value={newSubjectInput}
              onChange={(e) => setNewSubjectInput(e.target.value)}
              placeholder="Add course name (e.g. Neuroscience)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              type="button"
              onClick={handleAddSubject}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
            >
              Add Subject
            </button>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Danger & Maintenance Zone */}
      <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-rose-200/60 dark:border-rose-900/40 text-rose-700 dark:text-rose-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-base font-bold">Data Management & Reset</h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Manage local storage records. Resetting restores original showcase data, while clearing deletes all user tasks, notes, sessions, and streaks.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>Restore Demo Sample Data</span>
          </button>

          <button
            type="button"
            onClick={() => setIsClearConfirmOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Application Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToSampleData}
        title="Restore Sample Data"
        message="This will replace current local records with realistic initial sample tasks, notes, and study sessions. Continue?"
        confirmText="Restore Demo Data"
      />

      <ConfirmModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Application Data"
        message="Are you completely sure? This will permanently wipe all tasks, planner schedules, focus records, and notes from LocalStorage."
        confirmText="Clear Everything"
        isDanger={true}
      />
    </div>
  );
};
