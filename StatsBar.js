import React, { useEffect, useState } from 'react';

function AnimatedCount({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    if (value === 0) { setDisplay(0); return; }
    const step = Math.ceil(value / 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

function StatsBar({ lostCount, foundCount, matchCount }) {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <div className="stat-icon lost-icon">📋</div>
        <div className="stat-info">
          <span className="stat-number lost-color"><AnimatedCount value={lostCount} /></span>
          <span className="stat-label">Items Lost</span>
        </div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <div className="stat-icon found-icon">✅</div>
        <div className="stat-info">
          <span className="stat-number found-color"><AnimatedCount value={foundCount} /></span>
          <span className="stat-label">Items Found</span>
        </div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <div className="stat-icon match-icon">🤝</div>
        <div className="stat-info">
          <span className="stat-number match-color"><AnimatedCount value={matchCount} /></span>
          <span className="stat-label">Smart Matches</span>
        </div>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <div className="stat-icon total-icon">🏫</div>
        <div className="stat-info">
          <span className="stat-number total-color"><AnimatedCount value={lostCount + foundCount} /></span>
          <span className="stat-label">Total Reports</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StatsBar);
