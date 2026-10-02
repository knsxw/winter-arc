import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  Plus, 
  Flame, 
  Trash2, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  Dumbbell,
  Brain,
  Moon,
  ShieldAlert,
  Sparkles,
  Info,
  Clock,
  BookOpen,
  Droplet
} from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { formatDateKey, parseDateKey, getArcDayNumber } from '../utils/storage';
import { playHabitTick, playArcCompleteChime } from '../utils/sound';

export default function DailyTracker({
  habits,
  setHabits,
  logs,
  setLogs,
  metrics,
  setMetrics,
  selectedDate,
  setSelectedDate,
  soundFx
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDesc, setNewHabitDesc] = useState('');
  const [newHabitCat, setNewHabitCat] = useState('physical');
  const [newHabitNonNeg, setNewHabitNonNeg] = useState(true);

  const todayKey = formatDateKey();
  const currentArcDay = getArcDayNumber(selectedDate);
  const dayLogs = logs[selectedDate] || {};
  const dayMetrics = metrics[selectedDate] || {
    sleepHours: '',
    waterLiters: '',
    pagesRead: '',
    workoutMin: '',
    notes: ''
  };

  // Filter habits
  const filteredHabits = habits.filter(h => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'non-negotiable') return h.isNonNegotiable;
    return h.category === selectedCategory;
  });

  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => !!dayLogs[h.id]).length;
  const dayPct = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  const nonNegHabits = habits.filter(h => h.isNonNegotiable);
  const completedNonNeg = nonNegHabits.filter(h => !!dayLogs[h.id]).length;

  // Toggle habit
  const toggleHabit = (habitId) => {
    const isNowDone = !dayLogs[habitId];
    const updatedDay = {
      ...dayLogs,
      [habitId]: isNowDone
    };

    const newLogs = {
      ...logs,
      [selectedDate]: updatedDay
    };

    setLogs(newLogs);

    if (isNowDone) {
      if (soundFx) playHabitTick();

      // Check if all habits now done
      const newDoneCount = habits.filter(h => (h.id === habitId ? isNowDone : !!dayLogs[h.id])).length;
      if (newDoneCount === totalHabits && totalHabits > 0) {
        if (soundFx) playArcCompleteChime();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#3b82f6', '#ffffff', '#a855f7']
        });
      }
    }
  };

  // Navigate date
  const changeDate = (days) => {
    const curr = parseDateKey(selectedDate);
    curr.setDate(curr.getDate() + days);
    setSelectedDate(formatDateKey(curr));
  };

  // Add custom habit
  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: `habit-${Date.now()}`,
      name: newHabitName.trim(),
      description: newHabitDesc.trim() || 'Daily Winter Arc discipline standard',
      category: newHabitCat,
      isNonNegotiable: newHabitNonNeg
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setNewHabitDesc('');
    setIsAddingHabit(false);
  };

  // Remove habit
  const handleDeleteHabit = (id) => {
    if (confirm('Remove this habit from your protocol?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  // Update metric
  const updateMetric = (field, val) => {
    const updated = {
      ...metrics,
      [selectedDate]: {
        ...dayMetrics,
        [field]: val
      }
    };
    setMetrics(updated);
  };

  // Compute habit streak
  const getHabitStreak = (habitId) => {
    let streak = 0;
    const check = parseDateKey(selectedDate);
    while (true) {
      const k = formatDateKey(check);
      if (logs[k] && logs[k][habitId]) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const formattedDateHeader = (() => {
    const d = parseDateKey(selectedDate);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  })();

  const isToday = selectedDate === todayKey;

  return (
    <div className="daily-tracker-container">
      {/* Date Header & Day Navigator */}
      <div className="daily-header-panel">
        <div className="date-nav-controls">
          <button 
            id="btn-prev-day"
            className="date-nav-arrow" 
            onClick={() => changeDate(-1)} 
            title="Previous Day"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="date-display-group">
            <div className="date-sub-badge">
              {isToday ? (
                <span className="badge-today">TODAY'S MISSION</span>
              ) : (
                <span className="badge-past">DATE LOG</span>
              )}
              <span className="badge-arc-day">DAY {currentArcDay} OF ARC</span>
            </div>
            <h2 className="current-date-title">{formattedDateHeader}</h2>
          </div>

          <button 
            id="btn-next-day"
            className="date-nav-arrow" 
            onClick={() => changeDate(1)} 
            title="Next Day"
          >
            <ChevronRight size={20} />
          </button>

          {!isToday && (
            <button 
              id="btn-jump-today"
              className="jump-today-btn" 
              onClick={() => setSelectedDate(todayKey)}
            >
              Back to Today
            </button>
          )}
        </div>

        {/* Daily Progress Gauge */}
        <div className="daily-progress-box">
          <div className="progress-labels">
            <span className="progress-title">Daily Execution</span>
            <span className="progress-score">{completedHabits} / {totalHabits} Completed</span>
          </div>
          <div className="progress-track">
            <div 
              className={`progress-fill ${dayPct === 100 ? 'glow-flawless' : ''}`}
              style={{ width: `${dayPct}%` }}
            />
          </div>
          <div className="non-neg-status">
            <span className="non-neg-dot" />
            <span>Non-Negotiables: <strong>{completedNonNeg} of {nonNegHabits.length}</strong></span>
            {dayPct === 100 && (
              <span className="flawless-tag">⚡ FLAWLESS EXECUTION</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Habit List on Left, Daily Metrics on Right */}
      <div className="tracker-split-grid">
        
        {/* Left Column: Habits Protocol */}
        <div className="habits-protocol-section">
          {/* Category Filter Pills & Add Button */}
          <div className="category-toolbar">
            <div className="category-scroll-pills">
              <button 
                className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All ({habits.length})
              </button>
              <button 
                className={`filter-pill non-neg-pill ${selectedCategory === 'non-negotiable' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('non-negotiable')}
              >
                <Flame size={13} /> Non-Negotiables ({nonNegHabits.length})
              </button>
              {Object.values(CATEGORIES).map(cat => (
                <button
                  key={cat.id}
                  className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    borderColor: selectedCategory === cat.id ? cat.color : 'transparent'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button 
              id="btn-add-habit"
              className="add-habit-btn"
              onClick={() => setIsAddingHabit(!isAddingHabit)}
            >
              <Plus size={16} />
              <span>Add Habit</span>
            </button>
          </div>

          {/* Add Habit Inline Drawer */}
          {isAddingHabit && (
            <form className="add-habit-form" onSubmit={handleAddHabit}>
              <div className="form-header">
                <span className="form-title">Forge New Non-Negotiable</span>
                <button type="button" className="close-form-btn" onClick={() => setIsAddingHabit(false)}>✕</button>
              </div>
              <div className="form-row">
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="Habit Name (e.g. 100 Pushups, Read 20 pages...)"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="Description or standard required (optional)"
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                />
              </div>
              <div className="form-meta-row">
                <div className="form-field">
                  <label>Pillar / Category</label>
                  <select 
                    className="input-select"
                    value={newHabitCat}
                    onChange={(e) => setNewHabitCat(e.target.value)}
                  >
                    {Object.values(CATEGORIES).map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field checkbox-field">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox"
                      checked={newHabitNonNeg}
                      onChange={(e) => setNewHabitNonNeg(e.target.checked)}
                    />
                    <span>Mark as Non-Negotiable Core Rule</span>
                  </label>
                </div>

                <button type="submit" className="submit-habit-btn">
                  Confirm Standard
                </button>
              </div>
            </form>
          )}

          {/* Habit Checklist Cards */}
          <div className="habits-list">
            {filteredHabits.length === 0 ? (
              <div className="empty-habits-state">
                <p>No habits under this category.</p>
              </div>
            ) : (
              filteredHabits.map((habit) => {
                const isCompleted = !!dayLogs[habit.id];
                const streak = getHabitStreak(habit.id);
                const cat = CATEGORIES[habit.category] || CATEGORIES.physical;

                return (
                  <div 
                    key={habit.id}
                    id={`habit-card-${habit.id}`}
                    className={`habit-card ${isCompleted ? 'habit-completed' : ''}`}
                    onClick={() => toggleHabit(habit.id)}
                  >
                    {/* Glowing Checkbox */}
                    <div className="habit-check-wrap">
                      <div className={`habit-checkbox ${isCompleted ? 'checked' : ''}`}>
                        {isCompleted && <Check size={16} strokeWidth={3} />}
                      </div>
                    </div>

                    {/* Habit Details */}
                    <div className="habit-info-col">
                      <div className="habit-title-row">
                        <span className={`habit-name ${isCompleted ? 'strikethrough' : ''}`}>
                          {habit.name}
                        </span>

                        {habit.isNonNegotiable && (
                          <span className="non-neg-badge">
                            <Flame size={12} />
                            NON-NEGOTIABLE
                          </span>
                        )}
                      </div>

                      {habit.description && (
                        <p className="habit-desc">{habit.description}</p>
                      )}

                      <div className="habit-footer-row">
                        <span 
                          className="category-indicator"
                          style={{
                            color: cat.color,
                            backgroundColor: cat.bg,
                            borderColor: cat.border
                          }}
                        >
                          {cat.label}
                        </span>

                        {streak > 0 && (
                          <span className="habit-streak-pill" title={`${streak} consecutive days completed`}>
                            🔥 {streak} {streak === 1 ? 'day' : 'days'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Remove Action */}
                    <div className="habit-actions-col" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="delete-habit-btn"
                        onClick={() => handleDeleteHabit(habit.id)}
                        title="Delete Habit"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Quantitative Daily Logs & Notes */}
        <div className="daily-metrics-section">
          <div className="metrics-card">
            <h3 className="section-title">
              <Sparkles size={17} />
              <span>Quantitative Data Log</span>
            </h3>
            <p className="section-subtitle">Real metrics to measure your physical & mental evolution.</p>

            <div className="metric-input-grid">
              {/* Sleep Hours */}
              <div className="metric-box">
                <div className="metric-box-header">
                  <Moon size={16} className="text-purple" />
                  <span>Sleep Duration</span>
                </div>
                <div className="metric-input-wrap">
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="16"
                    placeholder="e.g. 7.5"
                    className="metric-number-input"
                    value={dayMetrics.sleepHours || ''}
                    onChange={(e) => updateMetric('sleepHours', e.target.value)}
                  />
                  <span className="metric-unit">hrs</span>
                </div>
              </div>

              {/* Water Intake */}
              <div className="metric-box">
                <div className="metric-box-header">
                  <Droplet size={16} className="text-cyan" />
                  <span>Water Intake</span>
                </div>
                <div className="metric-input-wrap">
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="10"
                    placeholder="e.g. 3.8"
                    className="metric-number-input"
                    value={dayMetrics.waterLiters || ''}
                    onChange={(e) => updateMetric('waterLiters', e.target.value)}
                  />
                  <span className="metric-unit">L</span>
                </div>
              </div>

              {/* Reading */}
              <div className="metric-box">
                <div className="metric-box-header">
                  <BookOpen size={16} className="text-blue" />
                  <span>Pages Read</span>
                </div>
                <div className="metric-input-wrap">
                  <input 
                    type="number" 
                    step="1" 
                    min="0" 
                    max="500"
                    placeholder="e.g. 15"
                    className="metric-number-input"
                    value={dayMetrics.pagesRead || ''}
                    onChange={(e) => updateMetric('pagesRead', e.target.value)}
                  />
                  <span className="metric-unit">pages</span>
                </div>
              </div>

              {/* Workout Duration */}
              <div className="metric-box">
                <div className="metric-box-header">
                  <Dumbbell size={16} className="text-emerald" />
                  <span>Training Time</span>
                </div>
                <div className="metric-input-wrap">
                  <input 
                    type="number" 
                    step="5" 
                    min="0" 
                    max="300"
                    placeholder="e.g. 60"
                    className="metric-number-input"
                    value={dayMetrics.workoutMin || ''}
                    onChange={(e) => updateMetric('workoutMin', e.target.value)}
                  />
                  <span className="metric-unit">min</span>
                </div>
              </div>
            </div>

            {/* Daily Reflection Journal Note */}
            <div className="daily-journal-box">
              <label className="journal-label">
                Daily Reflection & Mindset Check
              </label>
              <textarea 
                className="journal-textarea"
                rows="4"
                placeholder="What friction did you conquer today? What will you sharpen tomorrow?"
                value={dayMetrics.notes || ''}
                onChange={(e) => updateMetric('notes', e.target.value)}
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
