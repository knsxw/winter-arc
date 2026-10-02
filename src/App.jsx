import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ArcCountdown from './components/ArcCountdown';
import DailyTracker from './components/DailyTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MilestonesView from './components/MilestonesView';
import MetricsLogView from './components/MetricsLogView';
import FrostParticles from './components/FrostParticles';

import { 
  getStoredHabits, 
  saveStoredHabits,
  getStoredLogs, 
  saveStoredLogs,
  getStoredMetrics, 
  saveStoredMetrics,
  getStoredSettings, 
  saveStoredSettings,
  calculateArcStats,
  formatDateKey,
  generateDemoArcData
} from './utils/storage';
import { toggleBlizzardAmbience } from './utils/sound';
import { DEFAULT_HABITS } from './data/initialData';

export default function App() {
  const [habits, setHabits] = useState(() => getStoredHabits());
  const [logs, setLogs] = useState(() => getStoredLogs());
  const [metrics, setMetrics] = useState(() => getStoredMetrics());
  const [settings, setSettings] = useState(() => getStoredSettings());
  
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey());
  const [winterAmbience, setWinterAmbience] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveStoredHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveStoredLogs(logs);
  }, [logs]);

  useEffect(() => {
    saveStoredMetrics(metrics);
  }, [metrics]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Compute stats dynamically whenever habits or logs change
  const stats = calculateArcStats(habits, logs);

  const setGhostMode = (val) => {
    setSettings((prev) => ({ ...prev, ghostMode: val }));
  };

  const setSoundFx = (val) => {
    setSettings((prev) => ({ ...prev, soundFx: val }));
  };

  const handleToggleAmbience = () => {
    const isPlaying = toggleBlizzardAmbience();
    setWinterAmbience(isPlaying);
    setSettings((prev) => ({ ...prev, winterAmbience: isPlaying }));
  };

  // Load rich demo data
  const handleLoadDemo = () => {
    if (confirm('Load realistic 14-day Winter Arc historical logs to test charts, streaks, and heatmap?')) {
      const demo = generateDemoArcData(habits);
      setLogs({ ...demo.logs });
      setMetrics({ ...demo.metrics });
    }
  };

  // Reset to brand new clean state
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all tracked days and restore default habits? This cannot be undone.')) {
      setHabits(DEFAULT_HABITS);
      setLogs({});
      setMetrics({});
      localStorage.clear();
    }
  };

  const handleSelectDateFromHeatmap = (dateKey) => {
    setSelectedDate(dateKey);
    setActiveTab('daily');
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  return (
    <div className={`app-root ${settings.ghostMode ? 'theme-ghost-mode' : 'theme-arc-dark'}`}>
      {/* Ghost Mode Frost Canvas */}
      {settings.ghostMode && <FrostParticles />}

      {/* Top Fixed Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        ghostMode={settings.ghostMode}
        setGhostMode={setGhostMode}
        soundFx={settings.soundFx}
        setSoundFx={setSoundFx}
        winterAmbience={winterAmbience}
        toggleAmbience={handleToggleAmbience}
        onLoadDemo={handleLoadDemo}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="main-content-layout">
        {/* Hero Banner with Arc Countdown and Key Streaks */}
        <ArcCountdown stats={stats} />

        {/* Dynamic Tab Views */}
        <div className="tab-viewport">
          {activeTab === 'daily' && (
            <DailyTracker
              habits={habits}
              setHabits={setHabits}
              logs={logs}
              setLogs={setLogs}
              metrics={metrics}
              setMetrics={setMetrics}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              soundFx={settings.soundFx}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              stats={stats}
              habits={habits}
              logs={logs}
              metrics={metrics}
              onSelectDate={handleSelectDateFromHeatmap}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'timeline' && (
            <MilestonesView stats={stats} />
          )}

          {activeTab === 'metrics' && (
            <MetricsLogView
              metrics={metrics}
              logs={logs}
              habits={habits}
              onSelectDate={handleSelectDateFromHeatmap}
              stats={stats}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="arc-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-brand-title">WINTER ARC PROTOCOL</span>
            <span className="footer-brand-desc">Silence. Focus. Relentless execution until January 1st.</span>
          </div>
          <div className="footer-meta">
            <span>Local Storage Encrypted & Saved</span>
            <span className="separator">•</span>
            <span>Zero Excuses</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
