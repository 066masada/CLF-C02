import { useState } from 'react';
import { MISSIONS, isMissionAvailable } from '../../data/missions';
import type { Mission } from '../../data/missions';

interface MissionMapProps {
  completed: string[];
  onStart: (m: Mission) => void;
  onReset: () => void;
}

export const MissionMap = ({ completed, onStart, onReset }: MissionMapProps) => {
  const [audioMission, setAudioMission] = useState<Mission | null>(null);

  const firstAvailableIdx = MISSIONS.findIndex(
    (m, i) => !completed.includes(m.id) && isMissionAvailable(i, completed)
  );

  const handleReset = () => {
    if (window.confirm('ミッションの進捗をすべてリセットしますか？\nこの操作は取り消せません。')) {
      onReset();
    }
  };

  return (
    <>
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>

        <section>
          <p className="eyebrow">role play</p>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--s-4)' }}>
            <h2 style={{ margin: 0, color: 'var(--kg-ink)' }}>ロールプレイ学習</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
              <span style={{
                fontFamily: 'var(--font-en)', fontWeight: 700,
                fontSize: '0.9375rem', color: 'var(--kg-accent)', letterSpacing: '-0.01em',
              }}>
                {completed.length}<span style={{ fontWeight: 400, color: 'var(--kg-ink-3)', fontSize: '0.8125rem' }}> / {MISSIONS.length}</span>
              </span>
              {completed.length > 0 && (
                <button
                  onClick={handleReset}
                  style={{
                    background: 'none', border: '1px solid var(--kg-ink-3)',
                    borderRadius: 'var(--r-1)', padding: '0.2rem 0.6rem',
                    fontSize: '0.6875rem', color: 'var(--kg-ink-3)',
                    cursor: 'pointer', fontFamily: 'var(--font-en)', fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}
                >
                  reset
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="mission-grid-pc">
          {MISSIONS.map((m, idx) => {
            const done      = completed.includes(m.id);
            const available = isMissionAvailable(idx, completed);
            const isNow     = idx === firstAvailableIdx && !done;
            const isFinal   = m.id === 'mission-final';

            const stateClass = done
              ? ' mission-done'
              : isNow
              ? ' mission-now'
              : available
              ? ' mission-available'
              : ' mission-locked';

            return (
              <div
                key={m.id}
                className={`mission-card${stateClass}`}
                onClick={() => (isNow || available) && onStart(m)}
              >
                <div className={`mission-number${done ? ' done' : available ? ' active' : ' locked'}`}>
                  {done ? '✓' : isFinal ? '★' : m.number}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="tt" style={{
                    fontSize: '0.875rem', fontWeight: 700,
                    color: available ? 'var(--kg-ink)' : 'var(--kg-ink-3)',
                    margin: '0 0 2px', lineHeight: 1.4,
                  }}>
                    {m.title}
                  </p>
                  <p className="ss" style={{ fontSize: '0.75rem', color: 'var(--kg-ink-3)', margin: 0 }}>
                    {m.subtitle}
                  </p>
                </div>

                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {done ? (
                    <span style={{
                      fontFamily: 'var(--font-en)', fontSize: '0.75rem', fontWeight: 700,
                      color: 'var(--kg-success)', letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>done</span>
                  ) : isNow ? (
                    <span style={{
                      fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      border: '1px solid var(--kg-accent)',
                      borderRadius: 'var(--r-1)',
                      color: 'var(--kg-accent)',
                    }}>続きから →</span>
                  ) : available ? (
                    <span style={{
                      fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      border: '1px solid var(--kg-accent)',
                      borderRadius: 'var(--r-1)',
                      color: 'var(--kg-accent)',
                    }}>開始 →</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--kg-ink-3)' }}>
                      {idx > 0 ? `M${m.number - 1} クリアで解放` : '—'}
                    </span>
                  )}

                  {m.audioUrl && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setAudioMission(m); }}
                      style={{
                        background: 'none', border: '1px solid var(--kg-ink-3)',
                        borderRadius: 'var(--r-1)', padding: '0.15rem 0.5rem',
                        fontSize: '0.6875rem', color: 'var(--kg-ink-3)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
                      }}
                    >
                      🎧 音声
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 音声プレーヤー ボトムシート */}
      {audioMission && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-end',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setAudioMission(null)}
        >
          <div
            style={{
              width: '100%', maxWidth: 680, margin: '0 auto',
              background: 'var(--kg-paper)',
              borderRadius: 'var(--r-2) var(--r-2) 0 0',
              padding: 'var(--s-5) var(--s-4)',
              paddingBottom: 'calc(env(safe-area-inset-bottom) + var(--s-5))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s-4)' }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 2 }}>audio lecture</p>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--kg-ink)', fontSize: '1rem' }}>
                  M{audioMission.number} {audioMission.title}
                </p>
              </div>
              <button
                onClick={() => setAudioMission(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--kg-ink-3)', fontSize: '1.25rem', lineHeight: 1,
                }}
              >✕</button>
            </div>

            <iframe
              src={audioMission.audioUrl}
              style={{ width: '100%', height: 80, border: 'none', borderRadius: 'var(--r-1)' }}
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </>
  );
};
