import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTimer } from '../context/TimerContext';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { Badge } from '../components/common/Badge';
import { getRelativeDays, formatTime, formatDuration } from '../utils/dateUtils';
import {
  CheckSquare,
  Clock,
  Flame,
  TrendingUp,
  Plus,
  Play,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Award,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks, sessions, assignments, pomodoroHistory, user, activities, toggleTaskStatus } = useApp();
  const { startTimer, isRunning } = useTimer();

  // 1. Compute dynamic statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Study hours today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPomodoros = pomodoroHistory.filter(
    (p) => p.timestamp && p.timestamp.startsWith(todayStr)
  );
  const todayFocusMinutes = todayPomodoros.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
  const todayStudyHours = (todayFocusMinutes / 60).toFixed(1);

  // Daily Goal progress
  const dailyGoalHours = user?.dailyGoalHours || 4;
  const dailyProgressPercent = Math.min(
    100,
    Math.round(((todayFocusMinutes / 60) / (dailyGoalHours || 1)) * 100)
  );

  // Today's scheduled sessions from Study Planner
  const todaySessions = sessions.filter((s) => s.date === todayStr);

  // Upcoming assignments / exams (sorted by nearest due date)
  const upcomingDeadlines = assignments
    .filter((a) => !a.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  // Past 7 days productivity chart data
  const chartData = React.useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayPoms = pomodoroHistory.filter(
        (p) => p.timestamp && p.timestamp.startsWith(dateKey)
      );
      const dayMinutes = dayPoms.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
      const dayHours = parseFloat((dayMinutes / 60).toFixed(1));

      days.push({
        day: dayLabel,
        hours: dayHours,
        sessions: dayPoms.length
      });
    }
    return days;
  }, [pomodoroHistory]);

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Welcome & Quick Action Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 blur-2xl pointer-events-none rounded-full transform translate-x-1/2" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-purple-100 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Student Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Alex'}!
          </h2>
          <p className="text-purple-100 text-sm max-w-xl font-medium leading-relaxed">
            You're on a <strong className="text-amber-300 font-bold">{user?.streak || 0}-day streak</strong>. You have {pendingTasks} pending tasks and {upcomingDeadlines.length} upcoming deadlines this week.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={() => navigate('/pomodoro')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-purple-700 hover:bg-purple-50 active:scale-95 text-sm font-bold shadow-md transition"
          >
            <Play className="w-4 h-4 fill-purple-700" />
            <span>{isRunning ? 'View Focus Timer' : 'Start Focus Session'}</span>
          </button>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-800/60 hover:bg-purple-800/80 active:scale-95 text-white border border-purple-400/30 text-sm font-semibold backdrop-blur-md transition"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>AI Advice</span>
          </button>
        </div>
      </div>

      {/* Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          subtitle={`${completedTasks} completed • ${pendingTasks} pending`}
          icon={CheckSquare}
          colorScheme="purple"
          trend={{ value: `${taskCompletionRate}%`, label: 'completion rate' }}
        />
        <StatCard
          title="Today's Study Time"
          value={`${todayStudyHours} hrs`}
          subtitle={`${todayPomodoros.length} focus sessions logged`}
          icon={Clock}
          colorScheme="blue"
          trend={{ value: `${dailyProgressPercent}%`, label: `of ${dailyGoalHours}h daily goal` }}
        />
        <StatCard
          title="Current Streak"
          value={`${user?.streak || 0} Days`}
          subtitle="Keep daily consistency"
          icon={Flame}
          colorScheme="amber"
          trend={{ value: '+50 XP', label: 'daily study bonus' }}
        />
        <StatCard
          title="Total Experience"
          value={`${user?.totalXP || 0} XP`}
          subtitle={`Level ${user?.level || 1} Scholar`}
          icon={TrendingUp}
          colorScheme="emerald"
          trend={{ value: 'Rank', label: 'Top 10% student' }}
        />
      </div>

      {/* Main Grid: Weekly Chart & Daily Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Recharts Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Weekly Study Productivity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Focus hours logged over the past 7 days
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400" />
                Focus Hours
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}h`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(139, 92, 246, 0.06)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700">
                          <p className="font-bold">{data.day}</p>
                          <p className="text-purple-300 mt-1">{data.hours} study hours</p>
                          <p className="text-slate-400">{data.sessions} Pomodoros</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="hours"
                  fill="#8b5cf6"
                  radius={[8, 8, 2, 2]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Goal & Overview Card (1 Col) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Daily Goal Tracker
              </h3>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-lg">
                {dailyProgressPercent}% Completed
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
              Your daily commitment is <strong>{dailyGoalHours} hours</strong> of focused learning.
            </p>

            <div className="space-y-2 mb-6">
              <ProgressBar
                value={parseFloat(todayStudyHours)}
                max={dailyGoalHours}
                height="h-3"
                color="bg-gradient-to-r from-purple-600 to-indigo-600"
                showLabel={false}
              />
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>{todayStudyHours} hours completed</span>
                <span>{Math.max(0, (dailyGoalHours - parseFloat(todayStudyHours)).toFixed(1))}h left</span>
              </div>
            </div>

            {/* Quick summary metrics */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Pending Tasks
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {pendingTasks}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Deadlines
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {upcomingDeadlines.length}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/planner')}
            className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Open Study Planner</span>
          </button>
        </div>
      </div>

      {/* Secondary Grid: Today's Schedule & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Today's Schedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {todaySessions.length} planned study blocks for today
              </p>
            </div>
            <button
              onClick={() => navigate('/planner')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todaySessions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No study sessions scheduled for today.{' '}
                <button
                  onClick={() => navigate('/planner')}
                  className="text-purple-600 dark:text-purple-400 font-bold underline ml-1"
                >
                  Schedule one now
                </button>
              </div>
            ) : (
              todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {session.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {formatTime(session.startTime)} – {formatTime(session.endTime)} •{' '}
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">{session.subject}</span>
                      </p>
                    </div>
                  </div>

                  <Badge variant={session.completed ? 'completed' : 'primary'}>
                    {session.completed ? 'Done' : 'Upcoming'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Deadlines & Exams */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Upcoming Deadlines & Exams
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Prioritize submissions and test preparation
              </p>
            </div>
            <button
              onClick={() => navigate('/assignments')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                All caught up! No pending assignments or exams.
              </div>
            ) : (
              upcomingDeadlines.map((item) => {
                const countdown = getRelativeDays(item.dueDate);
                const isOverdue = countdown.status === 'overdue';
                const isToday = countdown.status === 'today';

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          item.type === 'Exam'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {item.type === 'Exam' ? <AlertCircle className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {item.subject} • <span className="font-semibold">{item.type}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                          isOverdue
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : isToday
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {countdown.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
