import { useEffect, useRef } from 'react';
import { CHARACTERS } from '../../data/missions';
import type { Mission, DialogueLine } from '../../data/missions';
import type { Question } from '../../types/index';
import { DialogueFAB } from './DialogueFAB';

interface QuizState {
  index: number;
  selected: number | null;
  showAnswer: boolean;
  correctCount: number;
}

/* ── ダイアログフェーズ ── */
const DialoguePhase = ({
  lines, currentIndex, playerName, onNext, isLast, isOutro, mission, quiz,
}: {
  lines: DialogueLine[];
  currentIndex: number;
  playerName: string;
  onNext: () => void;
  isLast: boolean;
  isOutro: boolean;
  mission: Mission;
  quiz: QuizState;
}) => {
  const shownLines  = lines.slice(0, currentIndex + 1);
  const lastLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      lastLineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => cancelAnimationFrame(id);
  }, [currentIndex]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)', paddingBottom: 'var(--s-4)' }}>
        {isOutro && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 var(--s-2)', fontSize: '0.75rem', fontFamily: 'var(--font-en)',
              letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--kg-ink-3)' }}>
              mission complete
            </p>
            <p style={{ margin: '0 0 var(--s-3)', fontWeight: 700, fontSize: '1rem', color: 'var(--kg-accent)' }}>
              {mission.badge.label}
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-en)', fontWeight: 700,
              fontSize: '2rem', color: 'var(--kg-ink)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {quiz.correctCount}
              <span style={{ fontSize: '0.9375rem', fontWeight: 400, color: 'var(--kg-ink-3)', marginLeft: 'var(--s-2)' }}>
                / {quiz.index} 問正解
              </span>
            </p>
          </div>
        )}

        <div className="card" style={{ minHeight: 180 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
            {shownLines.map((line, i) => {
              const char      = CHARACTERS[line.speaker];
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
      </div>

      <DialogueFAB
        onClick={onNext}
        isLast={isLast}
        isOutro={isOutro}
        ariaLabel={isLast ? (isOutro ? 'マップに戻る' : '解説を読む') : '続きを読む'}
      />
    </div>
  );
};

/* ── コンセプトフェーズ ── */
const ConceptsPhase = ({ mission, onNext }: { mission: Mission; onNext: () => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
    <div className="card">
      <h3 style={{ marginBottom: 'var(--s-4)', fontSize: '0.9375rem', color: 'var(--kg-ink)' }}>
        このミッションで学ぶこと
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        {mission.concepts.map((c, i) => (
          <div key={i} style={{
            padding: 'var(--s-3) var(--s-4)', background: 'var(--kg-paper-2)',
            borderRadius: 'var(--r-1)', borderLeft: '3px solid var(--kg-accent)',
          }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--kg-ink)', margin: '0 0 var(--s-1)' }}>
              {c.term}
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', lineHeight: 1.65, margin: 0 }}>
              {c.definition}
            </p>
            {c.diagram && (
              <pre style={{
                marginTop: 'var(--s-3)', padding: 'var(--s-3)',
                background: 'var(--kg-paper-3)', borderRadius: 'var(--r-1)',
                border: '1px solid var(--kg-rule)', fontSize: '0.6875rem', lineHeight: 1.75,
                fontFamily: '"Courier New", Courier, monospace', color: 'var(--kg-ink-2)',
                overflow: 'auto', whiteSpace: 'pre', margin: `var(--s-3) 0 0`,
              }}>
                {c.diagram}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
    <button className="btn btn-primary" onClick={onNext} style={{ width: '100%' }}>
      確認テストへ →
    </button>
  </div>
);

/* ── クイズフェーズ ── */
const QuizPhase = ({
  question, questionIndex, totalQuestions, selected, showAnswer, onSelect, onNext,
}: {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selected: number | null;
  showAnswer: boolean;
  onSelect: (idx: number) => void;
  onNext: () => void;
}) => {
  const isLast = questionIndex === totalQuestions - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-en)', color: 'var(--kg-ink-3)' }}>
          確認テスト {questionIndex + 1} / {totalQuestions}
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill"
          style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }} />
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--s-4)', fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--kg-ink)' }}>
          {question.question}
        </h3>
        <div>
          {question.options.map((opt, idx) => {
            const isCorrect  = idx === question.correctAnswer;
            const isSelected = idx === selected;
            let optClass = 'option-item';
            if (showAnswer) {
              if (isCorrect)       optClass += ' option-correct';
              else if (isSelected) optClass += ' option-wrong';
            } else if (isSelected) {
              optClass += ' selected';
            }
            return (
              <div key={idx} className={optClass}
                style={{ cursor: showAnswer ? 'default' : 'pointer' }}
                onClick={() => !showAnswer && onSelect(idx)}>
                <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                <span style={{ flex: 1, color: 'var(--kg-ink)' }}>{opt}</span>
                {showAnswer && isCorrect  && <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--kg-success)', flexShrink: 0 }}>✓</span>}
                {showAnswer && isSelected && !isCorrect && <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--kg-error)', flexShrink: 0 }}>✗</span>}
              </div>
            );
          })}
        </div>
        {showAnswer && (
          <div style={{
            marginTop: 'var(--s-4)', padding: 'var(--s-3) var(--s-4)',
            background: 'var(--kg-paper-2)', borderLeft: '3px solid var(--kg-accent)',
            borderRadius: '0 var(--r-1) var(--r-1) 0',
          }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', lineHeight: 1.7, margin: 0 }}>
              {question.explanation}
            </p>
          </div>
        )}
        {showAnswer && (
          <button className="btn btn-primary" onClick={onNext} style={{ width: '100%', marginTop: 'var(--s-4)' }}>
            {isLast ? '結果を見る →' : '次の問題 →'}
          </button>
        )}
      </div>
    </div>
  );
};

/* ── メインエクスポート ── */
type Phase = 'intro' | 'concepts' | 'quiz' | 'complete';
const PHASE_LABELS = ['シナリオ', '解説', 'テスト', '完了'] as const;

interface MissionPlayerProps {
  mission: Mission;
  phase: Phase;
  dialogueIndex: number;
  quiz: QuizState;
  questions: Question[];
  playerName: string;
  onNextDialogue: () => void;
  onEndDialogue: () => void;
  onEndConcepts: () => void;
  onSelectAnswer: (idx: number) => void;
  onNextQuestion: () => void;
  onBackToMap: () => void;
}

export const MissionPlayer = ({
  mission, phase, dialogueIndex, quiz, questions, playerName,
  onNextDialogue, onEndDialogue, onEndConcepts,
  onSelectAnswer, onNextQuestion, onBackToMap,
}: MissionPlayerProps) => {
  const currentDialogue = phase === 'intro' ? mission.intro : mission.outro;
  const phaseIndex = phase === 'intro' ? 1 : phase === 'concepts' ? 2 : phase === 'quiz' ? 3 : 4;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)' }}>
        <button className="btn" onClick={onBackToMap} style={{
          padding: '0.375rem 0.75rem', fontSize: '0.8125rem', flexShrink: 0,
          border: '1px solid var(--kg-rule)', background: 'var(--kg-paper)',
          color: 'var(--kg-ink-2)', borderRadius: 'var(--r-1)',
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
          {phaseIndex}/4
        </p>
      </div>

      {/* フェーズインジケーター */}
      <div style={{ display: 'flex', gap: 'var(--s-1)' }}>
        {PHASE_LABELS.map((label, i) => (
          <div key={label} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < phaseIndex ? 'var(--kg-accent)' : 'var(--kg-rule)',
            transition: `background var(--dur-med) var(--ease-out)`,
          }} />
        ))}
      </div>

      {(phase === 'intro' || phase === 'complete') && (
        <DialoguePhase
          lines={currentDialogue}
          currentIndex={dialogueIndex}
          playerName={playerName}
          onNext={() => {
            if (dialogueIndex + 1 < currentDialogue.length) onNextDialogue();
            else if (phase === 'intro') onEndDialogue();
            else onBackToMap();
          }}
          isLast={dialogueIndex === currentDialogue.length - 1}
          isOutro={phase === 'complete'}
          mission={mission}
          quiz={quiz}
        />
      )}
      {phase === 'concepts' && <ConceptsPhase mission={mission} onNext={onEndConcepts} />}
      {phase === 'quiz' && questions.length > 0 && (
        <QuizPhase
          question={questions[quiz.index]}
          questionIndex={quiz.index}
          totalQuestions={questions.length}
          selected={quiz.selected}
          showAnswer={quiz.showAnswer}
          onSelect={onSelectAnswer}
          onNext={onNextQuestion}
        />
      )}
    </div>
  );
};
