import React from 'react';
import { Activity, Moon, Droplet, BookOpen, Dumbbell, Calendar, FileText, ChevronRight } from 'lucide-react';
import { getAllArcDates, parseDateKey, formatDateKey } from '../utils/storage';

export default function MetricsLogView({ metrics, logs, habits, onSelectDate, stats }) {
  const allDates = getAllArcDates();
  const todayKey = formatDateKey();

  // Find all dates that have any metrics or logs recorded
  const recordedDates = allDates
    .filter(d => (metrics[d] && (metrics[d].sleepHours || metrics[d].waterLiters || metrics[d].workoutMin || metrics[d].notes)) || (logs[d] && Object.keys(logs[d]).length > 0))
    .reverse();

  // Calculate averages across recorded days
  const validSleep = recordedDates.map(d => parseFloat(metrics[d]?.sleepHours)).filter(v => !isNaN(v) && v > 0);
  const avgSleep = validSleep.length > 0 ? (validSleep.reduce((a, b) => a + b, 0) / validSleep.length).toFixed(1) : '—';

  const validWater = recordedDates.map(d => parseFloat(metrics[d]?.waterLiters)).filter(v => !isNaN(v) && v > 0);
  const avgWater = validWater.length > 0 ? (validWater.reduce((a, b) => a + b, 0) / validWater.length).toFixed(1) : '—';

  const totalPages = recordedDates.reduce((acc, d) => acc + (parseInt(metrics[d]?.pagesRead, 10) || 0), 0);
  const totalWorkoutMin = recordedDates.reduce((acc, d) => acc + (parseInt(metrics[d]?.workoutMin, 10) || 0), 0);

  return (
    <div className="metrics-view-container">
      {/* Summary Averages Banner */}
      <div className="metrics-summary-banner">
        <div className="summary-metric-card">
          <div className="summary-icon-box text-purple">
            <Moon size={22} />
          </div>
          <div className="summary-metric-info">
            <span className="summary-label">Average Sleep</span>
            <span className="summary-val">{avgSleep} <small>hrs/night</small></span>
          </div>
        </div>

        <div className="summary-metric-card">
          <div className="summary-icon-box text-cyan">
            <Droplet size={22} />
          </div>
          <div className="summary-metric-info">
            <span className="summary-label">Average Water</span>
            <span className="summary-val">{avgWater} <small>L/day</small></span>
          </div>
        </div>

        <div className="summary-metric-card">
          <div className="summary-icon-box text-blue">
            <BookOpen size={22} />
          </div>
          <div className="summary-metric-info">
            <span className="summary-label">Total Pages Read</span>
            <span className="summary-val">{totalPages} <small>pages</small></span>
          </div>
        </div>

        <div className="summary-metric-card">
          <div className="summary-icon-box text-emerald">
            <Dumbbell size={22} />
          </div>
          <div className="summary-metric-info">
            <span className="summary-label">Total Gym Time</span>
            <span className="summary-val">{Math.round(totalWorkoutMin / 60)} <small>hrs ({totalWorkoutMin}m)</small></span>
          </div>
        </div>
      </div>

      {/* Historical Logs List */}
      <div className="historical-logs-card">
        <div className="logs-header-row">
          <div>
            <h3 className="card-headline">
              <Activity size={18} className="text-cyan" />
              <span>Daily Arc Log History</span>
            </h3>
            <p className="card-desc">Comprehensive record of every tracked session and daily reflection.</p>
          </div>
          <span className="entries-count-badge">{recordedDates.length} Days Recorded</span>
        </div>

        {recordedDates.length === 0 ? (
          <div className="empty-logs-state">
            <Calendar size={32} className="text-muted" />
            <p>No quantitative metrics logged yet. Track your first day in the Daily Protocol tab or click "Fill Demo"!</p>
          </div>
        ) : (
          <div className="logs-table-wrap">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>EXECUTION</th>
                  <th>SLEEP</th>
                  <th>WATER</th>
                  <th>PAGES</th>
                  <th>TRAINING</th>
                  <th>DAILY REFLECTION NOTE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recordedDates.map((dateKey) => {
                  const m = metrics[dateKey] || {};
                  const pct = stats.dailyPercentages[dateKey] ?? 0;
                  const dateObj = parseDateKey(dateKey);
                  const formatted = dateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <tr key={dateKey} className="log-table-row">
                      <td className="date-cell">
                        <strong className="cell-date-main">{formatted}</strong>
                        <span className="cell-date-sub">{dateKey}</span>
                      </td>

                      <td>
                        <span className={`pct-badge ${pct === 100 ? 'pct-100' : pct >= 70 ? 'pct-high' : 'pct-low'}`}>
                          {pct}%
                        </span>
                      </td>

                      <td>
                        {m.sleepHours ? (
                          <span className="metric-val-tag">
                            <Moon size={12} className="text-purple" /> {m.sleepHours}h
                          </span>
                        ) : '—'}
                      </td>

                      <td>
                        {m.waterLiters ? (
                          <span className="metric-val-tag">
                            <Droplet size={12} className="text-cyan" /> {m.waterLiters}L
                          </span>
                        ) : '—'}
                      </td>

                      <td>
                        {m.pagesRead ? (
                          <span className="metric-val-tag">
                            <BookOpen size={12} className="text-blue" /> {m.pagesRead}p
                          </span>
                        ) : '—'}
                      </td>

                      <td>
                        {m.workoutMin ? (
                          <span className="metric-val-tag">
                            <Dumbbell size={12} className="text-emerald" /> {m.workoutMin}m
                          </span>
                        ) : '—'}
                      </td>

                      <td className="note-cell">
                        {m.notes ? (
                          <span className="reflection-text" title={m.notes}>"{m.notes}"</span>
                        ) : (
                          <span className="text-dimmed">No note</span>
                        )}
                      </td>

                      <td>
                        <button 
                          className="open-day-btn"
                          onClick={() => onSelectDate(dateKey)}
                          title="Open in daily tracker"
                        >
                          <span>Open</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
