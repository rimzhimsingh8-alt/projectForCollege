import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { formatTime, formatDate } from '../utils/dateUtils';
import {
  Sparkles,
  Calendar,
  ListTodo,
  CheckCircle2,
  Clock,
  ArrowRight,
  Brain,
  Zap,
  Target,
  RefreshCw,
  Plus,
  BookOpen,
  Info
} from 'lucide-react';

export const AIAssistant = () => {
  const { tasks, assignments, sessions, addSession, addTask, showToast, settings } = useApp();

  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable' | 'breakdown' | 'priority' | 'revision'

  // Tab 1: Timetable Generator Inputs
  const [availableHours, setAvailableHours] = useState(4);
  const [selectedSubjects, setSelectedSubjects] = useState(() =>
    settings?.preferredSubjects?.slice(0, 3) || ['Algorithms', 'Calculus', 'Data Science']
  );
  const [preferredStartTime, setPreferredStartTime] = useState('10:00');
  const [generatedSchedule, setGeneratedSchedule] = useState(null);

  // Tab 2: Task Breakdown Inputs
  const [taskToBreak, setTaskToBreak] = useState('');
  const [selectedSubjectForBreak, setSelectedSubjectForBreak] = useState(
    settings?.preferredSubjects?.[0] || 'General'
  );
  const [breakdownSteps, setBreakdownSteps] = useState(null);

  // Available subjects pool
  const allSubjects = Array.from(
    new Set([
      ...(settings?.preferredSubjects || []),
      ...tasks.map((t) => t.subject),
      ...assignments.map((a) => a.subject)
    ])
  ).filter(Boolean);

  // 1. RULE-BASED TIMETABLE GENERATION ALGORITHM
  const handleGenerateTimetable = () => {
    if (selectedSubjects.length === 0) {
      showToast('Please select at least one subject to study', 'error');
      return;
    }

    const [startH, startM] = preferredStartTime.split(':').map(Number);
    let currentMinutes = startH * 60 + startM;

    // Distribute available hours among selected subjects with pomodoro-style 45m or 50m intervals + 10m breaks
    const blocks = [];
    const blockDuration = 50; // minutes
    const breakDuration = 10; // minutes
    const totalSlots = Math.floor((availableHours * 60) / (blockDuration + breakDuration));

    const pendingTasksBySubject = {};
    tasks.filter((t) => t.status !== 'Completed').forEach((t) => {
      if (!pendingTasksBySubject[t.subject]) pendingTasksBySubject[t.subject] = [];
      pendingTasksBySubject[t.subject].push(t);
    });

    for (let i = 0; i < Math.max(1, totalSlots); i++) {
      const subject = selectedSubjects[i % selectedSubjects.length];
      const startMinutes = currentMinutes;
      const endMinutes = currentMinutes + blockDuration;

      const formatTimeFromMinutes = (mins) => {
        const h = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      };

      const pendingForSub = pendingTasksBySubject[subject] || [];
      const suggestedTask = pendingForSub[i % (pendingForSub.length || 1)]?.title || 'Core concept review and practice problems';

      blocks.push({
        id: 'gen-' + i,
        subject,
        title: `${subject}: Focus Block ${Math.floor(i / selectedSubjects.length) + 1}`,
        objective: suggestedTask,
        startTime: formatTimeFromMinutes(startMinutes),
        endTime: formatTimeFromMinutes(endMinutes),
        duration: blockDuration
      });

      currentMinutes = endMinutes + breakDuration;
    }

    setGeneratedSchedule(blocks);
    showToast('Intelligent study timetable generated!', 'success');
  };

  const handleApplyScheduleToPlanner = () => {
    if (!generatedSchedule || generatedSchedule.length === 0) return;
    const todayStr = new Date().toISOString().split('T')[0];

    generatedSchedule.forEach((block) => {
      addSession({
        title: block.title,
        subject: block.subject,
        date: todayStr,
        startTime: block.startTime,
        endTime: block.endTime,
        description: block.objective
      });
    });

    showToast(`Added ${generatedSchedule.length} sessions to your Study Planner!`, 'success');
  };

  // 2. TASK BREAKDOWN ENGINE
  const handleGenerateBreakdown = (e) => {
    e.preventDefault();
    if (!taskToBreak.trim()) return;

    const query = taskToBreak.toLowerCase();
    let steps = [];

    if (query.includes('exam') || query.includes('test') || query.includes('midterm')) {
      steps = [
        { title: 'Gather syllabus & past year exams', minutes: 30, priority: 'High' },
        { title: 'Create summary cheat-sheet of key formulas & theorems', minutes: 60, priority: 'High' },
        { title: 'Solve 10 representative practice questions under timed conditions', minutes: 90, priority: 'Medium' },
        { title: 'Identify weak problem types & review lecture recordings', minutes: 45, priority: 'Medium' },
        { title: 'Final rapid flashcard rehearsal & error log review', minutes: 30, priority: 'Low' }
      ];
    } else if (query.includes('project') || query.includes('app') || query.includes('code') || query.includes('algorithm')) {
      steps = [
        { title: 'Deconstruct requirements & draft architecture diagrams', minutes: 45, priority: 'High' },
        { title: 'Implement core data structures and interfaces', minutes: 60, priority: 'High' },
        { title: 'Write algorithmic logic and edge case handlers', minutes: 90, priority: 'High' },
        { title: 'Set up automated unit tests & verify correctness', minutes: 45, priority: 'Medium' },
        { title: 'Polish documentation, clean comments & draft submission README', minutes: 30, priority: 'Low' }
      ];
    } else if (query.includes('essay') || query.includes('paper') || query.includes('report') || query.includes('write')) {
      steps = [
        { title: 'Formulate thesis statement & gather 4 peer-reviewed sources', minutes: 45, priority: 'High' },
        { title: 'Draft comprehensive structured outline with section headings', minutes: 30, priority: 'Medium' },
        { title: 'Write introductory argument and body sections 1 & 2', minutes: 75, priority: 'High' },
        { title: 'Write analysis, counter-arguments and conclusion', minutes: 60, priority: 'Medium' },
        { title: 'Proofread citations, check formatting and bibliography', minutes: 30, priority: 'Low' }
      ];
    } else {
      steps = [
        { title: `Step 1: Define specific scope & requirements for "${taskToBreak}"`, minutes: 30, priority: 'High' },
        { title: 'Step 2: Gather reference materials, notes, and documentation', minutes: 45, priority: 'Medium' },
        { title: 'Step 3: Execute initial draft or core implementation', minutes: 75, priority: 'High' },
        { title: 'Step 4: Test, debug, and review against acceptance criteria', minutes: 45, priority: 'Medium' },
        { title: 'Step 5: Final review and clean polish before submission', minutes: 25, priority: 'Low' }
      ];
    }

    setBreakdownSteps(steps);
    showToast('Task broken down into 5 actionable milestones', 'success');
  };

  const handleImportSubtasks = () => {
    if (!breakdownSteps) return;
    const todayStr = new Date().toISOString().split('T')[0];

    breakdownSteps.forEach((step) => {
      addTask({
        title: step.title,
        description: `Subtask of "${taskToBreak}". Est: ${step.minutes} mins.`,
        subject: selectedSubjectForBreak,
        priority: step.priority,
        status: 'Pending',
        dueDate: todayStr
      });
    });

    showToast(`Added ${breakdownSteps.length} tasks to your My Tasks board!`, 'success');
  };

  // 3. PRIORITIZATION ADVISOR
  const pendingTasksList = tasks.filter((t) => t.status !== 'Completed');
  const prioritizedAdvice = React.useMemo(() => {
    const scored = pendingTasksList.map((t) => {
      let score = 0;
      let reasons = [];

      // Priority weights
      if (t.priority === 'High') {
        score += 50;
        reasons.push('Marked as High Priority');
      } else if (t.priority === 'Medium') {
        score += 25;
      }

      // Due date urgency
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        score += 80;
        reasons.push(`Overdue by ${Math.abs(diffDays)} days!`);
      } else if (diffDays === 0) {
        score += 60;
        reasons.push('Due today');
      } else if (diffDays <= 2) {
        score += 40;
        reasons.push(`Due in ${diffDays} days`);
      }

      // Check if there is an upcoming exam in this subject
      const hasUpcomingExam = assignments.some(
        (a) => !a.completed && a.subject === t.subject && a.type === 'Exam'
      );
      if (hasUpcomingExam) {
        score += 30;
        reasons.push(`Upcoming exam scheduled in ${t.subject}`);
      }

      return {
        ...t,
        score,
        reasons
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [pendingTasksList, assignments]);

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rule-Based Intelligence Engine</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Study Assistant & Planner
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Intelligently schedule timetable blocks, decompose large assignments, and prioritize critical coursework
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('timetable')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'timetable'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Timetable Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('breakdown')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'breakdown'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Task Breakdown Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('priority')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'priority'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Prioritization Advisor</span>
        </button>

        <button
          onClick={() => setActiveTab('revision')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
            activeTab === 'revision'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Spaced Revision</span>
        </button>
      </div>

      {/* Tab 1: Timetable Generator */}
      {activeTab === 'timetable' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Study Schedule Parameters
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Available Study Hours Today: {availableHours} hrs
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={availableHours}
                onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                <span>1 hour</span>
                <span>4 hours</span>
                <span>8 hours</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Preferred Start Time
              </label>
              <input
                type="time"
                value={preferredStartTime}
                onChange={(e) => setPreferredStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Select Focus Subjects ({selectedSubjects.length} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {allSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
                        } else {
                          setSelectedSubjects([...selectedSubjects, sub]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerateTimetable}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Timetable</span>
            </button>
          </div>

          {/* Generated Result preview */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Generated Daily Plan
                </h3>
                {generatedSchedule && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                    {generatedSchedule.length} Study Intervals
                  </span>
                )}
              </div>

              {!generatedSchedule ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <Brain className="w-10 h-10 mx-auto text-purple-400/40 mb-3" />
                  <p className="font-semibold text-slate-600 dark:text-slate-300">No timetable generated yet</p>
                  <p className="text-xs mt-1 max-w-sm mx-auto">
                    Configure your available study hours and subjects on the left, then click "Generate Timetable".
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedSchedule.map((block) => (
                    <div
                      key={block.id}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <Badge variant="primary" size="sm">
                              {block.subject}
                            </Badge>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {formatTime(block.startTime)} – {formatTime(block.endTime)} ({block.duration}m)
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {block.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Objective: {block.objective}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {generatedSchedule && (
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={handleApplyScheduleToPlanner}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-500/20 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save All to Study Planner</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Task Breakdown Engine */}
      {activeTab === 'breakdown' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Decompose Complex Projects & Exam Prep
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Turn an intimidating project into bite-sized, executable subtasks with estimated timeframes
            </p>
          </div>

          <form onSubmit={handleGenerateBreakdown} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={taskToBreak}
              onChange={(e) => setTaskToBreak(e.target.value)}
              placeholder="e.g. Prepare for Operating Systems final exam OR Build Machine Learning pipeline..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <select
              value={selectedSubjectForBreak}
              onChange={(e) => setSelectedSubjectForBreak(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {allSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md shadow-purple-500/20 transition shrink-0"
            >
              Breakdown Task
            </button>
          </form>

          {breakdownSteps && (
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Actionable Steps for "{taskToBreak}"
                </h4>
                <button
                  onClick={handleImportSubtasks}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200/60 dark:border-purple-800/60 hover:bg-purple-100 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Import All as Tasks</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {breakdownSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-600/10 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {step.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {step.minutes} mins
                      </span>
                      <Badge
                        variant={step.priority === 'High' ? 'high' : step.priority === 'Medium' ? 'medium' : 'low'}
                        size="sm"
                      >
                        {step.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Prioritization Advisor */}
      {activeTab === 'priority' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Eisenhower Matrix: Recommended Next Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Algorithmically ranked by deadline proximity, priority flag, and exam weighting
            </p>
          </div>

          {prioritizedAdvice.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              All tasks are completed! No urgent pending assignments.
            </div>
          ) : (
            <div className="space-y-4">
              {prioritizedAdvice.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-purple-200/80 dark:border-purple-900/60 bg-purple-50/20 dark:bg-purple-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-purple-600/30 shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="primary" size="sm">{item.subject}</Badge>
                        <Badge variant={item.priority === 'High' ? 'high' : 'medium'} size="sm">
                          {item.priority} Priority
                        </Badge>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.description}
                        </p>
                      )}

                      {/* Reasons why it's recommended */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        {item.reasons.map((r, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <span className="text-xs text-slate-400 block sm:text-right mb-1">Due {formatDate(item.dueDate)}</span>
                    <button
                      onClick={() => {
                        showToast(`Focused on "${item.title}"`, 'info');
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs shadow-sm transition"
                    >
                      Start This Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Spaced Repetition & Revision Suggestions */}
      {activeTab === 'revision' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Spaced Repetition & Retention Protocol
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Based on the Ebbinghaus forgetting curve: review material at 1-day, 3-day, and 7-day intervals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 block w-max mb-2">
                1-Day Interval
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Yesterday's Material
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Review notes taken within the past 24 hours. Solidify short-term recall into working memory.
              </p>
              <button
                onClick={() => showToast('Session scheduled for yesterday note review', 'success')}
                className="mt-4 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                <span>Plan 20m Quick Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 block w-max mb-2">
                3-Day Interval
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Recall Drill
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Solve practice problems without referencing lecture notes. Test conceptual understanding.
              </p>
              <button
                onClick={() => showToast('Session scheduled for active recall drill', 'success')}
                className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Plan 40m Drill Block</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 block w-max mb-2">
                7-Day Interval
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Long-Term Synthesis
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Connect earlier concepts with current topics. Create integrated summary mind-maps.
              </p>
              <button
                onClick={() => showToast('Session scheduled for long-term synthesis', 'success')}
                className="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Plan 60m Deep Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
