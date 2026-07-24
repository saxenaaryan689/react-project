import React, { useMemo } from 'react';

// Fuzzy keyword match: splits words and checks overlap
function getMatchScore(lost, found) {
  const tokenize = str =>
    str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);

  const lostWords = new Set([
    ...tokenize(lost.name),
    ...tokenize(lost.description || ''),
    ...tokenize(lost.category || ''),
  ]);
  const foundWords = new Set([
    ...tokenize(found.name),
    ...tokenize(found.description || ''),
    ...tokenize(found.category || ''),
  ]);

  let score = 0;
  lostWords.forEach(w => { if (foundWords.has(w)) score++; });

  // Bonus: exact name match = strong signal
  if (lost.name.trim().toLowerCase() === found.name.trim().toLowerCase()) score += 5;

  // Category match bonus
  if (lost.category && found.category && lost.category === found.category) score += 2;

  return score;
}

function getConfidenceLabel(score) {
  if (score >= 7) return { label: 'Very High', color: 'conf-very-high' };
  if (score >= 4) return { label: 'High', color: 'conf-high' };
  if (score >= 2) return { label: 'Moderate', color: 'conf-moderate' };
  return { label: 'Low', color: 'conf-low' };
}

function MatchSuggestions({ lostItems, foundItems }) {
  const matches = useMemo(() => {
    const results = [];
    lostItems.forEach(lost => {
      foundItems.forEach(found => {
        const score = getMatchScore(lost, found);
        if (score >= 1) results.push({ lost, found, score });
      });
    });
    return results.sort((a, b) => b.score - a.score);
  }, [lostItems, foundItems]);

  if (!lostItems.length && !foundItems.length) {
    return (
      <div className="empty-state">
        <div className="empty-emoji">🤖</div>
        <p className="empty-title">Smart Matching Engine Ready</p>
        <p className="empty-sub">
          Our AI-powered system automatically finds potential matches between lost and found items
          using keyword analysis, category matching, and name similarity. Start by reporting items above!
        </p>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="empty-state">
        <div className="empty-emoji">🔄</div>
        <p className="empty-title">No matches found yet</p>
        <p className="empty-sub">
          The system is actively comparing {lostItems.length} lost and {foundItems.length} found item(s).
          Matches appear here when similar keywords, names, or categories are detected.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="match-intro">
        🤖 Found <strong>{matches.length}</strong> potential match{matches.length > 1 ? 'es' : ''} based on keyword &amp; category analysis.
      </p>
      <div className="match-list">
        {matches.map((m, idx) => {
          const conf = getConfidenceLabel(m.score);
          return (
            <div className="match-card tilt-card" key={idx}>
              <div className="match-header">
                <span className="match-badge">🤝 Possible Match #{idx + 1}</span>
                <span className={`conf-badge ${conf.color}`}>{conf.label} Confidence</span>
              </div>

              <div className="match-row">
                <div className="match-side lost-side">
                  <div className="match-side-label">
                    <span className="side-dot lost-dot" />
                    LOST
                  </div>
                  <p className="match-item-name">{m.lost.name}</p>
                  {m.lost.category && <span className="match-cat-pill">{m.lost.category}</span>}
                  <p className="match-item-desc">{m.lost.description}</p>
                  {m.lost.contact && <p className="match-contact">📞 {m.lost.contact}</p>}
                </div>

                <div className="match-vs">
                  <div className="match-vs-circle">VS</div>
                </div>

                <div className="match-side found-side">
                  <div className="match-side-label">
                    <span className="side-dot found-dot" />
                    FOUND
                  </div>
                  <p className="match-item-name">{m.found.name}</p>
                  {m.found.category && <span className="match-cat-pill">{m.found.category}</span>}
                  <p className="match-item-desc">{m.found.description}</p>
                  {m.found.contact && <p className="match-contact">📞 {m.found.contact}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(MatchSuggestions);
