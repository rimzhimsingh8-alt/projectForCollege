import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { storage } from '../utils/storage';
import {
  INITIAL_USER,
  INITIAL_SETTINGS,
  INITIAL_TASKS,
  INITIAL_SESSIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTES,
  INITIAL_POMODORO_HISTORY,
  INITIAL_ACTIVITIES,
  INITIAL_ACHIEVEMENTS_UNLOCKED
} from '../data/sampleData';
import { ACHIEVEMENTS, calculateLevel } from '../data/achievementsList';
import { sounds } from '../utils/sound';
import { triggerCelebration, triggerConfetti } from '../utils/confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Core States with safe LocalStorage initialization
  const [tasks, setTasks] = useState(() => storage.get('tasks', INITIAL_TASKS));
  const [sessions, setSessions] = useState(() => storage.get('sessions', INITIAL_SESSIONS));
  const [assignments, setAssignments] = useState(() => storage.get('assignments', INITIAL_ASSIGNMENTS));
  const [notes, setNotes] = useState(() => storage.get('notes', INITIAL_NOTES));
  const [pomodoroHistory, setPomodoroHistory] = useState(() => storage.get('pomodoro_history', INITIAL_POMODORO_HISTORY));
  const [user, setUser] = useState(() => storage.get('user', INITIAL_USER));
  const [settings, setSettings] = useState(() => storage.get('settings', INITIAL_SETTINGS));
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => storage.get('achievements', INITIAL_ACHIEVEMENTS_UNLOCKED));
  const [activities, setActivities] = useState(() => storage.get('activities', INITIAL_ACTIVITIES));
  
  // 2. Toast notification system
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync state to LocalStorage
  useEffect(() => { storage.set('tasks', tasks); }, [tasks]);
  useEffect(() => { storage.set('sessions', sessions); }, [sessions]);
  useEffect(() => { storage.set('assignments', assignments); }, [assignments]);
  useEffect(() => { storage.set('notes', notes); }, [notes]);
  useEffect(() => { storage.set('pomodoro_history', pomodoroHistory); }, [pomodoroHistory]);
  useEffect(() => { storage.set('user', user); }, [user]);
  useEffect(() => { storage.set('settings', settings); }, [settings]);
  useEffect(() => { storage.set('achievements', unlockedAchievements); }, [unlockedAchievements]);
  useEffect(() => { storage.set('activities', activities); }, [activities]);

  // Log activity helper
  const logActivity = useCallback((type, title, detail) => {
    const newAct = {
      id: 'act-' + Date.now(),
      type,
      title,
      detail,
      timestamp: new Date().toISOString()
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 49)]); // keep recent 50
  }, []);

  // Add XP helper with level-up detection
  const addXP = useCallback((amount, reason) => {
    setUser((prev) => {
      const oldLevelInfo = calculateLevel(prev.totalXP || 0);
      const newTotal = (prev.totalXP || 0) + amount;
      const newLevelInfo = calculateLevel(newTotal);

      if (newLevelInfo.level > oldLevelInfo.level) {
        // Leveled up!
        sounds.playAchievementFanfare();
        triggerCelebration();
        showToast(`Congratulations! You reached Level ${newLevelInfo.level}!`, 'success', 'Level Up!');
        logActivity('level_up', `Reached Level ${newLevelInfo.level}`, `Total XP: ${newTotal}`);
      }

      return {
        ...prev,
        totalXP: newTotal,
        level: newLevelInfo.level
      };
    });
  }, [logActivity, showToast]);

  // Streak verification on mount and actions
  const checkDailyStreak = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setUser((prev) => {
      const lastDate = prev.lastActiveDate;
      if (lastDate === todayStr) {
        return prev; // already active today
      }

      const today = new Date(todayStr);
      const last = lastDate ? new Date(lastDate) : null;
      let newStreak = prev.streak || 0;

      if (!last) {
        newStreak = 1;
      } else {
        const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1; // streak preserved!
          showToast(`Streak continued! You're on a ${newStreak}-day streak! 🔥`, 'success', 'Daily Streak');
        } else if (diffDays > 1) {
          newStreak = 1; // reset streak
        }
      }

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: todayStr
      };
    });
  }, [showToast]);

  useEffect(() => {
    checkDailyStreak();
  }, [checkDailyStreak]);

  // Achievement Check Engine
  const checkAchievements = useCallback(() => {
    const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
    const focusSessionsCount = pomodoroHistory.length;
    const totalStudyMinutes = pomodoroHistory.reduce((acc, p) => acc + (p.durationMinutes || 25), 0);
    const completedAssignmentsCount = assignments.filter((a) => a.completed).length;
    const sessionsCount = sessions.length;
    const notesCount = notes.length;
    const streak = user.streak || 0;

    const stats = {
      completedTasksCount,
      focusSessionsCount,
      totalStudyMinutes,
      completedAssignmentsCount,
      sessionsCount,
      notesCount,
      streak
    };

    const unlockedIds = new Set(unlockedAchievements.map((a) => a.id));

    ACHIEVEMENTS.forEach((ach) => {
      if (!unlockedIds.has(ach.id) && ach.check(stats)) {
        // Unlock new badge!
        const newUnlockedItem = {
          id: ach.id,
          unlockedAt: new Date().toISOString()
        };
        setUnlockedAchievements((prev) => [...prev, newUnlockedItem]);
        sounds.playAchievementFanfare();
        triggerCelebration();
        addXP(ach.xp, `Unlocked ${ach.title}`);
        showToast(`Unlocked: "${ach.title}" (+${ach.xp} XP)`, 'success', 'Achievement Unlocked!');
        logActivity('badge_unlocked', `Badge Unlocked: ${ach.title}`, `+${ach.xp} XP awarded`);
      }
    });
  }, [tasks, pomodoroHistory, assignments, sessions, notes, user.streak, unlockedAchievements, addXP, logActivity, showToast]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  // Task Actions
  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity('task_created', `Added Task: ${newTask.title}`, `Priority: ${newTask.priority} | Subject: ${newTask.subject}`);
    showToast('Task added successfully', 'success');
  };

  const updateTask = (id, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const wasCompleted = t.status === 'Completed';
          const isNowCompleted = updatedFields.status === 'Completed';
          
          if (!wasCompleted && isNowCompleted) {
            sounds.playTaskComplete();
            triggerConfetti();
            addXP(25, `Completed task: ${t.title}`);
            logActivity('task_completed', `Completed: ${t.title}`, '+25 XP earned');
            showToast('Task completed! +25 XP', 'success');
          }

          return {
            ...t,
            ...updatedFields,
            completedAt: isNowCompleted ? (t.completedAt || new Date().toISOString()) : null
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (taskToDelete) {
      logActivity('task_deleted', `Deleted task: ${taskToDelete.title}`);
    }
    showToast('Task deleted', 'info');
  };

  const toggleTaskStatus = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    updateTask(id, { status: newStatus });
  };

  // Study Planner Session Actions
  const addSession = (sessionData) => {
    const newSession = {
      ...sessionData,
      id: 'session-' + Date.now(),
      completed: false
    };
    setSessions((prev) => [...prev, newSession]);
    logActivity('session_scheduled', `Scheduled: ${newSession.title}`, `${newSession.startTime} - ${newSession.endTime} (${newSession.subject})`);
    showToast('Study session planned', 'success');
  };

  const updateSession = (id, updatedFields) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    showToast('Session updated', 'info');
  };

  const deleteSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast('Session removed', 'info');
  };

  const toggleSessionCompleted = (id) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const isCompleted = !s.completed;
          if (isCompleted) {
            sounds.playTaskComplete();
            addXP(30, `Completed study session: ${s.title}`);
            showToast('Session completed! +30 XP', 'success');
          }
          return { ...s, completed: isCompleted };
        }
        return s;
      })
    );
  };

  // Assignment & Exam Actions
  const addAssignment = (data) => {
    const newAssign = {
      ...data,
      id: 'assign-' + Date.now(),
      completed: false
    };
    setAssignments((prev) => [newAssign, ...prev]);
    logActivity('assignment_created', `Added ${newAssign.type}: ${newAssign.title}`, `Due: ${newAssign.dueDate}`);
    showToast(`${newAssign.type} added`, 'success');
  };

  const updateAssignment = (id, updatedFields) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const wasCompleted = a.completed;
          const isNowCompleted = updatedFields.completed;
          if (!wasCompleted && isNowCompleted) {
            sounds.playTaskComplete();
            triggerConfetti();
            addXP(50, `Completed ${a.type}: ${a.title}`);
            showToast(`${a.type} completed! +50 XP`, 'success');
          }
          return { ...a, ...updatedFields };
        }
        return a;
      })
    );
  };

  const deleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    showToast('Item deleted', 'info');
  };

  const toggleAssignmentCompleted = (id) => {
    const item = assignments.find((a) => a.id === id);
    if (!item) return;
    updateAssignment(id, { completed: !item.completed });
  };

  // Quick Notes Actions
  const addNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: 'note-' + Date.now(),
      pinned: noteData.pinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes((prev) => [newNote, ...prev]);
    logActivity('note_created', `Created Note: ${newNote.title}`, `Subject: ${newNote.subject}`);
    showToast('Note created', 'success');
  };

  const updateNote = (id, updatedFields) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...updatedFields, updatedAt: new Date().toISOString() }
          : n
      )
    );
    showToast('Note saved', 'info');
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note deleted', 'info');
  };

  const toggleNotePinned = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Focus Sessions / Pomodoro logging
  const logFocusSession = (session) => {
    const newEntry = {
      ...session,
      id: 'pom-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setPomodoroHistory((prev) => [newEntry, ...prev]);
    sounds.playTimerComplete();
    triggerConfetti();
    addXP(50, `Completed focus session on ${session.subject}`);
    logActivity('focus_completed', `Completed ${session.durationMinutes}m Focus Session`, `Subject: ${session.subject}`);
    showToast(`Focus session completed! +50 XP`, 'success', 'Session Complete');
  };

  // Reset / Clear Data Actions
  const resetToSampleData = () => {
    storage.clearAll();
    setTasks(INITIAL_TASKS);
    setSessions(INITIAL_SESSIONS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setNotes(INITIAL_NOTES);
    setPomodoroHistory(INITIAL_POMODORO_HISTORY);
    setUser(INITIAL_USER);
    setSettings(INITIAL_SETTINGS);
    setUnlockedAchievements(INITIAL_ACHIEVEMENTS_UNLOCKED);
    setActivities(INITIAL_ACTIVITIES);
    showToast('Sample data restored successfully', 'success');
  };

  const clearAllData = () => {
    storage.clearAll();
    setTasks([]);
    setSessions([]);
    setAssignments([]);
    setNotes([]);
    setPomodoroHistory([]);
    setUser({
      name: 'Student',
      role: 'Student',
      dailyGoalHours: 3,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalXP: 0,
      level: 1
    });
    setUnlockedAchievements([]);
    setActivities([]);
    showToast('All application data has been cleared', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,

        sessions,
        addSession,
        updateSession,
        deleteSession,
        toggleSessionCompleted,

        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentCompleted,

        notes,
        addNote,
        updateNote,
        deleteNote,
        toggleNotePinned,

        pomodoroHistory,
        logFocusSession,

        user,
        setUser,
        addXP,

        settings,
        setSettings,

        unlockedAchievements,
        activities,

        toasts,
        showToast,
        removeToast,

        resetToSampleData,
        clearAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
