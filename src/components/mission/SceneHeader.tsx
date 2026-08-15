import type { Mission } from '../../data/missions';

interface SceneHeaderProps {
  mission: Mission;
  sceneIndex: number;
  total: number;
  onBack: () => void;
}

export const SceneHeader = ({ mission, sceneIndex, total, onBack }: SceneHeaderProps) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
      <button onClick={onBack} style={{
        padding: '0.375rem 0.75rem', fontSize: '0.8125rem', flexShrink: 0,
        border: '1px solid var(--kg-rule)', background: 'var(--kg-paper)',
        color: 'var(--kg-ink-2)', borderRadius: 'var(--r-1)', cursor: 'pointer',
      }}>
        ← マップ
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-en)', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--kg-ink-3)', margin: '0 0 2px' }}>
          MISSION {mission.number}
        </p>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--kg-ink)',
          margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {mission.title}
        </p>
      </div>
      <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-en)', color: 'var(--kg-ink-3)', flexShrink: 0 }}>
        {Math.min(sceneIndex + 1, total)}/{total}
      </p>
    </div>
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i <= sceneIndex ? 'var(--kg-accent)' : 'var(--kg-rule)',
          transition: 'background var(--dur-med) var(--ease-out)',
        }} />
      ))}
    </div>
  </>
);
