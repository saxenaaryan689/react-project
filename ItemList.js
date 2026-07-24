import React, { useState, useMemo } from 'react';
import { CATEGORY_EMOJI } from '../constants/categories';
import SearchBar from './SearchBar';

function ItemList({ items, type, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q) ||
      (item.location || '').toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <div>
      {items.length > 0 && (
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={`Search ${type} items...`}
        />
      )}

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">{type === 'lost' ? '🔍' : '📦'}</div>
          <p className="empty-title">No {type} items yet</p>
          <p className="empty-sub">
            {type === 'lost'
              ? 'Lost something on campus? Fill the form above to report it and let others help you find it.'
              : 'Found something on campus? Report it above so the rightful owner can claim it.'}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🔎</div>
          <p className="empty-title">No results for "{search}"</p>
          <p className="empty-sub">Try a different keyword or clear the search.</p>
        </div>
      ) : (
        <div className="item-list">
          {filtered.map(item => (
            <div className={`item-card tilt-card ${type}-card`} key={item.id}>
              {onDelete && (
                <button
                  className="item-delete-btn"
                  onClick={() => onDelete(item.id)}
                  title="Remove this item"
                >✕</button>
              )}

              {item.photo && (
                <div className="item-photo-wrapper">
                  <img src={item.photo} alt={item.name} className="item-photo" />
                  {item.category && (
                    <span className="item-category-badge">
                      {CATEGORY_EMOJI[item.category] || '📦'} {item.category}
                    </span>
                  )}
                </div>
              )}

              {!item.photo && item.category && (
                <div className="item-category-pill">
                  <span>{CATEGORY_EMOJI[item.category] || '📦'}</span>
                  <span>{item.category}</span>
                </div>
              )}

              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>

              {item.location && (
                <p className="item-meta">
                  <span className="meta-icon">📍</span>
                  {item.location}
                </p>
              )}

              {item.contact && (
                <p className="item-meta">
                  <span className="meta-icon">📞</span>
                  {item.contact}
                </p>
              )}

              {item.reportedAt && (
                <p className="item-meta item-time">
                  <span className="meta-icon">🕐</span>
                  {item.reportedAt}
                </p>
              )}

              {type === 'found' && (
                <button className="btn-claim">
                  🙋 Claim This Item
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(ItemList);
