import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { ProgressBar } from '../components/common/ProgressBar';
import { formatDuration } from '../utils/dateUtils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  Clock,
  CheckCircle2,
  Flame,
  Award,
  TrendingUp,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

export const Analytics = () => {
  const { pomodoroHistory, tasks, assignments, user, settings } = useApp();

  // 1. Calculations from actual data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalFocusSessions = pomodoroHistory.length;
  const totalStudyMinutes = pomodoroHistory.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
  const totalHours = (totalStudyMinutes / 60).toFixed(1);

  // Past 7 Days Daily Hours
  const weeklyData = useMemo(() => {
    const list = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const matches = pomodoroHistory.filter(
        (p) => p.timestamp && p.timestamp.startsWith(dateKey)
      );
      const minutes = matches.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
      const hours = parseFloat((minutes / 60).toFixed(1));

      list.push({
        name: dayLabel,
        hours,
        sessions: matches.length
      });
    }
    return list;
  }, [pomodoroHistory]);

  const weekTotalMinutes = weeklyData.reduce((acc, d) => acc + d.hours * 60, 0);
  const weekTotalHours = (weekTotalMinutes / 60).toFixed(1);
  const dailyAverageHours = (weekTotalMinutes / 60 / 7).toFixed(1);

  // Subject-wise Study Time Breakdown
  const subjectBreakdown = useMemo(() => {
    const map = {};
    pomodoroHistory.forEach((p) => {
      const sub = p.subject || 'General Study';
      map[sub] = (map[sub] || 0) + (p.durationMinutes || 25);
    });

    const items = Object.entries(map).map(([name, minutes]) => ({
      name,
      value: minutes,
      hours: parseFloat((minutes / 60).toFixed(1))
    }));

    // If no history yet, supply friendly empty fallback
    if (items.length === 0) {
      return [{ name: 'No sessions logged yet', value: 1, hours: 0 }];
    }

    return items;
  }, [pomodoroHistory]);

  // Productivity Trend over 14 Days
  const trendData = useMemo(() => {
    const list = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });

      const matches = pomodoroHistory.filter(
        (p) => p.timestamp && p.timestamp.startsWith(dateKey)
      );
      const minutes = matches.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
      const hours = parseFloat((minutes / 60).toFixed(1));

      list.push({
        date: dayLabel,
        hours
      });
    }
    return list;
  }, [pomodoroHistory]);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Productivity Analytics & Insights
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Real-time metrics, subject study allocation, and long-term academic habit trends
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Focused Hours"
          value={`${totalHours} hrs`}
          subtitle={`Across ${totalFocusSessions} Pomodoro sessions`}
          icon={Clock}
          colorScheme="purple"
          trend={{ value: `${weekTotalHours} hrs`, label: 'this week' }}
        />
        <StatCard
          title="Daily Average"
          value={`${dailyAverageHours} hrs/day`}
          subtitle={`Goal: ${user?.dailyGoalHours || 4} hrs/day`}
          icon={TrendingUp}
          colorScheme="blue"
          trend={{ value: 'Consistency', label: 'Past 7 days' }}
        />
        <StatCard
          title="Task Completion Rate"
          value={`${taskCompletionRate}%`}
          subtitle={`${completedTasks} of ${totalTasks} tasks done`}
          icon={CheckCircle2}
          colorScheme="emerald"
          trend={{ value: `${tasks.filter((t) => t.status !== 'Completed').length} left`, label: 'in queue' }}
        />
        <StatCard
          title="Academic XP Earned"
          value={`${user?.totalXP || 0} XP`}
          subtitle={`Level ${user?.level || 1} Scholar`}
          icon={Award}
          colorScheme="amber"
          trend={{ value: `${user?.streak || 0}d`, label: 'current streak' }}
        />
      </div>

      {/* 2-Column Section: 7-Day Bar Chart & Subject Distribution Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Focus Time Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Study Time (Past 7 Days)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Total: {weekTotalHours} hours this week
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
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
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700">
                          <p className="font-bold">{d.name}</p>
                          <p className="text-purple-300 mt-1">{d.hours} study hours</p>
                          <p className="text-slate-400">{d.sessions} Pomodoro cycles</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 2, 2]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Subject Distribution
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Focus time distribution across courses
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {subjectBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs rounded-xl p-2.5 shadow-xl border border-slate-700">
                            <p className="font-bold">{d.name}</p>
                            <p className="text-purple-300">{d.hours} hours ({formatDuration(d.value)})</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Subject list */}
            <div className="space-y-2 mt-2">
              {subjectBreakdown.slice(0, 4).map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{item.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 14-Day Long-term Area Trend Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              14-Day Study Consistency Trend
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Daily study trajectory over the past two weeks
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}h`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700">
                        <p className="font-bold">{d.date}</p>
                        <p className="text-purple-300 font-semibold">{d.hours} study hours</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorHours)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
