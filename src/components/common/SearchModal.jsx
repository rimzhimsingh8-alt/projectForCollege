import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, CheckSquare, Calendar, BookOpen, FileText, ArrowRight, X } from 'lucide-react';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { tasks, sessions, assignments, notes } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or window event
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      )
    : [];

  const filteredAssignments = q
    ? assignments.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q)
      )
    : [];

  const filteredNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q)
      )
    : [];

  const filteredSessions = q
    ? sessions.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      )
    : [];

  const totalResults =
    filteredTasks.length + filteredAssignments.length + filteredNotes.length + filteredSessions.length;

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, notes, assignments, subjects..."
            className="w-full bg-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 flex-1 custom-scrollbar">
          {!q ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <p className="font-medium">Type a keyword to search across StudyFlow</p>
              <div className="flex justify-center gap-2 mt-3 text-xs">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Tasks</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Study Planner</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Exams & Deadlines</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Quick Notes</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Tasks ({filteredTasks.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleSelect('/tasks')}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer group transition"
                      >
                        <div className="flex items-center gap-3">
                          <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {t.title}
                            </span>
                            <span className="ml-2 text-xs text-slate-400">({t.subject})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredAssignments.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Assignments & Exams ({filteredAssignments.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredAssignments.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => handleSelect('/assignments')}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer group transition"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {a.title}
                            </span>
                            <span className="ml-2 text-xs text-slate-400">({a.type} • {a.subject})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredNotes.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Notes ({filteredNotes.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredNotes.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleSelect('/notes')}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer group transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {n.title}
                            </span>
                            <span className="ml-2 text-xs text-slate-400">({n.subject})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredSessions.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Study Sessions ({filteredSessions.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {filteredSessions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleSelect('/planner')}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer group transition"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <div>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {s.title}
                            </span>
                            <span className="ml-2 text-xs text-slate-400">({s.startTime} - {s.endTime})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
