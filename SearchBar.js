import React from 'react';

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar-wrapper">
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Search by name, category or description...'}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>✕</button>
      )}
    </div>
  );
}

export default SearchBar;
