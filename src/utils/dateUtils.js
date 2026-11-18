/**
 * Date and time helper utilities
 */

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  // Check if it's "HH:MM"
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  }
  return timeString;
};

export const getRelativeDays = (targetDateStr) => {
  if (!targetDateStr) return { label: '', status: 'neutral', days: 0 };
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Overdue by ${Math.abs(diffDays)}d`,
      status: 'overdue',
      days: diffDays
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due Today',
      status: 'today',
      days: 0
    };
  } else if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      status: 'tomorrow',
      days: 1
    };
  } else {
    return {
      label: `In ${diffDays} days`,
      status: 'upcoming',
      days: diffDays
    };
  }
};

export const formatDuration = (totalMinutes) => {
  if (!totalMinutes || totalMinutes <= 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
};

export const getDayName = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getWeekDates = (baseDate = new Date()) => {
  const curr = new Date(baseDate);
  const first = curr.getDate() - curr.getDay() + 1; // Monday as day 1
  const week = [];
  for (let i = 0; i < 7; i++) {
    const next = new Date(curr.setDate(first + i));
    week.push({
      dateStr: next.toISOString().split('T')[0],
      dayName: next.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: next.getDate(),
      fullDate: next
    });
  }
  return week;
};

// Check if two sessions on the same date/day overlap
export const checkTimeOverlap = (start1, end1, start2, end2) => {
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };
  const s1 = toMinutes(start1);
  const e1 = toMinutes(end1);
  const s2 = toMinutes(start2);
  const e2 = toMinutes(end2);

  return Math.max(s1, s2) < Math.min(e1, e2);
};
