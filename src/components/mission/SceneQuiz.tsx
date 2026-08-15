import type { QuizScene } from '../../data/missions';

interface SceneQuizProps {
  scene: QuizScene;
  selected: number | null;
  showAnswer: boolean;
  isLastScene: boolean;
  onSelect: (idx: number) => void;
  onNext: () => void;
}

export const SceneQuiz = ({
  scene, selected, showAnswer, isLastScene, onSelect, onNext,
}: SceneQuizProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
    <div className="card">
      <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
        letterSpacing: '0.08em', color: 'var(--kg-accent)', textTransform: 'uppercase',
        margin: '0 0 var(--s-3)' }}>
        mini quiz
      </p>
      <h3 style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--kg-ink)', margin: '0 0 var(--s-4)' }}>
        {scene.question}
      </h3>
      <div>
        {scene.options.map((opt, idx) => {
          const isCorrect  = idx === scene.answer;
          const isSelected = idx === selected;
          let optClass = 'option-item';
          if (showAnswer) {
            if (isCorrect)       optClass += ' option-correct';
            else if (isSelected) optClass += ' option-wrong';
          } else if (isSelected) {
            optClass += ' selected';
          }
          return (
            <div
              key={idx}
              className={optClass}
              style={{ cursor: showAnswer ? 'default' : 'pointer' }}
              onClick={() => !showAnswer && onSelect(idx)}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
              <span style={{ flex: 1, color: 'var(--kg-ink)' }}>{opt}</span>
              {showAnswer && isCorrect   && <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--kg-success)', flexShrink: 0 }}>✓</span>}
              {showAnswer && isSelected && !isCorrect && <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--kg-error)', flexShrink: 0 }}>✗</span>}
            </div>
          );
        })}
      </div>
      {showAnswer && (
        <>
          <div style={{
            marginTop: 'var(--s-4)', padding: 'var(--s-3) var(--s-4)',
            background: 'var(--kg-paper-2)',
            borderLeft: '3px solid var(--kg-accent)',
            borderRadius: '0 var(--r-1) var(--r-1) 0',
          }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', lineHeight: 1.7, margin: 0 }}>
              {scene.explanation}
            </p>
          </div>
          <button className="btn btn-primary" onClick={onNext} style={{ width: '100%', marginTop: 'var(--s-4)' }}>
            {isLastScene ? 'ミッション完了 →' : '次のシーンへ →'}
          </button>
        </>
      )}
    </div>
  </div>
);
