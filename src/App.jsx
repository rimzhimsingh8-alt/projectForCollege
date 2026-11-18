import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { TimerProvider } from './context/TimerContext';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Planner } from './pages/Planner';
import { Pomodoro } from './pages/Pomodoro';
import { AssignmentsExams } from './pages/AssignmentsExams';
import { Notes } from './pages/Notes';
import { Analytics } from './pages/Analytics';
import { Achievements } from './pages/Achievements';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <TimerProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="planner" element={<Planner />} />
                <Route path="pomodoro" element={<Pomodoro />} />
                <Route path="assignments" element={<AssignmentsExams />} />
                <Route path="notes" element={<Notes />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="achievements" element={<Achievements />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TimerProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
