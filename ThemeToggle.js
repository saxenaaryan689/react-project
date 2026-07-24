import React from 'react';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <div className="theme-toggle">
      <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={theme === 'light'}
          onChange={toggleTheme}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default ThemeToggle;
