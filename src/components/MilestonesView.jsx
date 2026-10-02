import React from 'react';
import { Trophy, CheckCircle2, Lock, Flame, Shield, Mountain, Zap, Footprints, Target } from 'lucide-react';
import { BADGES } from '../data/initialData';

export default function MilestonesView({ stats }) {
  const getBadgeIcon = (iconName) => {
    switch (iconName) {
      case 'Footprints': return <Footprints size={24} />;
      case 'Flame': return <Flame size={24} />;
      case 'Shield': return <Shield size={24} />;
      case 'Mountain': return <Mountain size={24} />;
      case 'Zap': return <Zap size={24} />;
      case 'Trophy': return <Trophy size={24} />;
      default: return <Target size={24} />;
    }
  };

  const unlockedCount = BADGES.filter(b => b.condition(stats)).length;

  return (
    <div className="milestones-container">
      {/* Top Banner */}
      <div className="milestones-hero-card">
        <div className="milestone-badge-icon-huge">
          <Trophy size={36} className="text-amber" />
        </div>
        <div className="milestone-hero-text">
          <span className="hero-kicker">DISCIPLINE HALL OF FAME</span>
          <h2 className="milestone-title">Winter Arc Milestones & Badges</h2>
          <p className="milestone-desc">
            Earned through sweat, cold mornings, and non-negotiable consistency. Every badge represents a layer of your former self discarded.
          </p>
        </div>
        <div className="milestone-score-tag">
          <span className="unlocked-val">{unlockedCount} / {BADGES.length}</span>
          <span className="unlocked-lbl">UNLOCKED</span>
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="badges-showcase-grid">
        {BADGES.map((badge) => {
          const isUnlocked = badge.condition(stats);

          return (
            <div 
              key={badge.id}
              className={`badge-card ${isUnlocked ? 'badge-unlocked-card' : 'badge-locked-card'}`}
            >
              <div className="badge-card-top">
                <div className={`badge-icon-box ${isUnlocked ? 'icon-unlocked' : 'icon-locked'}`}>
                  {getBadgeIcon(badge.icon)}
                </div>
                <div className="badge-status-chip">
                  {isUnlocked ? (
                    <span className="chip-earned">
                      <CheckCircle2 size={13} /> UNLOCKED
                    </span>
                  ) : (
                    <span className="chip-locked">
                      <Lock size={12} /> IN PROGRESS
                    </span>
                  )}
                </div>
              </div>

              <div className="badge-content">
                <h4 className="badge-name">{badge.name}</h4>
                <p className="badge-explanation">{badge.description}</p>
              </div>

              <div className="badge-progress-line">
                <div 
                  className={`badge-bar ${isUnlocked ? 'badge-bar-full' : 'badge-bar-empty'}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 90-Day Arc Phases Roadmap */}
      <div className="arc-phases-roadmap">
        <h3 className="section-title">The Three Phases of the Winter Arc</h3>
        <div className="phases-grid">
          <div className={`phase-card ${stats.currentArcDay <= 30 ? 'phase-current' : 'phase-done'}`}>
            <div className="phase-num">PHASE 1 (DAYS 1 - 30)</div>
            <h4 className="phase-title">The Friction & Shock</h4>
            <p className="phase-desc">
              Breaking dopamine addictions, waking in the dark, confronting resistance. Survival and momentum establishment.
            </p>
          </div>

          <div className={`phase-card ${stats.currentArcDay > 30 && stats.currentArcDay <= 60 ? 'phase-current' : stats.currentArcDay > 60 ? 'phase-done' : ''}`}>
            <div className="phase-num">PHASE 2 (DAYS 31 - 60)</div>
            <h4 className="phase-title">The Iron Habit</h4>
            <p className="phase-desc">
              The routine becomes automatic. Your body adapts to the volume. Silence the external noise; lock into ghost mode.
            </p>
          </div>

          <div className={`phase-card ${stats.currentArcDay > 60 ? 'phase-current' : ''}`}>
            <div className="phase-num">PHASE 3 (DAYS 61 - 92)</div>
            <h4 className="phase-title">The New Baseline</h4>
            <p className="phase-desc">
              Refining every edge before January 1st. While others start new year resolutions, you are already operating at mastery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
