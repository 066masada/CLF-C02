import { useEffect, useState } from 'react';
import { fetchLeaderboard, fetchUserStats } from '../../hooks/useFirebase';
import { calculatePassProbability, getExamTitle } from '../../utils';
import { useUser } from '../../contexts/UserContext';
import type { UserStats } from '../../types/index';

interface BoardEntry {
  stats: UserStats;
  prob: number;
}

const titleColor = (label: string): string => {
  if (label === '合格確実' || label === '合格圏内') return 'var(--kg-success)';
  if (label === '中級者') return 'var(--kg-warn)';
  return 'var(--kg-ink-3)';
};

export const RankingPage = () => {
  const { user } = useUser();
  const [myStats, setMyStats] = useState<UserStats | null>(null);
  const [board, setBoard] = useState<BoardEntry[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [boardData, userData] = await Promise.all([
        fetchLeaderboard(),
        user ? fetchUserStats(user.userId) : Promise.resolve(null),
      ]);
      if (!mounted) return;

      // 確率を一度だけ計算してからソート
      const entries: BoardEntry[] = boardData
        .map((s) => ({ stats: s, prob: calculatePassProbability(s) }))
        .sort((a, b) => b.prob - a.prob);

      setBoard(entries);
      setMyStats(userData);
    })();
    return () => { mounted = false; };
  }, [user]);

  const myPassProb = myStats ? calculatePassProbability(myStats) : 0;
  const myTitle    = getExamTitle(myPassProb, myStats?.totalAnswered ?? 0);
  const myRank     = board?.findIndex((e) => e.stats.userId === user?.userId) ?? -1;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>

      {/* ── 自分のステータス ── */}
      <section>
        <p className="eyebrow">your rank</p>
        <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>あなたの実力</h2>

        <div className="card">
          {board === null ? (
            /* ステータスカード スケルトン */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--s-3) var(--s-4)',
                border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)', background: 'var(--kg-paper-2)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-1)' }}>
                  <div className="skeleton" style={{ width: 24, height: 10 }} />
                  <div className="skeleton" style={{ width: 60, height: 20 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-1)', alignItems: 'flex-end' }}>
                  <div className="skeleton" style={{ width: 24, height: 10 }} />
                  <div className="skeleton" style={{ width: 40, height: 20 }} />
                </div>
              </div>
              <div>
                <div className="skeleton" style={{ height: 8, borderRadius: 4 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--s-2)' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ padding: 'var(--s-3)', border: '1px solid var(--kg-rule)',
                    borderRadius: 'var(--r-1)', display: 'flex', flexDirection: 'column', gap: 'var(--s-1)', alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: 40, height: 22 }} />
                    <div className="skeleton" style={{ width: 32, height: 11 }} />
                  </div>
                ))}
              </div>
            </div>
          ) : myStats ? (
            <>
              {/* 称号 + 順位 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--s-3) var(--s-4)',
                background: 'var(--kg-paper-2)',
                borderRadius: 'var(--r-1)',
                border: '1px solid var(--kg-rule)',
                marginBottom: 'var(--s-4)',
              }}>
                <div>
                  <p style={{ margin: '0 0 var(--s-1)', fontSize: '0.75rem',
                    color: 'var(--kg-ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-en)' }}>
                    称号
                  </p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem',
                    color: titleColor(myTitle.label) }}>
                    {myTitle.label}
                  </p>
                </div>
                {myRank >= 0 && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 var(--s-1)', fontSize: '0.75rem',
                      color: 'var(--kg-ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase',
                      fontFamily: 'var(--font-en)' }}>
                      順位
                    </p>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem',
                      fontFamily: 'var(--font-en)', color: 'var(--kg-ink)', letterSpacing: '-0.02em' }}>
                      #{myRank + 1}
                    </p>
                  </div>
                )}
              </div>

              {/* 合格確率ゲージ */}
              <div style={{ marginBottom: 'var(--s-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'baseline', marginBottom: 'var(--s-2)' }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--kg-ink-3)' }}>
                    推定合格確率
                  </p>
                  <span style={{ fontFamily: 'var(--font-en)', fontWeight: 700,
                    fontSize: '1.75rem', color: 'var(--kg-accent)', lineHeight: 1,
                    letterSpacing: '-0.02em' }}>
                    {myPassProb}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${myPassProb}%` }} />
                </div>
                <p style={{ margin: 'var(--s-1) 0 0', fontSize: '0.75rem',
                  color: 'var(--kg-ink-4)', textAlign: 'right' }}>
                  合格ライン 70%
                </p>
              </div>

              {/* 統計グリッド */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--s-2)' }}>
                {[
                  { label: '解答数', value: myStats.totalAnswered },
                  { label: '正解数', value: myStats.totalCorrect },
                  { label: '試験回数', value: myStats.sessionCount },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    textAlign: 'center',
                    padding: 'var(--s-3) var(--s-2)',
                    background: 'var(--kg-paper-2)',
                    borderRadius: 'var(--r-1)',
                    border: '1px solid var(--kg-rule)',
                  }}>
                    <p style={{ margin: '0 0 var(--s-1)', fontFamily: 'var(--font-en)',
                      fontWeight: 700, fontSize: '1.375rem', color: 'var(--kg-ink)',
                      lineHeight: 1, letterSpacing: '-0.02em' }}>
                      {value}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--kg-ink-3)' }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              padding: 'var(--s-6) var(--s-4)',
              border: '1px dashed var(--kg-rule)',
              borderRadius: 'var(--r-1)',
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, color: 'var(--kg-ink-3)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                試験に挑戦するとここに実力が表示されます
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── ランキング ── */}
      <section>
        <p className="eyebrow">leaderboard</p>
        <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>ランキング</h2>

        {board === null ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            {[80, 65, 72, 55, 68].map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', padding: 'var(--s-3)' }}>
                <div className="skeleton" style={{ width: 28, height: 18, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--s-1)' }}>
                  <div className="skeleton" style={{ height: 14, width: `${w}%` }} />
                  <div className="skeleton" style={{ height: 11, width: '40%' }} />
                </div>
                <div className="skeleton" style={{ width: 36, height: 20, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        ) : board.length === 0 ? (
          <div className="card">
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--kg-ink-3)' }}>
              まだ記録がありません。試験に挑戦しましょう！
            </p>
          </div>
        ) : (
          <>
            {/* PC ワイドテーブル */}
            <div className="ranking-table-pc">
              {/* ヘッダー行 */}
              <div className="ranking-row-pc ranking-row-head">
                {['順位', 'ユーザー', 'ランク', '累計問', '試験回', '推定合格確率'].map((h) => (
                  <span key={h} style={{
                    fontFamily: 'var(--font-en)', fontSize: '0.6875rem',
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--kg-ink-3)',
                  }}>{h}</span>
                ))}
              </div>
              {board.slice(0, 20).map(({ stats: s, prob }, idx) => {
                const title = getExamTitle(prob, s.totalAnswered);
                const isMe  = s.userId === user?.userId;
                return (
                  <div key={s.userId} className={`ranking-row-pc${isMe ? ' row-highlight' : ''}`}>
                    <span style={{
                      fontFamily: 'var(--font-en)', fontWeight: 700,
                      fontSize: idx === 0 ? '1.1875rem' : '1rem',
                      color: idx === 0 ? 'var(--kg-warn)' : 'var(--kg-ink-4)',
                    }}>
                      #{idx + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', minWidth: 0 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isMe ? 'var(--kg-accent)' : 'var(--kg-paper-3)',
                        border: `1px solid ${isMe ? 'var(--kg-accent)' : 'var(--kg-rule)'}`,
                        fontFamily: 'var(--font-en)', fontSize: '0.8125rem', fontWeight: 700,
                        color: isMe ? '#fff' : 'var(--kg-ink)',
                      }}>
                        {(s.displayName ?? '?').slice(0, 2)}
                      </div>
                      <span style={{
                        fontSize: '0.9375rem', fontWeight: isMe ? 700 : 500,
                        color: 'var(--kg-ink)', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {s.displayName}{isMe ? ' (あなた)' : ''}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: titleColor(title.label) }}>{title.label}</span>
                    <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.875rem', color: 'var(--kg-ink-2)' }}>
                      {s.totalAnswered}
                    </span>
                    <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.875rem', color: 'var(--kg-ink-2)' }}>
                      {s.sessionCount}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-bar-fill" style={{ width: `${prob}%` }} />
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-en)', fontWeight: 700,
                        fontSize: '0.875rem', color: 'var(--kg-accent)', width: 38, textAlign: 'right',
                      }}>
                        {prob}%
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* 圏外時の自分行 (PC テーブル) */}
              {myRank >= 20 && user && myStats && (
                <>
                  <div style={{
                    textAlign: 'center', fontSize: '0.875rem',
                    color: 'var(--kg-ink-4)', letterSpacing: '0.3em', padding: 'var(--s-2) 0',
                    borderBottom: '1px solid var(--kg-rule-soft)',
                  }}>···</div>
                  <div className="ranking-row-pc row-highlight">
                    <span style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '1rem', color: 'var(--kg-ink-4)' }}>
                      #{myRank + 1}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', minWidth: 0 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--kg-accent)', border: 'none',
                        fontFamily: 'var(--font-en)', fontSize: '0.8125rem', fontWeight: 700, color: '#fff',
                      }}>
                        {(myStats.displayName ?? '?').slice(0, 2)}
                      </div>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--kg-ink)' }}>
                        {myStats.displayName} (あなた)
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: titleColor(myTitle.label) }}>{myTitle.label}</span>
                    <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.875rem', color: 'var(--kg-ink-2)' }}>
                      {myStats.totalAnswered}
                    </span>
                    <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.875rem', color: 'var(--kg-ink-2)' }}>
                      {myStats.sessionCount}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-bar-fill" style={{ width: `${myPassProb}%` }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--kg-accent)', width: 38, textAlign: 'right' }}>
                        {myPassProb}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* モバイル カード表示 */}
            <div className="card ranking-mobile-view">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-1)' }}>
                {board.slice(0, 20).map(({ stats: s, prob }, idx) => {
                  const title = getExamTitle(prob, s.totalAnswered);
                  const isMe  = s.userId === user?.userId;
                  return (
                    <div
                      key={s.userId}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--s-3)',
                        padding: 'var(--s-3) var(--s-3)', borderRadius: 'var(--r-1)',
                        background: isMe ? 'var(--kg-selected-bg)' : 'transparent',
                        border: isMe ? '1px solid var(--kg-accent)' : '1px solid var(--kg-rule)',
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-en)', fontWeight: 700,
                        fontSize: idx === 0 ? '1rem' : idx < 3 ? '0.9375rem' : '0.8125rem',
                        color: idx === 0 ? 'var(--kg-warn)' : idx < 3 ? 'var(--kg-ink-3)' : 'var(--kg-ink-4)',
                        flexShrink: 0, minWidth: '2rem', textAlign: 'center',
                      }}>
                        #{idx + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 2px', fontWeight: isMe ? 700 : 400, fontSize: '0.875rem',
                          color: 'var(--kg-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.displayName}{isMe ? ' (あなた)' : ''}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.6875rem', color: titleColor(title.label) }}>
                          {title.label} · {s.totalAnswered}問
                        </p>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '1rem',
                        color: 'var(--kg-accent)', flexShrink: 0, letterSpacing: '-0.01em',
                      }}>
                        {prob}%
                      </span>
                    </div>
                  );
                })}
                {myRank >= 20 && user && myStats && (
                  <>
                    <div style={{
                      textAlign: 'center', padding: 'var(--s-1) 0',
                      fontSize: '0.75rem', color: 'var(--kg-ink-4)', letterSpacing: '0.1em',
                    }}>···</div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--s-3)',
                      padding: 'var(--s-3) var(--s-3)', borderRadius: 'var(--r-1)',
                      background: 'var(--kg-selected-bg)', border: '1px solid var(--kg-accent)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '0.8125rem',
                        color: 'var(--kg-ink-4)', flexShrink: 0, minWidth: '2rem', textAlign: 'center',
                      }}>#{myRank + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '0.875rem', color: 'var(--kg-ink)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {myStats.displayName} (あなた)
                        </p>
                        <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--kg-ink-3)' }}>
                          {myTitle.label} · {myStats.totalAnswered}問
                          {board[19] && myPassProb < board[19].prob
                            ? ` — 20位まであと${board[19].prob - myPassProb}%` : ''}
                        </p>
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '1rem',
                        color: 'var(--kg-accent)', flexShrink: 0, letterSpacing: '-0.01em',
                      }}>{myPassProb}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </section>

    </div>
  );
};
