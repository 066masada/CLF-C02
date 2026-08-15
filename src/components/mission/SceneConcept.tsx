import type { ConceptScene } from '../../data/missions';

interface SceneConceptProps {
  scene: ConceptScene;
  isLastScene: boolean;
  onNext: () => void;
}

export const SceneConcept = ({ scene, isLastScene, onNext }: SceneConceptProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
    <div className="card">
      <div style={{
        padding: 'var(--s-3) var(--s-4)',
        background: 'var(--kg-paper-2)',
        borderRadius: 'var(--r-1)',
        borderLeft: '3px solid var(--kg-accent)',
      }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--kg-ink)', margin: '0 0 var(--s-2)' }}>
          {scene.term}
        </p>
        {scene.definition.split('\n').map((line, i) => (
          line === '' ? <br key={i} /> :
          <p key={i} style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', lineHeight: 1.75, margin: '0 0 var(--s-1)' }}>
            {line}
          </p>
        ))}
        {scene.diagram && (
          <pre style={{
            marginTop: 'var(--s-3)', padding: 'var(--s-3)',
            background: 'var(--kg-paper-3)', borderRadius: 'var(--r-1)',
            border: '1px solid var(--kg-rule)',
            fontSize: '0.6875rem', lineHeight: 1.75,
            fontFamily: '"Courier New", Courier, monospace',
            color: 'var(--kg-ink-2)', overflow: 'auto', whiteSpace: 'pre', margin: `var(--s-3) 0 0`,
          }}>
            {scene.diagram}
          </pre>
        )}
        {scene.examTip && (
          <div style={{
            marginTop: 'var(--s-3)', padding: 'var(--s-3)',
            background: 'var(--kg-wrong-bg)',
            borderLeft: '3px solid var(--kg-warn)',
            borderRadius: '0 var(--r-1) var(--r-1) 0',
          }}>
            <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.625rem', fontWeight: 700,
              letterSpacing: '0.08em', color: 'var(--kg-warn)', textTransform: 'uppercase',
              margin: '0 0 var(--s-1)' }}>
              exam tip
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink)', lineHeight: 1.7, margin: 0 }}>
              {scene.examTip}
            </p>
          </div>
        )}
      </div>
    </div>
    <button className="btn btn-primary" onClick={onNext} style={{ width: '100%' }}>
      {isLastScene ? 'ミッション完了 →' : '次のシーンへ →'}
    </button>
  </div>
);
