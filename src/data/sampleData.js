/**
 * High-quality realistic sample data for initial app launch
 */

const getISOOffsetDay = (dayOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_USER = {
  name: 'Alex Chen',
  avatarUrl: '',
  role: 'Computer Science & AI Major',
  dailyGoalHours: 4,
  streak: 5,
  lastActiveDate: getISOOffsetDay(0),
  totalXP: 450,
  level: 3
};

export const INITIAL_SETTINGS = {
  theme: 'light',
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  autoStartBreaks: false,
  dailyGoalMinutes: 240, // 4 hours
  studentName: 'Alex Chen',
  preferredSubjects: ['Algorithms', 'Data Science', 'Calculus', 'Web Development', 'Computer Systems']
};

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Implement Dijkstra shortest-path algorithm',
    description: 'Write adjacency list graph representation and priority queue solver in Python with unit tests.',
    subject: 'Algorithms',
    priority: 'High',
    status: 'In Progress',
    dueDate: getISOOffsetDay(0), // Today
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: null
  },
  {
    id: 'task-2',
    title: 'Review Fourier Transform practice problems',
    description: 'Complete problem set 4 questions 1 through 8 and check against lecture solution notes.',
    subject: 'Calculus',
    priority: 'High',
    status: 'Pending',
    dueDate: getISOOffsetDay(1), // Tomorrow
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedAt: null
  },
  {
    id: 'task-3',
    title: 'Train ResNet-18 model on CIFAR-10 subset',
    description: 'Run hyperparameter tuning sweeps for learning rate (0.01 vs 0.001) and plot accuracy curves.',
    subject: 'Data Science',
    priority: 'Medium',
    status: 'Pending',
    dueDate: getISOOffsetDay(3),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: null
  },
  {
    id: 'task-4',
    title: 'Read chapter 6: Virtual Memory & Page Tables',
    description: 'Annotate sections on TLB misses and multi-level paging mechanisms for upcoming quiz.',
    subject: 'Computer Systems',
    priority: 'Medium',
    status: 'Completed',
    dueDate: getISOOffsetDay(-1),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'task-5',
    title: 'Design relational schema for e-commerce project',
    description: 'Draft 3NF normalized tables for orders, order_items, users, and product catalog.',
    subject: 'Web Development',
    priority: 'Low',
    status: 'Completed',
    dueDate: getISOOffsetDay(-2),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'task-6',
    title: 'Submit peer feedback on distributed consensus draft',
    description: 'Review Maya and Liam’s Raft algorithm writeup in shared Google Doc.',
    subject: 'Computer Systems',
    priority: 'Low',
    status: 'Pending',
    dueDate: getISOOffsetDay(4),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: null
  }
];

export const INITIAL_SESSIONS = [
  {
    id: 'session-1',
    subject: 'Algorithms',
    title: 'Graph Theory & Dijkstra Debugging',
    date: getISOOffsetDay(0), // Today
    startTime: '09:30',
    endTime: '11:00',
    description: 'Code Dijkstra shortest path solver and review runtime complexity.',
    completed: true
  },
  {
    id: 'session-2',
    subject: 'Data Science',
    title: 'PyTorch Model Training & Loss Evaluation',
    date: getISOOffsetDay(0), // Today
    startTime: '14:00',
    endTime: '16:00',
    description: 'Experiment with dropout regularization and batch normalization layers.',
    completed: false
  },
  {
    id: 'session-3',
    subject: 'Calculus',
    title: 'Fourier Transforms & Series Exercises',
    date: getISOOffsetDay(0), // Today
    startTime: '17:00',
    endTime: '18:30',
    description: 'Work through problem set 4 exercises ahead of tomorrow’s recitation.',
    completed: false
  },
  {
    id: 'session-4',
    subject: 'Computer Systems',
    title: 'Cache & Memory Hierarchy Review',
    date: getISOOffsetDay(1), // Tomorrow
    startTime: '10:00',
    endTime: '12:00',
    description: 'Review cache line replacement policies (LRU, FIFO) and L1/L2 access times.',
    completed: false
  },
  {
    id: 'session-5',
    subject: 'Web Development',
    title: 'REST API & Authentication Middleware',
    date: getISOOffsetDay(2),
    startTime: '15:00',
    endTime: '17:00',
    description: 'Implement JWT verify middleware and rate limiting on API endpoints.',
    completed: false
  }
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'assign-1',
    title: 'Algorithms Midterm Exam',
    type: 'Exam',
    subject: 'Algorithms',
    description: 'Covers Divide & Conquer, Dynamic Programming, Greedy approaches, and Graph traversals. In-person Hall B.',
    dueDate: getISOOffsetDay(2),
    priority: 'High',
    completed: false
  },
  {
    id: 'assign-2',
    title: 'Machine Learning Project Milestone 2',
    type: 'Assignment',
    subject: 'Data Science',
    description: 'Submit baseline model training notebook, loss evaluation curves, and error analysis write-up on Gradescope.',
    dueDate: getISOOffsetDay(4),
    priority: 'High',
    completed: false
  },
  {
    id: 'assign-3',
    title: 'Calculus Quiz 3',
    type: 'Exam',
    subject: 'Calculus',
    description: 'Online 45-minute timed quiz covering contour integration and Laplace transforms.',
    dueDate: getISOOffsetDay(6),
    priority: 'Medium',
    completed: false
  },
  {
    id: 'assign-4',
    title: 'Full-Stack Web App Prototype',
    type: 'Assignment',
    subject: 'Web Development',
    description: 'Working CRUD backend with React frontend connected via REST endpoints.',
    dueDate: getISOOffsetDay(10),
    priority: 'Medium',
    completed: false
  },
  {
    id: 'assign-5',
    title: 'Operating Systems Lab 1: Threads',
    type: 'Assignment',
    subject: 'Computer Systems',
    description: 'POSIX pthread implementation of producer-consumer problem with mutex synchronization.',
    dueDate: getISOOffsetDay(-3),
    priority: 'High',
    completed: true
  }
];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Dijkstra vs A* Algorithm Core Distinctions',
    subject: 'Algorithms',
    pinned: true,
    content: `### Key Highlights:
- **Dijkstra** explores uniformly in all directions based on distance from start.
- **A* Search** guides traversal toward the target using a heuristic function $h(n)$.
- Admissibility: $h(n) \\le h^*(n)$ (never overestimates real cost).
- Consistency: $h(A) \\le c(A, B) + h(B)$. Guarantees optimal path without re-visiting nodes.`,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'note-2',
    title: 'Fourier Analysis Cheat Sheet',
    subject: 'Calculus',
    pinned: true,
    content: `### Fourier Series Formulas:
- $f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty [a_n \\cos(nx) + b_n \\sin(nx)]$
- $a_n = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x) \\cos(nx) dx$
- $b_n = \\frac{1}{\\pi} \\int_{-\\pi}^\\pi f(x) \\sin(nx) dx$

**Remember**: For odd functions, $a_n = 0$; for even functions, $b_n = 0$.`,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'note-3',
    title: 'Neural Network Optimizer Comparison',
    subject: 'Data Science',
    pinned: false,
    content: `### Optimizers:
1. **SGD + Momentum**: Escapes ravines, fast for convex surfaces.
2. **RMSProp**: Normalizes gradient by recent magnitude.
3. **Adam**: Combines momentum and RMSProp. Default standard choice (lr=1e-3).
4. **AdamW**: Decouples weight decay from gradient update. Critical for Transformers.`,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'note-4',
    title: 'Database Normalization & ACID Properties',
    subject: 'Web Development',
    pinned: false,
    content: `### The ACID Guarantee:
- **Atomicity**: All or nothing transaction execution.
- **Consistency**: Database invariants remain valid across commits.
- **Isolation**: Concurrent transactions do not produce dirty reads.
- **Durability**: Committed data survives system crashes.`,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString()
  }
];

export const INITIAL_POMODORO_HISTORY = [
  {
    id: 'pom-1',
    subject: 'Algorithms',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 4 - 3600000 * 2).toISOString()
  },
  {
    id: 'pom-2',
    subject: 'Algorithms',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 4 - 3600000 * 1).toISOString()
  },
  {
    id: 'pom-3',
    subject: 'Computer Systems',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 3 - 3600000 * 5).toISOString()
  },
  {
    id: 'pom-4',
    subject: 'Calculus',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 3 - 3600000 * 3).toISOString()
  },
  {
    id: 'pom-5',
    subject: 'Data Science',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 2 - 3600000 * 4).toISOString()
  },
  {
    id: 'pom-6',
    subject: 'Data Science',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 2 - 3600000 * 2).toISOString()
  },
  {
    id: 'pom-7',
    subject: 'Web Development',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 1 - 3600000 * 6).toISOString()
  },
  {
    id: 'pom-8',
    subject: 'Algorithms',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 1 - 3600000 * 4).toISOString()
  },
  {
    id: 'pom-9',
    subject: 'Calculus',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 86400000 * 1 - 3600000 * 2).toISOString()
  },
  {
    id: 'pom-10',
    subject: 'Algorithms',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString() // Today
  },
  {
    id: 'pom-11',
    subject: 'Data Science',
    durationMinutes: 25,
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString() // Today
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'focus_completed',
    title: 'Completed 25m Focus Session',
    detail: 'Subject: Data Science',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'act-2',
    type: 'task_completed',
    title: 'Finished Task',
    detail: 'Read chapter 6: Virtual Memory & Page Tables',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'act-3',
    type: 'badge_unlocked',
    title: 'Unlocked Achievement: Deep Diver',
    detail: '+50 XP earned',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'act-4',
    type: 'session_scheduled',
    title: 'Planned Study Session',
    detail: 'Graph Theory & Dijkstra Debugging (Algorithms)',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_ACHIEVEMENTS_UNLOCKED = [
  { id: 'first_task', unlockedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'first_focus', unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'streak_3', unlockedAt: new Date(Date.now() - 86400000 * 1).toISOString() }
];
