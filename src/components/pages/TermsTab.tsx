import { useState, useCallback } from 'react';
import { glossaryTerms, glossaryCategoryLabels } from '../../data/glossary';
import type { GlossaryCategory } from '../../data/glossary';

type Phase = 'setup' | 'studying' | 'complete';

const IMPORTANCE_COLOR: Record<string, string> = {
  A: 'var(--kg-error)',
  B: 'var(--kg-warn)',
  C: 'var(--kg-success)',
};

const ALL_CATEGORIES: { value: GlossaryCategory | 'all'; label: string }[] = [
  { value: 'all',       label: 'すべて' },
  { value: 'ai-ml',    label: glossaryCategoryLabels['ai-ml'] },
  { value: 'generative', label: glossaryCategoryLabels['generative'] },
  { value: 'aws',      label: glossaryCategoryLabels['aws'] },
  { value: 'ethics',   label: glossaryCategoryLabels['ethics'] },
  { value: 'security', label: glossaryCategoryLabels['security'] },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const TermsTab = () => {
  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [deck, setDeck] = useState<typeof glossaryTerms>([]);
  const [, setKnownCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  const currentCard = deck[0] ?? null;

  const startStudying = useCallback(() => {
    const pool = selectedCategory === 'all'
      ? glossaryTerms
      : glossaryTerms.filter((t) => t.category === selectedCategory);
    const shuffled = shuffle(pool);
    setDeck(shuffled);
    setKnownCount(0);
    setTotalCount(shuffled.length);
    setIsFlipped(false);
    setPhase('studying');
  }, [selectedCategory]);

  const advance = useCallback((known: boolean) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setDeck((prev) => {
        if (known) {
          const next = prev.slice(1);
          if (next.length === 0) setPhase('complete');
          return next;
        } else {
          const [first, ...rest] = prev;
          return [...rest, first];
        }
      });
      if (known) setKnownCount((c) => c + 1);
      setIsFlipped(false);
      setAnimating(false);
    }, 200);
  }, [animating]);

  const handleFlip = () => {
    if (!isFlipped && !animating) setIsFlipped(true);
  };

  const handleRestart = () => {
    setPhase('setup');
    setDeck([]);
    setKnownCount(0);
    setIsFlipped(false);
  };

  /* ── Setup ── */
  if (phase === 'setup') {
    const countForCategory = selectedCategory === 'all'
      ? glossaryTerms.length
      : glossaryTerms.filter((t) => t.category === selectedCategory).length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-5)' }}>
        <div>
          <p className="eyebrow">flashcard mode</p>
          <h2 style={{ margin: '0 0 var(--s-2)', color: 'var(--kg-ink)' }}>用語フラッシュカード</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-3)', margin: 0, lineHeight: 1.7 }}>
            カードをタップして定義を確認し、「覚えた」か「もう一度」を選択します。<br />
            全カードを「覚えた」にするとセッション完了です。
          </p>
        </div>

        <div>
          <p style={{
            fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
            letterSpacing: '0.08em', color: 'var(--kg-ink-3)', textTransform: 'uppercase',
            margin: '0 0 var(--s-2)',
          }}>
            カテゴリ
          </p>
          <div className="chip-scroll">
            {ALL_CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                className={`chip${selectedCategory === value ? ' chip-active' : ''}`}
                onClick={() => setSelectedCategory(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          padding: 'var(--s-4)',
          border: '1px solid var(--kg-rule)',
          borderRadius: 'var(--r-2)',
          background: 'var(--kg-paper-2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <p style={{ margin: '0 0 var(--s-1)', fontSize: '0.75rem', color: 'var(--kg-ink-3)' }}>
              {selectedCategory === 'all' ? 'すべてのカテゴリ' : glossaryCategoryLabels[selectedCategory as GlossaryCategory]}
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--kg-ink)' }}>
              {countForCategory}
              <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--kg-ink-3)', marginLeft: 4 }}>枚</span>
            </p>
          </div>
          <button className="btn btn-primary" onClick={startStudying} style={{ minWidth: 100 }}>
            スタート →
          </button>
        </div>

        {/* 重要度凡例 */}
        <div>
          <p style={{
            fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
            letterSpacing: '0.08em', color: 'var(--kg-ink-3)', textTransform: 'uppercase',
            margin: '0 0 var(--s-2)',
          }}>
            重要度の見方
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            {(['A', 'B', 'C'] as const).map((imp) => {
              const labels: Record<string, string> = { A: '最重要 — 試験に頻出', B: '重要 — しっかり理解', C: '参考 — 余裕があれば' };
              return (
                <div key={imp} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)' }}>
                  <span style={{
                    fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '0.75rem',
                    color: IMPORTANCE_COLOR[imp], minWidth: 16, textAlign: 'center',
                  }}>{imp}</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)' }}>{labels[imp]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── Complete ── */
  if (phase === 'complete') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s-5)', paddingTop: 'var(--s-6)' }}>
        <div style={{ fontSize: '3rem', lineHeight: 1 }}>🎉</div>
        <div style={{ textAlign: 'center' }}>
          <p className="eyebrow">complete</p>
          <h2 style={{ margin: '0 0 var(--s-2)', color: 'var(--kg-ink)' }}>セッション完了！</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--kg-ink-2)', margin: 0 }}>
            全 {totalCount} 枚のカードを覚えました。
          </p>
        </div>

        <div style={{
          width: '100%', padding: 'var(--s-4)',
          border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-2)',
          background: 'var(--kg-paper-2)', textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-en)', fontSize: '2.5rem', fontWeight: 700,
            color: 'var(--kg-success)', margin: '0 0 var(--s-1)',
          }}>
            {totalCount}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-3)', margin: 0 }}>
            枚覚えた
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', width: '100%' }}>
          <button className="btn btn-primary" onClick={startStudying}>
            もう一度（シャッフル）
          </button>
          <button className="btn btn-secondary" onClick={handleRestart}>
            カテゴリ選択に戻る
          </button>
        </div>
      </div>
    );
  }

  /* ── Studying ── */
  const remaining = deck.length;
  const known = totalCount - remaining;
  const progress = (known / totalCount) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
      {/* プログレス */}
      <div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 'var(--s-1)',
        }}>
          <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.75rem', color: 'var(--kg-ink-3)' }}>
            覚えた {known} / {totalCount}
          </span>
          <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.75rem', color: 'var(--kg-ink-3)' }}>
            残り {remaining} 枚
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              background: 'var(--kg-success)',
              transition: 'width 0.3s var(--ease-out)',
            }}
          />
        </div>
      </div>

      {/* カード */}
      {currentCard && (
        <div
          onClick={handleFlip}
          style={{
            minHeight: 260,
            border: isFlipped ? '1px solid var(--kg-rule)' : '2px solid var(--kg-accent)',
            borderRadius: 'var(--r-2)',
            background: isFlipped ? 'var(--kg-paper-2)' : 'var(--kg-paper)',
            padding: 'var(--s-5) var(--s-4)',
            cursor: isFlipped ? 'default' : 'pointer',
            display: 'flex', flexDirection: 'column', gap: 'var(--s-3)',
            opacity: animating ? 0 : 1,
            transform: animating ? 'scale(0.97)' : 'scale(1)',
            transition: 'opacity 0.2s ease, transform 0.2s ease, border-color 0.15s ease, background 0.15s ease',
            userSelect: 'none', WebkitUserSelect: 'none',
          }}
        >
          {/* バッジ行 */}
          <div style={{ display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-en)', fontSize: '0.625rem', fontWeight: 700,
              padding: '0.15rem 0.4rem', borderRadius: 'var(--r-1)',
              color: 'var(--kg-accent)', background: 'var(--kg-selected-bg)',
              border: '1px solid var(--kg-accent)',
            }}>
              {glossaryCategoryLabels[currentCard.category]}
            </span>
            <span style={{
              fontFamily: 'var(--font-en)', fontSize: '0.625rem', fontWeight: 700,
              padding: '0.15rem 0.4rem', borderRadius: 'var(--r-1)',
              color: IMPORTANCE_COLOR[currentCard.importance],
              border: `1px solid ${IMPORTANCE_COLOR[currentCard.importance]}`,
            }}>
              重要度 {currentCard.importance}
            </span>
          </div>

          {/* 表面：用語 */}
          {!isFlipped ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 'var(--s-2)' }}>
              <p style={{
                fontFamily: 'var(--font-jp)', fontWeight: 700, fontSize: '1.5rem',
                color: 'var(--kg-ink)', margin: 0, lineHeight: 1.4,
              }}>
                {currentCard.term}
              </p>
              {currentCard.reading && (
                <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.8125rem', color: 'var(--kg-ink-3)', margin: 0 }}>
                  {currentCard.reading}
                </p>
              )}
              <p style={{
                fontSize: '0.75rem', color: 'var(--kg-accent-soft)',
                margin: 'var(--s-3) 0 0', fontFamily: 'var(--font-en)',
                letterSpacing: '0.04em',
              }}>
                tap to reveal →
              </p>
            </div>
          ) : (
            /* 裏面：定義 */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              <p style={{
                fontFamily: 'var(--font-jp)', fontWeight: 700, fontSize: '1rem',
                color: 'var(--kg-ink)', margin: 0,
              }}>
                {currentCard.term}
              </p>
              <hr style={{ border: 'none', borderTop: '1px solid var(--kg-rule)', margin: 0 }} />
              <p style={{
                fontFamily: 'var(--font-jp)', fontSize: '0.9375rem',
                color: 'var(--kg-ink-2)', margin: 0, lineHeight: 1.75,
              }}>
                {currentCard.definition}
              </p>
              {currentCard.supplement && (
                <p style={{
                  fontSize: '0.8125rem', color: 'var(--kg-ink-3)',
                  margin: 0, lineHeight: 1.65,
                  borderLeft: '2px solid var(--kg-rule)',
                  paddingLeft: 'var(--s-3)',
                }}>
                  {currentCard.supplement}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ボタン */}
      {isFlipped && currentCard && (
        <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => advance(false)}
            disabled={animating}
            style={{ flex: 1 }}
          >
            ↩ もう一度
          </button>
          <button
            className="btn btn-primary"
            onClick={() => advance(true)}
            disabled={animating}
            style={{ flex: 1, background: 'var(--kg-success)', borderColor: 'var(--kg-success)' }}
          >
            覚えた ✓
          </button>
        </div>
      )}

      {/* 終了ボタン */}
      <button
        className="btn btn-secondary"
        onClick={handleRestart}
        style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-3)', marginTop: 'var(--s-1)' }}
      >
        ← カテゴリ選択に戻る
      </button>
    </div>
  );
};
