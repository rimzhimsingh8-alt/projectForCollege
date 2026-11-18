/**
 * List of StudyFlow achievements and badges
 */

export const ACHIEVEMENTS = [
  {
    id: 'first_task',
    title: 'First Step',
    description: 'Complete your first task',
    xp: 50,
    icon: 'CheckCircle2',
    tier: 'bronze',
    check: ({ completedTasksCount }) => completedTasksCount >= 1
  },
  {
    id: 'first_focus',
    title: 'Deep Diver',
    description: 'Complete your first Pomodoro focus session',
    xp: 50,
    icon: 'Flame',
    tier: 'bronze',
    check: ({ focusSessionsCount }) => focusSessionsCount >= 1
  },
  {
    id: 'tasks_10',
    title: 'Task Crusher',
    description: 'Complete 10 total tasks',
    xp: 150,
    icon: 'Trophy',
    tier: 'silver',
    check: ({ completedTasksCount }) => completedTasksCount >= 10
  },
  {
    id: 'streak_3',
    title: 'Momentum Builder',
    description: 'Maintain a 3-day study streak',
    xp: 100,
    icon: 'Zap',
    tier: 'bronze',
    check: ({ streak }) => streak >= 3
  },
  {
    id: 'streak_7',
    title: 'Unstoppable Habit',
    description: 'Reach a 7-day study streak',
    xp: 250,
    icon: 'Crown',
    tier: 'gold',
    check: ({ streak }) => streak >= 7
  },
  {
    id: 'hours_10',
    title: 'Scholar Level 1',
    description: 'Log 10 hours of focused study time',
    xp: 300,
    icon: 'Clock',
    tier: 'gold',
    check: ({ totalStudyMinutes }) => totalStudyMinutes >= 600
  },
  {
    id: 'planner_pro',
    title: 'Master Strategist',
    description: 'Schedule at least 5 study planner sessions',
    xp: 100,
    icon: 'Calendar',
    tier: 'bronze',
    check: ({ sessionsCount }) => sessionsCount >= 5
  },
  {
    id: 'exam_slayer',
    title: 'Deadline Champion',
    description: 'Mark 3 assignments or exams as completed',
    xp: 150,
    icon: 'Award',
    tier: 'silver',
    check: ({ completedAssignmentsCount }) => completedAssignmentsCount >= 3
  },
  {
    id: 'knowledge_vault',
    title: 'Note Collector',
    description: 'Write and organize 4 study notes',
    xp: 100,
    icon: 'BookOpen',
    tier: 'bronze',
    check: ({ notesCount }) => notesCount >= 4
  }
];

export const calculateLevel = (totalXP) => {
  // Level curve: Level = Math.floor(Math.sqrt(totalXP / 50)) + 1
  const level = Math.floor(Math.sqrt(totalXP / 50)) + 1;
  const currentLevelBaseXP = Math.pow(level - 1, 2) * 50;
  const nextLevelXP = Math.pow(level, 2) * 50;
  const progressInLevel = totalXP - currentLevelBaseXP;
  const neededForNext = nextLevelXP - currentLevelBaseXP;
  const percentage = Math.min(100, Math.round((progressInLevel / (neededForNext || 1)) * 100));

  return {
    level,
    totalXP,
    currentLevelBaseXP,
    nextLevelXP,
    progressInLevel,
    neededForNext,
    percentage
  };
};
