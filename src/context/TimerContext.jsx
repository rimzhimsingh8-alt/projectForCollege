import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useApp } from './AppContext';
import { storage } from '../utils/storage';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const { settings, logFocusSession } = useApp();

  // Mode: 'work' | 'shortBreak' | 'longBreak'
  const [mode, setMode] = useState('work');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(settings?.preferredSubjects?.[0] || 'General Study');

  const getDurationForMode = (m) => {
    if (m === 'work') return (settings?.workDuration || 25) * 60;
    if (m === 'shortBreak') return (settings?.shortBreakDuration || 5) * 60;
    if (m === 'longBreak') return (settings?.longBreakDuration || 15) * 60;
    return 25 * 60;
  };

  const [timeLeft, setTimeLeft] = useState(() => getDurationForMode('work'));
  const [targetEndTime, setTargetEndTime] = useState(null);

  // Sync duration if user changes settings while timer is idle
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getDurationForMode(mode));
    }
  }, [settings?.workDuration, settings?.shortBreakDuration, settings?.longBreakDuration, mode]);

  // Main countdown engine using high-accuracy timestamp calculation
  useEffect(() => {
    let interval = null;

    if (isRunning && targetEndTime) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.round((targetEndTime - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          setIsRunning(false);
          setTargetEndTime(null);

          // Handle session completion
          if (mode === 'work') {
            const duration = settings?.workDuration || 25;
            logFocusSession({
              subject: selectedSubject,
              durationMinutes: duration,
              mode: 'work'
            });

            // Automatically switch to short or long break
            setMode('shortBreak');
            setTimeLeft(getDurationForMode('shortBreak'));
          } else {
            // Break is over
            setMode('work');
            setTimeLeft(getDurationForMode('work'));
          }
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, targetEndTime, mode, selectedSubject, settings, logFocusSession]);

  const startTimer = () => {
    const end = Date.now() + timeLeft * 1000;
    setTargetEndTime(end);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setTargetEndTime(null);
  };

  const resetTimer = (newMode = mode) => {
    setIsRunning(false);
    setTargetEndTime(null);
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  };

  const switchMode = (newMode) => {
    resetTimer(newMode);
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = getDurationForMode(mode);
  const progressPercent = Math.min(100, Math.round(((totalSeconds - timeLeft) / (totalSeconds || 1)) * 100));

  return (
    <TimerContext.Provider
      value={{
        mode,
        timeLeft,
        formattedTime,
        isRunning,
        selectedSubject,
        setSelectedSubject,
        startTimer,
        pauseTimer,
        resetTimer,
        switchMode,
        progressPercent,
        totalSeconds
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
