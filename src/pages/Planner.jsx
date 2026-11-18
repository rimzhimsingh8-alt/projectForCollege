import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { formatTime, formatDate, checkTimeOverlap, getWeekDates } from '../utils/dateUtils';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  BookOpen
} from 'lucide-react';

export const Planner = () => {
  const { sessions, addSession, updateSession, deleteSession, toggleSessionCompleted, settings } = useApp();

  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deletingSessionId, setDeletingSessionId] = useState(null);
  const [overlapWarning, setOverlapWarning] = useState(null);

  const initialForm = {
    title: '',
    subject: settings?.preferredSubjects?.[0] || 'General Study',
    date: selectedDate,
    startTime: '10:00',
    endTime: '11:30',
    description: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Available subjects
  const availableSubjects = Array.from(
    new Set([...(settings?.preferredSubjects || []), ...sessions.map((s) => s.subject)])
  ).filter(Boolean);

  const handleOpenAdd = (dateOverride = null) => {
    setEditingSession(null);
    setOverlapWarning(null);
    setFormData({
      ...initialForm,
      date: dateOverride || selectedDate
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session) => {
    setEditingSession(session);
    setOverlapWarning(null);
    setFormData({
      title: session.title,
      subject: session.subject,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      description: session.description || ''
    });
    setIsModalOpen(true);
  };

  // Form submission with overlap validation
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Check if start time is before end time
    if (formData.startTime >= formData.endTime) {
      setOverlapWarning('Start time must be strictly earlier than end time.');
      return;
    }

    // Check for overlapping sessions on the same date
    const conflictingSession = sessions.find((s) => {
      if (editingSession && s.id === editingSession.id) return false;
      if (s.date !== formData.date) return false;
      return checkTimeOverlap(formData.startTime, formData.endTime, s.startTime, s.endTime);
    });

    if (conflictingSession) {
      setOverlapWarning(
        `Warning: This overlaps with "${conflictingSession.title}" (${formatTime(conflictingSession.startTime)} – ${formatTime(conflictingSession.endTime)}). Adjust times to avoid scheduling conflicts.`
      );
      return;
    }

    if (editingSession) {
      updateSession(editingSession.id, formData);
    } else {
      addSession(formData);
    }
    setIsModalOpen(false);
  };

  // Week days array
  const weekDays = React.useMemo(() => {
    return getWeekDates(new Date(selectedDate));
  }, [selectedDate]);

  // Navigate dates
  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Daily sessions sorted by start time
  const daySessions = sessions
    .filter((s) => s.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Study Planner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Schedule dedicated revision sessions, block study times, and avoid collisions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Day / Week View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Week View
            </button>
          </div>

          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-semibold shadow-md shadow-purple-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Plan Session</span>
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(viewMode === 'day' ? -1 : -7)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60 hover:bg-purple-100 transition"
          >
            Today
          </button>
          <button
            onClick={() => changeDate(viewMode === 'day' ? 1 : 7)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {formatDate(selectedDate)}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {selectedDate === todayStr ? 'Today' : new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
          </span>
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {sessions.filter((s) => s.date === selectedDate).length} session(s)
        </div>
      </div>

      {/* Views: Day View vs Week View */}
      {viewMode === 'day' ? (
        /* Single Day Schedule Timeline */
        <div className="space-y-4">
          {daySessions.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title="No study blocks scheduled for this day"
              description="Plan your study intervals in advance to maintain focus and avoid last-minute cramming."
              actionLabel="Schedule Session"
              onAction={() => handleOpenAdd()}
            />
          ) : (
            <div className="space-y-3">
              {daySessions.map((session) => {
                const isDone = session.completed;

                return (
                  <div
                    key={session.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-card hover:shadow-card-hover ${
                      isDone
                        ? 'border-emerald-200/60 dark:border-emerald-950/40 bg-emerald-50/10'
                        : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleSessionCompleted(session.id)}
                        className={`mt-1 shrink-0 transition ${
                          isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="Mark session as complete"
                      >
                        {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="primary" size="sm">
                            {session.subject}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                            <span>
                              {formatTime(session.startTime)} – {formatTime(session.endTime)}
                            </span>
                          </div>
                        </div>

                        <h4
                          className={`text-base font-bold tracking-tight ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {session.title}
                        </h4>
                        {session.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {session.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenEdit(session)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="Edit session"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingSessionId(session.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 7-Day Weekly Grid View */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const isToday = day.dateStr === todayStr;
            const isSelected = day.dateStr === selectedDate;
            const daySessionsForCol = sessions
              .filter((s) => s.date === day.dateStr)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={day.dateStr}
                className={`flex flex-col min-h-[320px] rounded-2xl border p-3 bg-white dark:bg-slate-900 transition-all ${
                  isToday
                    ? 'border-purple-500/80 ring-2 ring-purple-500/20 shadow-md'
                    : isSelected
                    ? 'border-indigo-400'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Column Day Header */}
                <div
                  onClick={() => setSelectedDate(day.dateStr)}
                  className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-400 block">
                      {day.dayName}
                    </span>
                    <span
                      className={`text-lg font-extrabold ${
                        isToday ? 'text-purple-600 dark:text-purple-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAdd(day.dateStr);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
                    title="Add session to this day"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day's sessions blocks */}
                <div className="flex-1 space-y-2 mt-2.5 overflow-y-auto custom-scrollbar">
                  {daySessionsForCol.length === 0 ? (
                    <div className="text-[11px] text-slate-400 text-center py-8">
                      No sessions
                    </div>
                  ) : (
                    daySessionsForCol.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleOpenEdit(s)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition hover:scale-[1.02] ${
                          s.completed
                            ? 'bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-900/40'
                            : 'bg-purple-50/50 border-purple-200/60 dark:bg-purple-950/30 dark:border-purple-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[10px] text-purple-700 dark:text-purple-300 mb-0.5">
                          <span>{formatTime(s.startTime)}</span>
                          <span className="truncate max-w-[60px]">{s.subject}</span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {s.title}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Session Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSession ? 'Edit Study Session' : 'Plan Study Session'}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          {overlapWarning && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{overlapWarning}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Session Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setOverlapWarning(null);
                setFormData({ ...formData, title: e.target.value });
              }}
              placeholder="e.g. Graph Theory & Dijkstra Debugging"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Algorithms"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => {
                  setOverlapWarning(null);
                  setFormData({ ...formData, date: e.target.value });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => {
                  setOverlapWarning(null);
                  setFormData({ ...formData, startTime: e.target.value });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => {
                  setOverlapWarning(null);
                  setFormData({ ...formData, endTime: e.target.value });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Description / Objectives
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What specifically will you achieve during this session?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 shadow-md shadow-purple-500/20"
            >
              {editingSession ? 'Save Changes' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingSessionId)}
        onClose={() => setDeletingSessionId(null)}
        onConfirm={() => {
          if (deletingSessionId) deleteSession(deletingSessionId);
        }}
        title="Delete Session"
        message="Are you sure you want to remove this study block from your schedule?"
        confirmText="Delete"
        isDanger={true}
      />
    </div>
  );
};
