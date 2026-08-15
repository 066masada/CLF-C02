import { useState } from 'react';
import { categoryLabels } from '../data/clf-c02-questions';
import type { QuestionCategory, QuizSession } from '../types/index';

const CATEGORY_ORDER: QuestionCategory[] = ['cloud-concepts', 'security-compliance', 'cloud-technology', 'billing-support'];
const PAGE_SIZE = 8;

const labelFor = (cat: QuestionCategory | 'mixed'): string =>
  cat === 'mixed' ? '全カテゴリ混合' : (categoryLabels[cat] ?? cat);

const accuracyTier = (accuracy: number): 'good' | 'mid' | 'bad' =>
  accuracy >= 80 ? 'good' : accuracy >= 50 ? 'mid' : 'bad';

const tierColor = (tier: 'good' | 'mid' | 'bad'): string =>
  tier === 'good' ? 'var(--kg-success)' : tier === 'mid' ? 'var(--kg-warn)' : 'var(--kg-error)';

const startOfDay = (ts: number): number => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const formatGroupLabel = (ts: number): string => {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.round((startOfDay(now.getTime()) - startOfDay(ts)) / 86400000);
  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  const sameYear = d.getFullYear() === now.getFullYear();
  return sameYear
    ? `${d.getMonth() + 1}月${d.getDate()}日`
    : `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const formatTimeOfDay = (ts: number): string => {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

interface HistoryTimelineProps {
  sessions: QuizSession[] | null;
  onRetryQuestions: (questionIds: string[]) => void;
}

export const HistoryTimeline = ({ sessions, onRetryQuestions }: HistoryTimelineProps) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // カテゴリ切替時にページングをリセット（レンダー中の状態調整、effect は使わない）
  const [pagedCategory, setPagedCategory] = useState(selectedCategory);
  if (pagedCategory !== selectedCategory) {
    setPagedCategory(selectedCategory);
    setVisibleCount(PAGE_SIZE);
  }

  if (sessions === null) {
    return (
      <section>
        <p className="eyebrow">history</p>
        <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>学習履歴</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: 52, borderRadius: 'var(--r-1)' }} />
          ))}
        </div>
      </section>
    );
  }

  if (sessions.length === 0) return null;

  const sorted = [...sessions].sort((a, b) => b.timestamp - a.timestamp);
  const filtered = selectedCategory === 'all'
    ? sorted
    : sorted.filter((s) => s.category === selectedCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visible.length;

  const groups: { label: string; items: QuizSession[] }[] = [];
  for (const session of visible) {
    const label = formatGroupLabel(session.timestamp);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(session);
    } else {
      groups.push({ label, items: [session] });
    }
  }

  return (
    <section>
      <p className="eyebrow">history</p>
      <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>学習履歴</h2>

      <div className="chip-scroll" style={{ marginBottom: 'var(--s-4)' }}>
        <button
          className={`chip${selectedCategory === 'all' ? ' chip-active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          すべて
        </button>
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            className={`chip${selectedCategory === cat ? ' chip-active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--kg-ink-3)' }}>
            このカテゴリの記録はまだありません
          </p>
        </div>
      ) : (
        <>
          {groups.map((group) => (
            <div key={group.label} style={{ marginBottom: 'var(--s-4)' }}>
              <p style={{
                fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
                letterSpacing: '0.04em', color: 'var(--kg-ink-3)', margin: '0 0 var(--s-2) 2px',
              }}>
                {group.label}
              </p>
              <ul className="history-list">
                {group.items.map((session) => {
                  const tier = accuracyTier(session.accuracy);
                  const isOpen = expandedId === session.sessionId;
                  const wrongCount = session.answers.filter((a) => !a.correct).length;
                  return (
                    <li key={session.sessionId} className="history-item">
                      <span className={`history-dot history-dot-${tier}`} />
                      <button
                        className="history-card"
                        aria-expanded={isOpen}
                        onClick={() => setExpandedId(isOpen ? null : session.sessionId)}
                      >
                        <span style={{
                          fontFamily: 'var(--font-en)', fontVariantNumeric: 'tabular-nums',
                          fontSize: '0.75rem', color: 'var(--kg-ink-4)', flexShrink: 0, width: 38,
                        }}>
                          {formatTimeOfDay(session.timestamp)}
                        </span>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 600, color: 'var(--kg-ink-2)',
                          background: 'var(--kg-paper-3)', border: '1px solid var(--kg-rule)',
                          borderRadius: 'var(--r-1)', padding: '2px 7px', flexShrink: 0,
                        }}>
                          {labelFor(session.category)}
                        </span>
                        <span style={{ marginLeft: 'auto', textAlign: 'right', flexShrink: 0 }}>
                          <span style={{
                            fontFamily: 'var(--font-en)', fontVariantNumeric: 'tabular-nums',
                            fontSize: '0.8125rem', fontWeight: 700, color: 'var(--kg-ink)',
                          }}>
                            {session.score}/{session.total}
                          </span>
                          <span style={{
                            display: 'block', fontFamily: 'var(--font-en)', fontVariantNumeric: 'tabular-nums',
                            fontSize: '0.6875rem', fontWeight: 700, color: tierColor(tier), marginTop: 1,
                          }}>
                            {session.accuracy}%
                          </span>
                        </span>
                        <span style={{
                          flexShrink: 0, color: 'var(--kg-ink-4)', fontSize: '0.75rem',
                          transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 200ms ease',
                        }}>
                          ›
                        </span>
                      </button>

                      {isOpen && (
                        <div className="history-detail">
                          <p style={{ margin: '0 0 var(--s-2)', fontSize: '0.6875rem', color: 'var(--kg-ink-3)' }}>
                            正誤の内訳（緑＝正解 / 赤＝不正解）
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 'var(--s-3)' }}>
                            {session.answers.map((a, i) => (
                              <span key={`${a.questionId}-${i}`} style={{
                                width: 20, height: 20, borderRadius: 'var(--r-1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.6875rem', fontWeight: 700, fontFamily: 'var(--font-en)',
                                background: a.correct ? 'var(--kg-correct-bg)' : 'var(--kg-wrong-bg)',
                                color: a.correct ? 'var(--kg-success)' : 'var(--kg-error)',
                                border: a.correct ? 'none' : '1px solid var(--kg-error)',
                              }}>
                                {a.correct ? '✓' : '✕'}
                              </span>
                            ))}
                          </div>
                          {wrongCount > 0 && (
                            <button
                              className="btn btn-primary"
                              style={{ width: '100%' }}
                              onClick={() => onRetryQuestions(
                                session.answers.filter((a) => !a.correct).map((a) => a.questionId)
                              )}
                            >
                              不正解 {wrongCount} 問を解き直す →
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {hasMore && (
            <button
              className="btn btn-ghost"
              style={{ width: '100%', borderStyle: 'dashed', color: 'var(--kg-ink-3)' }}
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            >
              もっと見る（過去の記録を表示）
            </button>
          )}
        </>
      )}
    </section>
  );
};
