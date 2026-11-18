# StudyFlow – Smart Student Productivity Dashboard

> A commercial-grade, full-stack student productivity web platform built with React, Vite, Tailwind CSS, Lucide React, and Recharts.

---

## 🌟 Overview

**StudyFlow** is an all-in-one productivity operating system designed for modern students, researchers, and self-directed learners. Inspired by modern SaaS tools like Linear and Notion, StudyFlow combines intuitive task organization, collision-preventing calendar planning, an ultra-accurate persistent Pomodoro timer, gamified achievements & streaks, deep productivity analytics, and an intelligent rule-based study assistant.

All data persists locally in the browser via `LocalStorage` with zero required external dependencies or paid API keys.

---

## 🚀 Key Features

### 1. 📊 Executive Dashboard
- **Live Academic Metrics**: Track total tasks, completion rates, daily study hours, active study streaks, and XP levels.
- **Dynamic Weekly Recharts Chart**: Interactive bar chart displaying daily focus hours logged over the past 7 days.
- **Real-Time Synchronized Agenda**: Shows today's scheduled study blocks and upcoming exam/assignment countdowns.
- **Quick Actions**: One-click jump to start focus sessions or query the AI assistant.

### 2. 📝 Task Management
- **Full CRUD Capabilities**: Create, edit, delete, and mark tasks as completed.
- **Rich Metadata**: Categorize by academic subject, priority (`High`, `Medium`, `Low`), status (`Pending`, `In Progress`, `Completed`), and due date.
- **Filter, Search & Sort**: Search instantaneously across titles and descriptions; filter by subject, status, or priority; sort by due date or urgency.
- **Dual Layouts**: Seamless toggle between a responsive card grid and a dense spreadsheet-style data table.
- **Gamified Rewards**: Earn **+25 XP** with celebratory sound effects and confetti upon task completion.

### 3. 📅 Study Planner & Overlap Collision Detector
- **Daily & Weekly Timetable Views**: Organize study blocks with start/end times and actionable learning objectives.
- **Intelligent Overlap Detection**: Warns and prevents time collisions if two sessions are scheduled at conflicting hours.
- **Week-at-a-Glance**: 7-day schedule grid highlighting today's date and session distributions.

### 4. ⏱️ Persistent Pomodoro Focus Timer
- **Multi-Mode Intervals**: 25-minute focus, 5-minute short break, and 15-minute long break (customizable via Settings).
- **Accurate Timestamp Calculation**: Timer stays mathematically exact across page navigation and background tab throttling.
- **Automatic Session Logging**: Completed focus intervals automatically increment session counters, log to history, award **+50 XP**, and stream into analytics.
- **Zero-Dependency Procedural Audio**: Synthetic chimes generated via the browser's Web Audio API (no missing audio assets or broken network requests).

### 5. 🎓 Assignments & Exam Tracker
- **Deadlines & Assessment Monitor**: Track projects, quizzes, midterms, and final exams.
- **Smart Relative Countdowns**: Visual badges displaying "Due Today", "Due Tomorrow", "In X days", or "Overdue by Xd".
- **Priority & Status Filters**: Filter by assessment type and status to prevent deadline surprises.

### 6. 💡 Quick Notes & Concept Repository
- **Organized Knowledge Base**: Tag notes by course subject and format formulas, proofs, and summaries.
- **Pinning Mechanism**: Pin vital cheat sheets and high-priority revision notes to the top of the board.
- **Instant Search**: Rapid search filter across titles and note contents.

### 7. 📈 Productivity Analytics (Powered by Recharts)
- **True Application Data**: Visualizations dynamically re-calculate from actual user tasks and logged Pomodoros.
- **Weekly Focus Hours**: Interactive bar chart with custom hover tooltips.
- **Subject-Wise Distribution**: Donut pie chart demonstrating course study time allocation.
- **14-Day Consistency Trend**: Area chart mapping long-term daily academic momentum.

### 8. 🏆 Gamification, XP & Badges
- **Daily Study Streaks**: Tracks consecutive active study days with automatic streak preservation logic.
- **Non-Linear Leveling Curve**: XP earned from tasks, focus cycles, and milestones levels up your scholar rank.
- **Achievement Badges**:
  - *First Step* (Complete first task)
  - *Deep Diver* (Complete first Pomodoro)
  - *Task Crusher* (Complete 10 tasks)
  - *Momentum Builder* (3-day streak)
  - *Unstoppable Habit* (7-day streak)
  - *Scholar Level 1* (10 study hours)
  - *Master Strategist* (Schedule 5 planner blocks)
  - *Deadline Champion* (Complete 3 assessments)
  - *Note Collector* (Write 4 quick notes)

### 9. 🧠 AI Study Assistant & Planner
- **Daily Timetable Generator**: Input available study hours (1–8 hrs) and select subjects -> generates a realistic schedule with balanced Pomodoro intervals and 1-click import into Study Planner.
- **Task Breakdown Engine**: Enter complex tasks (e.g., "Build ML classification pipeline" or "Prepare for Algorithms exam") -> decomposes them into 5 concrete steps with estimated minutes and 1-click import to My Tasks.
- **Prioritization Advisor**: Analyzes overdue tasks, high-priority flags, and impending exams to rank top 3 recommended actions.
- **Spaced Repetition Protocol**: Ebbinghaus-inspired revision intervals (1-day, 3-day, 7-day).
- *Modular Architecture*: Cleanly separated to swap in Google Gemini or OpenAI API when ready.

### 10. ⚙️ Settings & Customization
- **Theme Switcher**: Seamless dark and light mode toggle with class-based Tailwind persistence.
- **Timer Customization**: Adjust default focus, short break, and long break durations.
- **Course Catalog Management**: Add or remove custom subjects.
- **Local Data Reset**: One-click restore of showcase sample data or complete wipe with confirmation dialogs.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI component architecture and state management |
| **Vite 5** | High-speed frontend bundling and HMR dev server |
| **Tailwind CSS 3** | Utility-first responsive SaaS styling with Dark Mode |
| **React Router 6** | Client-side page navigation with nested layout routing |
| **Recharts 2** | Composable, responsive SVG analytics charts |
| **Lucide React** | Professional, modern iconography |
| **Canvas Confetti** | Reward celebration effects |
| **Web Audio API** | Zero-latency procedural notification chimes |
| **LocalStorage** | Persistent, offline-first client storage |

---

## 📂 Project Structure

```
studyflow/
├── dist/                      # Production build output
├── node_modules/              # Dependencies
├── public/                    # Static public assets
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx          # Priority, status, and subject badges
│   │   │   ├── ConfirmModal.jsx   # Accessible confirmation dialog
│   │   │   ├── EmptyState.jsx     # Friendly zero-data placeholder
│   │   │   ├── Modal.jsx          # Accessible dialog with ESC / backdrop dismiss
│   │   │   ├── ProgressBar.jsx    # Animated metric progress indicator
│   │   │   ├── SearchModal.jsx    # Global Cmd+K quick search across all entities
│   │   │   ├── StatCard.jsx       # SaaS metric card with trend indicators
│   │   │   └── Toast.jsx          # Notification toasts (success, error, info)
│   │   └── layout/
│   │       ├── AppLayout.jsx      # Master layout: Sidebar + Topbar + Content
│   │       ├── Sidebar.jsx        # Collapsible navigation with badge counters & XP bar
│   │       └── Topbar.jsx         # Date, Cmd+K search, active timer pill, theme toggle
│   ├── context/
│   │   ├── AppContext.jsx         # Core app state, LocalStorage sync, activities & XP engine
│   │   ├── ThemeContext.jsx       # Light/Dark mode state and DOM class synchronization
│   │   └── TimerContext.jsx       # Accurate persistent Pomodoro timer engine
│   ├── data/
│   │   ├── achievementsList.js    # Badges, XP thresholds, level mathematical curve
│   │   └── sampleData.js          # Realistic demo dataset for first launch
│   ├── pages/
│   │   ├── Achievements.jsx       # Gamified achievements and level progression
│   │   ├── AIAssistant.jsx        # Intelligent rule-based scheduler & task breakdown
│   │   ├── Analytics.jsx          # Charts for study hours, subjects, and consistency
│   │   ├── AssignmentsExams.jsx   # Deadlines, exams, and countdown tracker
│   │   ├── Dashboard.jsx          # Executive overview & weekly analytics
│   │   ├── Notes.jsx              # Quick notes with pinned cards and search
│   │   ├── Planner.jsx            # Day & Week timetable with collision prevention
│   │   ├── Pomodoro.jsx           # Focus timer with radial ring and session log
│   │   ├── Settings.jsx           # Preferences, timer lengths, and data management
│   │   └── Tasks.jsx              # Card grid / Table task manager with filters
│   ├── utils/
│   │   ├── confetti.js            # Particle celebratory animations
│   │   ├── dateUtils.js           # Date formatting, countdowns & overlap logic
│   │   ├── sound.js               # Web Audio API synthetic notification chimes
│   │   └── storage.js             # Safe JSON LocalStorage wrapper
│   ├── App.jsx                    # Router configuration and context providers
│   ├── index.css                  # Tailwind styles and custom scrollbar
│   └── main.jsx                   # React root entry point
├── index.html                     # HTML template with Google Fonts (Inter, Plus Jakarta Sans)
├── package.json                   # Project configuration and script commands
├── postcss.config.js              # PostCSS configuration for Tailwind
├── tailwind.config.js             # Tailwind CSS palette and extensions
└── vite.config.js                 # Vite bundler configuration with manual code splitting
```

---

## 💻 Commands to Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized, code-split production build in the `dist/` directory.

### 4. Preview the Production Build Locally
```bash
npm run preview
```

---

## 🧪 Verification & Testing Completed

- [x] **Production Build**: Built in 8.69s with zero errors and clean manual chunking (`dist/assets/vendor-react-*.js`, `vendor-charts-*.js`, `vendor-icons-*.js`).
- [x] **Navigation & Routing**: Tested all 10 distinct routes (`/`, `/tasks`, `/planner`, `/pomodoro`, `/assignments`, `/notes`, `/analytics`, `/achievements`, `/ai-assistant`, `/settings`) with 404 wildcard fallback.
- [x] **Data Persistence**: Verified LocalStorage synchronization across tasks, notes, planner sessions, assignments, user XP/streak, and custom settings.
- [x] **Timer Continuity**: Focus timer continues tracking accurately even when switching between pages.
- [x] **Theme Persistence**: Light and Dark mode toggle persists across reloads.
- [x] **Collision Detection**: Planner validates start/end times and prevents overlapping study blocks.
- [x] **Real-time Analytics**: Recharts charts dynamically adapt to added tasks and logged study sessions.
