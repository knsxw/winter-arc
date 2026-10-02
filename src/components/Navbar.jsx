import React from 'react';
import { 
  Flame, 
  Calendar, 
  BarChart3, 
  Trophy, 
  Activity, 
  Volume2, 
  VolumeX, 
  Wind, 
  Moon, 
  Sun, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  stats, 
  ghostMode, 
  setGhostMode, 
  soundFx, 
  setSoundFx, 
  winterAmbience, 
  toggleAmbience,
  onLoadDemo,
  onReset
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand & Arc Day Counter */}
        <div className="brand-group">
          <div className="brand-logo-glow">
            <span className="brand-icon">❄️</span>
          </div>
          <div className="brand-titles">
            <div className="brand-main-row">
              <span className="brand-title">WINTER ARC</span>
              <span className="brand-tag">PROTOCOL</span>
            </div>
            <div className="brand-sub">90-DAY TRANSFORMATION</div>
          </div>

          <div className="arc-day-badge">
            <span className="day-number">DAY {String(stats.currentArcDay).padStart(2, '0')}</span>
            <span className="day-total">/ {stats.totalArcDays}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs" role="tablist">
          <button 
            id="tab-daily"
            role="tab"
            aria-selected={activeTab === 'daily'}
            className={`nav-tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            <ShieldCheck className="tab-icon" size={17} />
            <span>Daily Protocol</span>
          </button>

          <button 
            id="tab-analytics"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="tab-icon" size={17} />
            <span>Analytics & Heatmap</span>
          </button>

          <button 
            id="tab-timeline"
            role="tab"
            aria-selected={activeTab === 'timeline'}
            className={`nav-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Trophy className="tab-icon" size={17} />
            <span>Milestones</span>
          </button>

          <button 
            id="tab-metrics"
            role="tab"
            aria-selected={activeTab === 'metrics'}
            className={`nav-tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            <Activity className="tab-icon" size={17} />
            <span>Metrics Log</span>
          </button>
        </nav>

        {/* Quick Utilities & Atmosphere Controls */}
        <div className="navbar-actions">
          {/* Ghost Mode Toggle */}
          <button 
            id="btn-ghost-mode"
            className={`action-pill-btn ${ghostMode ? 'pill-active-ghost' : ''}`}
            onClick={() => setGhostMode(!ghostMode)}
            title={ghostMode ? "Ghost Mode Active: Maximum Stealth Focus" : "Toggle Ghost Mode"}
          >
            <Moon size={15} />
            <span className="pill-text">{ghostMode ? 'GHOST ON' : 'GHOST MODE'}</span>
          </button>

          {/* Blizzard Audio Synthesizer */}
          <button 
            id="btn-ambience"
            className={`icon-tool-btn ${winterAmbience ? 'active-glow' : ''}`}
            onClick={toggleAmbience}
            title={winterAmbience ? "Mute Winter Blizzard Ambience" : "Play Winter Blizzard Wind (Web Audio)"}
          >
            <Wind size={17} />
          </button>

          {/* Sound FX Toggle */}
          <button 
            id="btn-sound-fx"
            className={`icon-tool-btn ${soundFx ? 'active' : ''}`}
            onClick={() => setSoundFx(!soundFx)}
            title={soundFx ? "Sound Effects Enabled" : "Sound Effects Muted"}
          >
            {soundFx ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>

          {/* Quick Demo & Reset Tools */}
          <button 
            id="btn-demo-data"
            className="action-pill-btn demo-btn"
            onClick={onLoadDemo}
            title="Populate realistic historical logs to preview full analytics"
          >
            <Sparkles size={14} />
            <span className="pill-text">Fill Demo</span>
          </button>

          <button 
            id="btn-reset-data"
            className="icon-tool-btn danger-hover"
            onClick={onReset}
            title="Reset All Logs & Habits to Default"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
