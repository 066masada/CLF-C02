import { useEffect, useRef } from 'react';
import { CHARACTERS } from '../../data/missions';
import { DialogueFAB } from './DialogueFAB';

interface SceneDialogueProps {
  lines: { speaker: string; text: string }[];
  lineIndex: number;
  playerName: string;
  isLastScene: boolean;
  isOutro?: boolean;
  onNext: () => void;
}

export const SceneDialogue = ({
  lines, lineIndex, playerName, isLastScene, isOutro = false, onNext,
}: SceneDialogueProps) => {
  const shownLines  = lines.slice(0, lineIndex + 1);
  const isLastLine  = lineIndex === lines.length - 1;
  const lastLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      lastLineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => cancelAnimationFrame(id);
  }, [lineIndex]);

  return (
    <div>
      <div className="card" style={{ minHeight: 180, paddingBottom: 'var(--s-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
          {shownLines.map((line, i) => {
            const char     = CHARACTERS[line.speaker];
            if (!char) return null;
            const isRight   = char.align === 'right';
            const isCurrent = i === shownLines.length - 1;
            return (
              <div
                key={i}
                ref={isCurrent ? lastLineRef : undefined}
                className={isCurrent ? 'dialogue-bubble-in' : undefined}
                style={{
                  display: 'flex', flexDirection: isRight ? 'row-reverse' : 'row',
                  gap: 'var(--s-2)', alignItems: 'flex-end',
                  transition: 'color 280ms ease',
                  scrollMarginBottom: isCurrent
                    ? 'calc(var(--nav-h) + env(safe-area-inset-bottom) + 72px)'
                    : undefined,
                }}
              >
                {/* モノグラムアバター */}
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isRight ? 'var(--kg-accent)' : 'var(--kg-paper-3)',
                    border: `1px solid ${isRight ? 'transparent' : 'var(--kg-rule)'}`,
                    color: isRight ? '#fff' : 'var(--kg-ink)',
                    fontFamily: 'var(--font-jp)', fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {char.initial}
                  </div>
                  <p style={{
                    fontSize: '0.625rem',
                    color: isCurrent ? 'var(--kg-ink-3)' : 'var(--kg-ink-4)',
                    margin: '2px 0 0', whiteSpace: 'nowrap',
                  }}>
                    {char.name.split(' ')[0]}
                  </p>
                </div>
                <div style={{
                  maxWidth: '75%', padding: 'var(--s-2) var(--s-3)',
                  borderRadius: isRight ? 'var(--r-2) 0 var(--r-2) var(--r-2)' : '0 var(--r-2) var(--r-2) var(--r-2)',
                  background: isRight ? 'var(--kg-paper-3)' : 'var(--kg-paper-2)',
                  border: '1px solid var(--kg-rule)',
                  fontSize: '0.875rem', lineHeight: 1.65,
                  color: isCurrent ? 'var(--kg-ink)' : 'var(--kg-ink-3)',
                  fontStyle: line.text.startsWith('（') ? 'italic' : 'normal',
                }}>
                  {line.text.replace(/○○/g, playerName)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DialogueFAB
        onClick={onNext}
        isLast={isLastLine}
        isOutro={isOutro && isLastScene}
        ariaLabel={isLastLine ? (isLastScene && isOutro ? 'マップに戻る' : '次のシーンへ') : '続きを読む'}
      />
    </div>
  );
};
