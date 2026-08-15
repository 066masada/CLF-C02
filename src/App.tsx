import { useEffect, useRef, useState } from 'react';
import { UserProvider, useUser } from './contexts/UserContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { HomePage } from './components/pages/HomePage';
import { StudyPage } from './components/pages/StudyPage';
import { QuizPage } from './components/pages/QuizPage';
import { RankingPage } from './components/pages/RankingPage';
import { UserEntryPage } from './components/pages/UserEntryPage';
import { AdminPage } from './components/pages/AdminPage';
import { CHANGELOG } from './data/changelog';
import { fetchUserStats, loadMissionProgressFromFirebase } from './hooks/useFirebase';
import { loadProgress, MISSIONS } from './data/missions';
import { calculatePassProbability } from './utils';
import type { UserStats } from './types/index';
import './index.css';

/* ── 更新履歴モーダル ── */
const ChangelogModal = ({ onClose, onOpenAdmin }: { onClose: () => void; onOpenAdmin: () => void }) => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
    }}
    onClick={onClose}
  >
    <div
      style={{
        width: '100%', maxWidth: 680, margin: '0 auto',
        background: 'var(--kg-paper)',
        borderRadius: 'var(--r-2) var(--r-2) 0 0',
        padding: 'var(--s-5) var(--s-4)',
        paddingBottom: 'calc(var(--nav-h) + env(safe-area-inset-bottom) + var(--s-4))',
        maxHeight: '80dvh', overflowY: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s-4)' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>developer menu</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-2)' }}>
            <h2 style={{ margin: 0, color: 'var(--kg-ink)' }}>更新履歴</h2>
            <span
              style={{
                fontFamily: 'var(--font-en)', fontSize: '0.75rem', fontWeight: 700,
                padding: '1px 7px', borderRadius: 'var(--r-1)',
                background: 'var(--kg-accent)', color: 'white',
                letterSpacing: '0.02em',
              }}
            >
              v{__APP_VERSION__}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--kg-ink-3)', padding: 'var(--s-2)',
            fontSize: '1.25rem', lineHeight: 1,
          }}
          aria-label="閉じる"
        >✕</button>
      </div>

      <button
        onClick={onOpenAdmin}
        className="btn btn-secondary"
        style={{
          width: '100%', marginBottom: 'var(--s-4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--s-2)',
        }}
      >
        管理画面を開く →
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
        {CHANGELOG.map(({ date, label, items }, idx) => {
          const isCurrent = label === `v${__APP_VERSION__}`;
          return (
            <div key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)', marginBottom: 'var(--s-2)' }}>
                <span style={{
                  fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '0.875rem',
                  color: isCurrent ? 'var(--kg-accent)' : 'var(--kg-ink-3)',
                }}>{label}</span>
                {isCurrent && (
                  <span style={{
                    fontSize: '0.6875rem', fontWeight: 700,
                    padding: '1px 6px', borderRadius: 'var(--r-1)',
                    border: '1px solid var(--kg-accent)',
                    color: 'var(--kg-accent)',
                    fontFamily: 'var(--font-en)',
                    letterSpacing: '0.04em',
                  }}>現在</span>
                )}
                <span style={{ fontSize: '0.75rem', color: 'var(--kg-ink-4)', fontFamily: 'var(--font-en)' }}>{date}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 'var(--s-4)', display: 'flex', flexDirection: 'column', gap: 'var(--s-1)' }}>
                {items.map((item) => (
                  <li key={item} style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', lineHeight: 1.6 }}>
                    {item}
                  </li>
                ))}
              </ul>
              {idx < CHANGELOG.length - 1 && (
                <hr style={{ marginTop: 'var(--s-4)', border: 'none', borderTop: '1px solid var(--kg-rule)' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

/* ── Nav icons ── */
const IconHome = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11L12 3L21 11V21H15V15H9V21H3V11Z" />
  </svg>
);

const IconBook = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="13" y2="15" />
  </svg>
);

const IconGraduationCap = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6" />
    <path d="M2 10l10-5 10 5-10 5-10-5z" />
    <path d="M6 12v5c3.33 1.33 8.67 1.33 12 0v-5" />
  </svg>
);

const IconAward = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const NAV_TABS = [
  { id: 'home'    as const, label: 'ホーム',     Icon: IconHome },
  { id: 'study'   as const, label: '学習',       Icon: IconBook },
  { id: 'quiz'    as const, label: '試験',       Icon: IconGraduationCap },
  { id: 'ranking' as const, label: 'ランキング', Icon: IconAward },
] as const;

/* ── サイドバー下部の合格確率ミニカード ── */
const SidebarMiniCard = ({ userId }: { userId: string }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [missionCount, setMissionCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const localProgress = loadProgress(userId);
      if (mounted) setMissionCount(localProgress.length);
      const [s, firebaseProgress] = await Promise.all([
        fetchUserStats(userId),
        loadMissionProgressFromFirebase(userId),
      ]);
      if (!mounted) return;
      setStats(s);
      const merged = Array.from(new Set([...localProgress, ...firebaseProgress]));
      setMissionCount(merged.length);
    })();
    return () => { mounted = false; };
  }, [userId]);

  const passPct = stats ? calculatePassProbability(stats) : 0;
  const answered = stats?.totalAnswered ?? 0;

  return (
    <div style={{
      border: '1px solid var(--kg-rule)',
      borderRadius: 'var(--r-1)',
      padding: 'var(--s-4)',
      background: 'var(--kg-paper-2)',
    }}>
      <p style={{
        fontFamily: 'var(--font-en)', fontSize: '0.6875rem',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--kg-ink-3)', margin: '0 0 var(--s-2)',
      }}>
        PASS PROBABILITY
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-2)', marginBottom: 'var(--s-2)' }}>
        <span style={{
          fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '1.75rem',
          color: answered > 0 ? 'var(--kg-accent)' : 'var(--kg-ink-4)',
          lineHeight: 1, letterSpacing: '-0.02em',
        }}>
          {answered > 0 ? `${passPct}%` : '—'}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--kg-ink-3)' }}>合格ライン 70%</span>
      </div>
      <div className="progress-bar" style={{ marginBottom: 'var(--s-2)' }}>
        <div className="progress-bar-fill" style={{ width: `${passPct}%` }} />
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--kg-ink-3)', margin: 0, lineHeight: 1.5 }}>
        ミッション <strong style={{ color: 'var(--kg-ink)' }}>{missionCount}</strong> / {MISSIONS.length} 完了
        {answered > 0 && ` · 累計 ${answered} 問`}
      </p>
    </div>
  );
};

const AppContent = () => {
  const { user, setUser, clearUser } = useUser();
  const { screen, navigate } = useNavigation();
  const [showChangelog, setShowChangelog] = useState(false);
  const [missionCount, setMissionCount] = useState(0);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenAdmin = () => {
    setShowChangelog(false);
    navigate('admin');
  };

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const local = loadProgress(user.userId);
    setMissionCount(local.length);
    loadMissionProgressFromFirebase(user.userId).then((fb) => {
      if (!mounted) return;
      setMissionCount(Array.from(new Set([...local, ...fb])).length);
    });
    return () => { mounted = false; };
  }, [user]);

  const startPress = () => {
    pressTimer.current = setTimeout(() => setShowChangelog(true), 3000);
  };
  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  if (!user) {
    return (
      <UserEntryPage
        onSubmit={(newUser) => {
          setUser(newUser);
          navigate('home');
        }}
      />
    );
  }

  return (
    <div className="app-layout">
      {showChangelog && <ChangelogModal onClose={() => setShowChangelog(false)} onOpenAdmin={handleOpenAdmin} />}

      {/* ── App Bar ── */}
      <header className="app-header">
        <div className="app-brand">
          <span
            className="brand-badge"
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
            onTouchCancel={cancelPress}
            onContextMenu={(e) => e.preventDefault()}
            style={{ userSelect: 'none', WebkitUserSelect: 'none', cursor: 'default' }}
          >CLF-C02</span>
          <span className="brand-title">AWS Cloud Practitioner 試験対策</span>
        </div>
        <div className="header-user">
          <span className="header-username">{user.displayName}</span>
          <button className="header-change-btn" onClick={clearUser}>変更</button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="app-main">
        <div className="app-main-inner">
          {screen === 'home'    && <HomePage />}
          {screen === 'study'   && <StudyPage />}
          {screen === 'quiz'    && <QuizPage />}
          {screen === 'ranking' && <RankingPage />}
          {screen === 'admin'   && <AdminPage />}
        </div>
      </main>

      {/* ── Bottom Navigation / サイドバー ── */}
      <nav className="bottom-nav">
        <p className="sidebar-navsec">menu</p>
        {NAV_TABS.map(({ id, label, Icon }) => {
          const active = screen === id;
          return (
            <button
              key={id}
              className={`nav-tab${active ? ' nav-tab-active' : ''}`}
              onClick={() => navigate(id)}
            >
              <Icon active={active} />
              <span className="nav-label">{label}</span>
              {id === 'study' && missionCount > 0 && (
                <span className="nav-study-badge">
                  {missionCount}/{MISSIONS.length}
                </span>
              )}
            </button>
          );
        })}
        <div className="sidebar-foot">
          <SidebarMiniCard userId={user.userId} />
        </div>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </UserProvider>
  );
}
