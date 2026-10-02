import { DEFAULT_HABITS } from '../data/initialData';

const STORAGE_KEYS = {
  HABITS: 'winter_arc_habits_v1',
  LOGS: 'winter_arc_logs_v1',
  METRICS: 'winter_arc_metrics_v1',
  SETTINGS: 'winter_arc_settings_v1'
};

export const ARC_CONFIG = {
  START_DATE: '2026-10-01',
  END_DATE: '2027-01-01',
  TOTAL_DAYS: 92
};

export function formatDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Calculate Arc day number (e.g., Day 2 of 92)
export function getArcDayNumber(dateStr = formatDateKey()) {
  const start = new Date(ARC_CONFIG.START_DATE);
  const current = parseDateKey(dateStr);
  const diffTime = current - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

// Generate the array of all 92 days of the Winter Arc for heatmap
export function getAllArcDates() {
  const dates = [];
  const start = new Date(ARC_CONFIG.START_DATE);
  const end = new Date(ARC_CONFIG.END_DATE);
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDateKey(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export function getStoredHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (raw) {
      const stored = JSON.parse(raw);
      // Merge updated DEFAULT_HABITS with stored state so code updates take effect
      const defaultMap = new Map(DEFAULT_HABITS.map(h => [h.id, h]));
      const mergedDefaults = DEFAULT_HABITS.map(dh => {
        const existing = stored.find(s => s.id === dh.id);
        return existing ? { ...dh, ...existing, name: dh.name, description: dh.description, targetValue: dh.targetValue, unit: dh.unit, category: dh.category, isNonNegotiable: dh.isNonNegotiable } : dh;
      });
      // Keep any user-created custom habits (id starting with habit-17... or not in defaults)
      const customHabits = stored.filter(s => !defaultMap.has(s.id));
      return [...mergedDefaults, ...customHabits];
    }
  } catch (e) {
    console.error('Failed to load habits', e);
  }
  return DEFAULT_HABITS;
}

export function saveStoredHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits', e);
  }
}

export function getStoredLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load logs', e);
  }
  // Initialize with Day 1 sample checkmarks if brand new
  const initial = {};
  const day1Key = ARC_CONFIG.START_DATE;
  initial[day1Key] = {
    'habit-1': true,
    'habit-2': true,
    'habit-3': true,
    'habit-4': true,
    'habit-5': true,
    'habit-6': true,
    'habit-7': true,
    'habit-8': true
  };
  return initial;
}

export function saveStoredLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}

export function getStoredMetrics() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.METRICS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load metrics', e);
  }
  return {};
}

export function saveStoredMetrics(metrics) {
  try {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  } catch (e) {
    console.error('Failed to save metrics', e);
  }
}

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return {
    ghostMode: false,
    soundFx: true,
    winterAmbience: false,
    userName: 'Discipline Warrior',
    targetHoursSleep: 8,
    targetWaterLiters: 3.8
  };
}

export function saveStoredSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

// Calculate comprehensive analytics stats
export function calculateArcStats(habits = [], logs = {}) {
  const allDates = getAllArcDates();
  const todayKey = formatDateKey();
  const todayIdx = allDates.indexOf(todayKey);
  
  // Tracked days are arc days up to today (or past days recorded)
  const activeDates = allDates.filter(d => d <= todayKey || (logs[d] && Object.keys(logs[d]).length > 0));
  
  let flawlessDays = 0;
  let totalHabitSlots = 0;
  let totalHabitsCompleted = 0;
  let nonNegotiableSlots = 0;
  let nonNegotiableCompleted = 0;

  const categoryStats = {
    physical: { total: 0, completed: 0 },
    mind: { total: 0, completed: 0 },
    sleep: { total: 0, completed: 0 },
    discipline: { total: 0, completed: 0 },
    nutrition: { total: 0, completed: 0 }
  };

  const dailyPercentages = {};

  activeDates.forEach(dateKey => {
    const dayLog = logs[dateKey] || {};
    let dayTotal = habits.length;
    let dayDone = 0;
    let dayNonNegTotal = 0;
    let dayNonNegDone = 0;

    habits.forEach(h => {
      const isDone = !!dayLog[h.id];
      if (isDone) {
        dayDone++;
        totalHabitsCompleted++;
      }
      totalHabitSlots++;

      if (h.isNonNegotiable) {
        dayNonNegTotal++;
        nonNegotiableSlots++;
        if (isDone) {
          dayNonNegDone++;
          nonNegotiableCompleted++;
        }
      }

      if (categoryStats[h.category]) {
        categoryStats[h.category].total++;
        if (isDone) categoryStats[h.category].completed++;
      }
    });

    const pct = dayTotal > 0 ? Math.round((dayDone / dayTotal) * 100) : 0;
    dailyPercentages[dateKey] = pct;

    if (dayTotal > 0 && dayDone === dayTotal) {
      flawlessDays++;
    }
  });

  // Calculate Streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Iterate chronologically to find streaks
  // A streak day is counted if completion >= 70% or all non-negotiables met
  allDates.forEach(dateKey => {
    const dayLog = logs[dateKey] || {};
    const dayTotal = habits.length;
    let dayDone = 0;
    habits.forEach(h => {
      if (dayLog[h.id]) dayDone++;
    });

    const isSuccess = dayTotal > 0 && (dayDone / dayTotal) >= 0.7;

    if (isSuccess) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      // If date is in future, don't break current streak yet
      if (dateKey <= todayKey) {
        tempStreak = 0;
      }
    }
  });

  // Current streak counting backwards from today or yesterday
  let checkDate = parseDateKey(todayKey);
  const todayLog = logs[todayKey] || {};
  let todayDone = 0;
  habits.forEach(h => { if (todayLog[h.id]) todayDone++; });
  const todaySuccess = habits.length > 0 && (todayDone / habits.length) >= 0.7;

  if (todaySuccess) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Check if yesterday succeeded
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const k = formatDateKey(checkDate);
    if (!logs[k]) break;
    let dDone = 0;
    habits.forEach(h => { if (logs[k][h.id]) dDone++; });
    if (habits.length > 0 && (dDone / habits.length) >= 0.7) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const overallCompletionRate = totalHabitSlots > 0
    ? Math.round((totalHabitsCompleted / totalHabitSlots) * 100)
    : 0;

  const currentArcDay = Math.max(1, Math.min(ARC_CONFIG.TOTAL_DAYS, getArcDayNumber(todayKey)));
  const daysRemaining = Math.max(0, ARC_CONFIG.TOTAL_DAYS - currentArcDay);
  const arcProgressPct = Math.round((currentArcDay / ARC_CONFIG.TOTAL_DAYS) * 100);

  return {
    currentArcDay,
    totalArcDays: ARC_CONFIG.TOTAL_DAYS,
    daysRemaining,
    arcProgressPct,
    currentStreak,
    longestStreak,
    flawlessDays,
    totalHabitsCompleted,
    overallCompletionRate,
    nonNegotiableCompletionRate: nonNegotiableSlots > 0 ? Math.round((nonNegotiableCompleted / nonNegotiableSlots) * 100) : 0,
    categoryStats,
    dailyPercentages,
    daysTracked: activeDates.length
  };
}

// Generate rich mock history for quick demo testing
export function generateDemoArcData(habits) {
  const newLogs = {};
  const newMetrics = {};
  const allDates = getAllArcDates();
  const todayKey = formatDateKey();
  
  // Fill up to today (or at least 14 days for rich charts)
  const daysToSimulate = Math.max(12, getArcDayNumber(todayKey));
  
  for (let i = 0; i < Math.min(daysToSimulate, allDates.length); i++) {
    const dKey = allDates[i];
    newLogs[dKey] = {};

    // 85% chance of completing each habit to simulate a disciplined user
    habits.forEach(h => {
      const isWeekend = (i % 7 === 5 || i % 7 === 6);
      const passRate = h.isNonNegotiable ? 0.92 : (isWeekend ? 0.75 : 0.85);
      if (Math.random() < passRate) {
        newLogs[dKey][h.id] = true;
      }
    });

    newMetrics[dKey] = {
      sleepHours: +(7.0 + Math.random() * 1.5).toFixed(1),
      waterLiters: +(3.2 + Math.random() * 0.8).toFixed(1),
      pagesRead: Math.floor(10 + Math.random() * 15),
      workoutMin: Math.floor(55 + Math.random() * 30),
      notes: i % 3 === 0 ? "Mental clarity sharp. The cold fuels focus." : ""
    };
  }

  saveStoredLogs(newLogs);
  saveStoredMetrics(newMetrics);
  return { logs: newLogs, metrics: newMetrics };
}
