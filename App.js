import React, { useMemo, useCallback } from 'react';
import Background3D from './components/Background3D';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import LostForm from './components/LostForm';
import FoundForm from './components/FoundForm';
import ItemList from './components/ItemList';
import MatchSuggestions from './components/MatchSuggestions';
import StatsBar from './components/StatsBar';
import Toast, { useToast } from './components/Toast';
import useLocalStorage from './hooks/useLocalStorage';


function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [lostItems, setLostItems] = useLocalStorage('lostItems', []);
  const [foundItems, setFoundItems] = useLocalStorage('foundItems', []);
  const { toasts, addToast, removeToast } = useToast();

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  const handleDeleteLost = useCallback((id) => {
    setLostItems(prev => prev.filter(i => i.id !== id));
    addToast('Item Removed', 'The lost item report was deleted.', 'delete');
  }, [setLostItems, addToast]);

  const handleDeleteFound = useCallback((id) => {
    setFoundItems(prev => prev.filter(i => i.id !== id));
    addToast('Item Removed', 'The found item report was deleted.', 'delete');
  }, [setFoundItems, addToast]);

  // Memoized match count — only recomputes when items change
  const matchCount = useMemo(() => {
    const matches = new Set();
    const tokenize = str =>
      str.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    lostItems.forEach(lost => {
      const lw = new Set([...tokenize(lost.name), ...tokenize(lost.description || ''), ...tokenize(lost.category || '')]);
      foundItems.forEach(found => {
        const fw = new Set([...tokenize(found.name), ...tokenize(found.description || ''), ...tokenize(found.category || '')]);
        let score = 0;
        lw.forEach(w => { if (fw.has(w)) score++; });
        if (lost.name.trim().toLowerCase() === found.name.trim().toLowerCase()) score += 5;
        if (lost.category && found.category && lost.category === found.category) score += 2;
        if (score >= 1) matches.add(`${lost.id}-${found.id}`);
      });
    });
    return matches.size;
  }, [lostItems, foundItems]);

  return (
    <div className={`app-root ${theme}`}>
      <Background3D theme={theme} />
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="app-container">
        <Navbar />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <StatsBar lostCount={lostItems.length} foundCount={foundItems.length} matchCount={matchCount} />

        {/* Hero Banner */}
        <div className="hero-banner glass-card">
          <div className="hero-text">
            <h2 className="hero-heading">Lost something on campus? <span className="hero-highlight">We'll help you find it.</span></h2>
            <p className="hero-sub">
              Our smart matching engine automatically pairs lost and found items using AI-powered keyword analysis.
              Report your item below — hundreds of students are already connected through this platform.
            </p>
          </div>
          <div className="hero-steps">
            <div className="hero-step">
              <span className="step-num">1</span>
              <span>Report Item</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="hero-step">
              <span className="step-num">2</span>
              <span>AI Matches</span>
            </div>
            <div className="step-arrow">→</div>
            <div className="hero-step">
              <span className="step-num">3</span>
              <span>Get Reunited</span>
            </div>
          </div>
        </div>

        <main className="main-grid">
          {/* Lost Form */}
          <section className="glass-card tilt-card form-section lost-section">
            <div className="section-header">
              <div className="section-icon lost-icon-bg">📋</div>
              <div>
                <h2 className="section-title">Report Lost Item</h2>
                <p className="section-desc">Fill in the details and let the campus community help you find it</p>
              </div>
            </div>
            <LostForm
              setLostItems={setLostItems}
              onSuccess={() => addToast('Lost Item Reported!', 'Your report is now live. We\'ll notify you on a match.', 'lost')}
            />
          </section>

          {/* Found Form */}
          <section className="glass-card tilt-card form-section found-section">
            <div className="section-header">
              <div className="section-icon found-icon-bg">✅</div>
              <div>
                <h2 className="section-title">Report Found Item</h2>
                <p className="section-desc">Found something? Report it here so the owner can claim it back</p>
              </div>
            </div>
            <FoundForm
              setFoundItems={setFoundItems}
              onSuccess={() => addToast('Found Item Reported!', 'Great job! The owner will be notified if matched.', 'found')}
            />
          </section>

          {/* Lost Items List */}
          <section className="glass-card tilt-card wide-card list-section">
            <div className="section-header">
              <div className="section-icon lost-icon-bg">🔍</div>
              <div>
                <h2 className="section-title">Lost Items Board</h2>
                <p className="section-desc">
                  {lostItems.length === 0
                    ? 'No reports yet — be the first to report a lost item'
                    : `${lostItems.length} item${lostItems.length > 1 ? 's' : ''} reported as lost on campus`}
                </p>
              </div>
            </div>
            <ItemList items={lostItems} type="lost" onDelete={handleDeleteLost} />
          </section>

          {/* Found Items List */}
          <section className="glass-card tilt-card wide-card list-section">
            <div className="section-header">
              <div className="section-icon found-icon-bg">📦</div>
              <div>
                <h2 className="section-title">Found Items Board</h2>
                <p className="section-desc">
                  {foundItems.length === 0
                    ? 'Nothing found yet — help the campus by reporting found items'
                    : `${foundItems.length} item${foundItems.length > 1 ? 's' : ''} found and waiting for their owner`}
                </p>
              </div>
            </div>
            <ItemList items={foundItems} type="found" onDelete={handleDeleteFound} />
          </section>

          {/* Smart Match */}
          <section className="glass-card tilt-card wide-card match-section">
            <div className="section-header">
              <div className="section-icon match-icon-bg">🤖</div>
              <div>
                <h2 className="section-title">AI Smart Match Engine</h2>
                <p className="section-desc">
                  Automatically detects matches using keyword similarity, category tags &amp; name analysis
                </p>
              </div>
            </div>
            <MatchSuggestions lostItems={lostItems} foundItems={foundItems} />
          </section>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-inner">
            <p className="footer-brand">🎓 Smart Campus Lost &amp; Found — CSJMU</p>
            <p className="footer-sub">
              Built with ❤️ for the campus community · All data stored locally on your device · No account needed
            </p>
            <div className="footer-tags">
              <span className="footer-tag">🔒 Private</span>
              <span className="footer-tag">⚡ Instant</span>
              <span className="footer-tag">🤖 AI-Powered</span>
              <span className="footer-tag">📱 Mobile Ready</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
