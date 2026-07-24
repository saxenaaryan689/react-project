import React from 'react';

function Navbar() {
  return (
    <nav className="navbar glass-nav">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="navbar-logo">🎓</span>
          <div>
            <h1 className="navbar-title">Smart Campus Lost &amp; Found</h1>
            <p className="navbar-subtitle">CSJMU · AI-Powered Matching · Real-Time Reports</p>
          </div>
        </div>
        <div className="navbar-badges">
          <span className="nav-badge">🏫 Campus Connect</span>
          <span className="nav-badge active-badge">🟢 Live</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
