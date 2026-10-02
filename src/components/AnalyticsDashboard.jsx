import React, { useState } from 'react';
import { 
  BarChart3, 
  Flame, 
  Calendar, 
  Zap, 
  TrendingUp, 
  Target, 
  ShieldCheck,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { CATEGORIES, BADGES } from '../data/initialData';
import { getAllArcDates, parseDateKey, formatDateKey, getArcDayNumber } from '../utils/storage';

export default function AnalyticsDashboard({
  stats,
  habits,
  logs,
  metrics,
  onSelectDate,
  setActiveTab
}) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const allArcDates = getAllArcDates();
  const todayKey = formatDateKey();

  // Helper to get color level for heatmap
  const getCellColor = (dateKey) => {
    const pct = stats.dailyPercentages[dateKey];
    if (pct === undefined || pct === null) {
      // Future or unlogged
      return dateKey > todayKey ? 'cell-future' : 'cell-empty';
    }
    if (pct === 0) return 'cell-0';
    if (pct < 50) return 'cell-low';
    if (pct < 75) return 'cell-med';
    if (pct < 100) return 'cell-high';
    return 'cell-flawless';
  };

  // Group dates by weeks (columns)
  // Each column has 7 days (Mon-Sun or Sun-Sat)
  const weeks = [];
  let currentWeek = [];
  
  allArcDates.forEach((dateKey, index) => {
    currentWeek.push(dateKey);
    if (currentWeek.length === 7 || index === allArcDates.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return (
    <div className="analytics-container">
      {/* KPI Overview Grid */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap cyan-glow">
            <Target size={22} className="text-cyan" />
          </div>
          <div className="kpi-data">
            <span className="kpi-title">TOTAL COMPLETION</span>
            <div className="kpi-main-val">
              <span className="kpi-number">{stats.overallCompletionRate}%</span>
              <span className="kpi-badge">ARC OVERALL</span>
            </div>
            <p className="kpi-sub">Across all tracked habit slots</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap flame-glow">
            <Flame size={22} className="text-amber" />
          </div>
          <div className="kpi-data">
            <span className="kpi-title">CURRENT STREAK</span>
            <div className="kpi-main-val">
              <span className="kpi-number">{stats.currentStreak}</span>
              <span className="kpi-unit">DAYS</span>
            </div>
            <p className="kpi-sub">Longest record: <strong>{stats.longestStreak} days</strong></p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap purple-glow">
            <Zap size={22} className="text-purple" />
          </div>
          <div className="kpi-data">
            <span className="kpi-title">FLAWLESS 100% DAYS</span>
            <div className="kpi-main-val">
              <span className="kpi-number">{stats.flawlessDays}</span>
              <span className="kpi-unit">DAYS</span>
            </div>
            <p className="kpi-sub">Zero compromises made</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap green-glow">
            <ShieldCheck size={22} className="text-emerald" />
          </div>
          <div className="kpi-data">
            <span className="kpi-title">NON-NEGOTIABLES MET</span>
            <div className="kpi-main-val">
              <span className="kpi-number">{stats.nonNegotiableCompletionRate}%</span>
            </div>
            <p className="kpi-sub">Core rules discipline rate</p>
          </div>
        </div>
      </div>

      {/* Main Heatmap Section (GitHub Style) */}
      <div className="heatmap-section-card">
        <div className="heatmap-header">
          <div className="heatmap-title-col">
            <h3 className="card-headline">
              <Calendar size={18} className="text-cyan" />
              <span>90-Day Winter Arc Activity Matrix</span>
            </h3>
            <p className="card-desc">
              Visual consistency map from October 1 to January 1. Click any day to view or edit its protocol.
            </p>
          </div>

          <div className="heatmap-legend">
            <span className="legend-label">Less</span>
            <span className="legend-box cell-empty" title="0% completed" />
            <span className="legend-box cell-low" title="1 - 49% completed" />
            <span className="legend-box cell-med" title="50 - 74% completed" />
            <span className="legend-box cell-high" title="75 - 99% completed" />
            <span className="legend-box cell-flawless" title="100% Flawless" />
            <span className="legend-label">Flawless</span>
          </div>
        </div>

        {/* Heatmap Matrix Grid */}
        <div className="heatmap-scroll-area">
          <div className="heatmap-month-labels">
            <span style={{ minWidth: '220px' }}>OCTOBER</span>
            <span style={{ minWidth: '220px' }}>NOVEMBER</span>
            <span style={{ minWidth: '220px' }}>DECEMBER</span>
            <span>JAN 1</span>
          </div>

          <div className="heatmap-matrix-wrap">
            <div className="heatmap-grid-columns">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="heatmap-week-column">
                  {week.map(dateKey => {
                    const pct = stats.dailyPercentages[dateKey] ?? 0;
                    const isToday = dateKey === todayKey;
                    const dayNum = getArcDayNumber(dateKey);
                    const colorClass = getCellColor(dateKey);

                    return (
                      <div
                        key={dateKey}
                        className={`heatmap-cell ${colorClass} ${isToday ? 'cell-today-ring' : ''}`}
                        onClick={() => onSelectDate(dateKey)}
                        onMouseEnter={() => setHoveredDay({ dateKey, pct, dayNum })}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hover Tooltip Info Bar */}
          <div className="heatmap-status-bar">
            {hoveredDay ? (
              <div className="hover-day-info">
                <span className="hover-badge">DAY {hoveredDay.dayNum}</span>
                <span className="hover-date">{hoveredDay.dateKey}</span>
                <span className="hover-score">
                  Execution: <strong>{hoveredDay.pct}%</strong>
                </span>
                <span className="hover-cta">Click cell to open day</span>
              </div>
            ) : (
              <div className="hover-placeholder">
                Hover over any cell in the 92-day grid to inspect execution
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Analytics: Pillar Breakdown & Weekly Trends */}
      <div className="analytics-details-grid">
        
        {/* Pillar / Category Radar Bars */}
        <div className="analytics-card">
          <h3 className="card-headline">
            <BarChart3 size={18} className="text-blue" />
            <span>Pillars of Transformation</span>
          </h3>
          <p className="card-desc">Discipline breakdown by core Winter Arc categories.</p>

          <div className="pillar-bars-list">
            {Object.values(CATEGORIES).map(cat => {
              const catData = stats.categoryStats[cat.id] || { total: 0, completed: 0 };
              const pct = catData.total > 0 
                ? Math.round((catData.completed / catData.total) * 100) 
                : 0;

              return (
                <div key={cat.id} className="pillar-item">
                  <div className="pillar-label-row">
                    <span className="pillar-name" style={{ color: cat.color }}>
                      {cat.label}
                    </span>
                    <span className="pillar-pct">{pct}%</span>
                  </div>
                  <div className="pillar-track">
                    <div 
                      className="pillar-fill"
                      style={{ 
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                        boxShadow: `0 0 10px ${cat.color}66`
                      }}
                    />
                  </div>
                  <div className="pillar-sub-info">
                    {catData.completed} completed of {catData.total} logged checks
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Trend Trajectory */}
        <div className="analytics-card">
          <div className="card-headline-row">
            <h3 className="card-headline">
              <TrendingUp size={18} className="text-emerald" />
              <span>Weekly Discipline Momentum</span>
            </h3>
            <span className="trend-badge">Rolling 7-Day</span>
          </div>
          <p className="card-desc">Overall momentum consistency through the cold months.</p>

          {/* SVG Trajectory Chart */}
          <div className="svg-trend-wrapper">
            <svg className="trend-svg" viewBox="0 0 400 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

              {/* Generate dynamic path based on logged days */}
              {(() => {
                const datesWithData = allArcDates.slice(0, Math.min(28, stats.currentArcDay));
                if (datesWithData.length < 2) {
                  return (
                    <text x="200" y="80" textAnchor="middle" fill="#64748b" fontSize="13">
                      Log at least 2 days of habits to display trend curve
                    </text>
                  );
                }

                const points = datesWithData.map((d, i) => {
                  const pct = stats.dailyPercentages[d] || 0;
                  const x = (i / (datesWithData.length - 1)) * 380 + 10;
                  const y = 140 - (pct / 100) * 110;
                  return { x, y, pct };
                });

                const pathD = points.reduce((acc, p, i) => 
                  i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, ''
                );

                const areaD = `${pathD} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#trendGradient)" />
                    <path d={pathD} fill="none" stroke="#00f0ff" strokeWidth="2.5" />
                    {points.map((p, idx) => (
                      <circle 
                        key={idx} 
                        cx={p.x} 
                        cy={p.y} 
                        r="3.5" 
                        fill="#00f0ff" 
                        stroke="#0a0f1d" 
                        strokeWidth="1.5" 
                      />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Quick Achievement Milestone Preview */}
          <div className="milestones-quick-strip">
            <div className="quick-strip-header">
              <span className="strip-title">Recent Badges Unlocked</span>
              <button className="view-all-badges-btn" onClick={() => setActiveTab('timeline')}>
                View All <ChevronRight size={13} />
              </button>
            </div>
            <div className="badge-pills-row">
              {BADGES.map(badge => {
                const isUnlocked = badge.condition(stats);
                return (
                  <div 
                    key={badge.id}
                    className={`mini-badge-chip ${isUnlocked ? 'unlocked' : 'locked'}`}
                    title={`${badge.name}: ${badge.description}`}
                  >
                    <span>{isUnlocked ? '🏆' : '🔒'}</span>
                    <span>{badge.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
