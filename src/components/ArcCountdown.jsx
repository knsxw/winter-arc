import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles, Shield, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { WINTER_ARC_QUOTES } from '../data/initialData';

export default function ArcCountdown({ stats }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Pick quote based on day or random
    const idx = stats.currentArcDay % WINTER_ARC_QUOTES.length;
    setQuoteIndex(idx);
  }, [stats.currentArcDay]);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % WINTER_ARC_QUOTES.length);
  };

  const currentQuote = WINTER_ARC_QUOTES[quoteIndex];

  // Circular gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.arcProgressPct / 100) * circumference;

  return (
    <div className="arc-hero-card">
      <div className="arc-hero-glow-blob" />
      <div className="arc-hero-content">
        
        {/* Left: Key Stats & Circular Countdown */}
        <div className="arc-gauge-container">
          <div className="circular-progress-wrap">
            <svg className="circular-svg" width="100" height="100" viewBox="0 0 100 100">
              <circle
                className="circle-bg"
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="8"
              />
              <circle
                className="circle-fill"
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="gauge-text-overlay">
              <span className="gauge-pct">{stats.arcProgressPct}%</span>
              <span className="gauge-label">COMPLETE</span>
            </div>
          </div>

          <div className="arc-timeline-info">
            <div className="timeline-badge-row">
              <span className="season-pill">OCT 1 - JAN 1</span>
              <span className="status-live-pill">
                <span className="live-dot" /> LIVE ARC
              </span>
            </div>
            <h1 className="hero-arc-title">
              Day {stats.currentArcDay} <span className="dimmed">of {stats.totalArcDays}</span>
            </h1>
            <p className="hero-subtext">
              <strong className="highlight-text">{stats.daysRemaining} days remaining</strong> until Jan 1st Ascension. No zero days.
            </p>
          </div>
        </div>

        {/* Center: Live Streaks & Non-Negotiable Rate */}
        <div className="hero-metrics-grid">
          <div className="hero-stat-box streak-stat">
            <div className="stat-header">
              <Flame className="stat-icon-flame" size={20} />
              <span className="stat-title">CURRENT STREAK</span>
            </div>
            <div className="stat-value-group">
              <span className="stat-huge-number">{stats.currentStreak}</span>
              <span className="stat-unit">DAYS</span>
            </div>
            <div className="stat-footnote">
              Best record: <strong>{stats.longestStreak} days</strong>
            </div>
          </div>

          <div className="hero-stat-box perfection-stat">
            <div className="stat-header">
              <Zap className="stat-icon-zap" size={20} />
              <span className="stat-title">FLAWLESS DAYS</span>
            </div>
            <div className="stat-value-group">
              <span className="stat-huge-number">{stats.flawlessDays}</span>
              <span className="stat-unit">DAYS</span>
            </div>
            <div className="stat-footnote">
              100% daily checklist achieved
            </div>
          </div>

          <div className="hero-stat-box rate-stat">
            <div className="stat-header">
              <Shield className="stat-icon-shield" size={20} />
              <span className="stat-title">DISCIPLINE RATE</span>
            </div>
            <div className="stat-value-group">
              <span className="stat-huge-number">{stats.overallCompletionRate}%</span>
            </div>
            <div className="stat-footnote">
              Non-negotiables: <strong>{stats.nonNegotiableCompletionRate}%</strong>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Winter Arc Creed / Quote */}
        <div className="hero-quote-card">
          <div className="quote-header">
            <span className="quote-badge">WINTER ARC CREED</span>
            <button 
              onClick={handleNextQuote}
              className="quote-refresh-btn"
              title="Next Quote"
            >
              <RefreshCw size={13} />
            </button>
          </div>
          <blockquote className="quote-text">
            "{currentQuote.quote}"
          </blockquote>
          <div className="quote-author">— {currentQuote.author}</div>
        </div>

      </div>

      {/* Thin Bottom Linear Progress Line */}
      <div className="arc-linear-progress-bar">
        <div 
          className="arc-linear-fill" 
          style={{ width: `${stats.arcProgressPct}%` }}
        />
      </div>
    </div>
  );
}
