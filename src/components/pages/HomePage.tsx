import { useEffect, useState } from 'react';
import RadarChart from '../RadarChart';
import { HistoryTimeline } from '../HistoryTimeline';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '../../contexts/NavigationContext';
import {
  fetchUserCategoryAccuracy,
  fetchUserStats,
  fetchUserSessions,
  fetchLeaderboard,
  loadMissionProgressFromFirebase,
} from '../../hooks/useFirebase';
import { radarCategoryLabels } from '../../data/clf-c02-questions';
import { MISSIONS, isMissionAvailable, loadProgress } from '../../data/missions';
import {
  calculatePassProbability,
  calculateStreak,
  getTodaySummary,
  getExamTitle,
  getWeekActivity,
} from '../../utils';
import type { UserStats, QuizSession } from '../../types/index';

interface BoardEntry { stats: UserStats; prob: number; }

const CATEGORY_ORDER = ['ai-basics', 'ml-fundamentals', 'aws-services', 'ethics', 'practice'] as const;
const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

export const HomePage = () => {
  const { user } = useUser();
  const { navigate } = useNavigation();
  const [accuracy, setAccuracy]           = useState<Record<string, number> | null>(null);
  const [stats, setStats]                 = useState<UserStats | null>(null);
  const [sessions, setSessions]           = useState<QuizSession[] | null>(null);
  const [board, setBoard]                 = useState<BoardEntry[] | null>(null);
  const [missionCompleted, setMissionCompleted] = useState<string[] | null>(
    () => user ? loadProgress(user.userId) : null
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      const localProgress = loadProgress(user.userId);
      setMissionCompleted(localProgress);
      const [acc, s, sess, firebaseProgress, boardData] = await Promise.all([
        fetchUserCategoryAccuracy(user.userId),
        fetchUserStats(user.userId),
        fetchUserSessions(user.userId),
        loadMissionProgressFromFirebase(user.userId),
        fetchLeaderboard(),
      ]);
      if (!mounted) return;
      setAccuracy(acc);
      setStats(s);
      setSessions(sess);
      const merged = Array.from(new Set([...localProgress, ...firebaseProgress]));
      setMissionCompleted(merged);
      setBoard(
        boardData
          .map((st) => ({ stats: st, prob: calculatePassProbability(st) }))
          .sort((a, b) => b.prob - a.prob)
      );
    })();
    return () => { mounted = false; };
  }, [user]);

  const radarValues = CATEGORY_ORDER.map((cat) => accuracy?.[cat] ?? 0);
  const radarLabels = CATEGORY_ORDER.map((cat) => radarCategoryLabels[cat] ?? cat);
  const hasData     = radarValues.some((v) => v > 0);

  const passPct  = stats ? calculatePassProbability(stats) : 0;
  const answered = stats?.totalAnswered ?? 0;

  const streak       = sessions !== null ? calculateStreak(sessions) : null;
  const todaySummary = sessions !== null ? getTodaySummary(sessions) : null;
  const weekActivity = sessions !== null ? getWeekActivity(sessions) : null;
  const badge        = stats ? getExamTitle(passPct, answered) : null;

  const badgeNextMsg = (() => {
    if (!badge) return '';
    if (badge.label === '未挑戦')   return '試験に挑戦しよう';
    if (badge.label === '初学者')   return '問題を解き続けよう';
    if (badge.label === '学習中')   return '正解率を上げよう';
    if (badge.label === '中級者')   return 'もう少しで合格圏内！';
    if (badge.label === '合格圏内') return 'あと一歩！';
    return '自信を持って臨もう';
  })();

  /* ── 次のミッション ── */
  const nextMission = missionCompleted !== null
    ? MISSIONS.find((m, idx) => !missionCompleted.includes(m.id) && isMissionAvailable(idx, missionCompleted))
    : undefined;

  /* ── 初回ユーザー（StarterCard） ── */
  if (sessions !== null && stats !== null && answered === 0 && sessions.length === 0) {
    return (
      <div className="fade-in">
        <p className="eyebrow">getting started</p>
        <div className="card">
          <p style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--kg-ink)',
            margin: '0 0 var(--s-2)', lineHeight: 1.4 }}>
            まずは 5 問、解いてみましょう
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--kg-ink-3)', margin: '0 0 var(--s-4)', lineHeight: 1.6 }}>
            AWS CLF-C02 の出題傾向を体感してみましょう。
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', marginBottom: 'var(--s-4)' }}>
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5-10-5z"/>
                    <path d="M6 12v5c3.33 1.33 8.67 1.33 12 0v-5"/>
                  </svg>
                ),
                text: '試験タブで問題を解く',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                ),
                text: '結果から苦手分野を把握',
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                  </svg>
                ),
                text: '学習タブで知識を整理',
              },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--s-3)',
                padding: 'var(--s-3) var(--s-4)',
                border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)',
              }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 34, height: 34, flexShrink: 0,
                  border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)',
                  color: 'var(--kg-accent)', background: 'var(--kg-paper-2)',
                }}>{icon}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--kg-ink)', lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => navigate('quiz', { quizInitialCount: 5 })}
          >
            5 問クイック演習をはじめる →
          </button>
        </div>
      </div>
    );
  }

  const myRank = board?.findIndex((e) => e.stats.userId === user?.userId) ?? -1;

  return (
    <div className="fade-in">
      {/* PC専用ページ見出し */}
      <div className="home-pc-heading" style={{ marginBottom: 'var(--s-5)' }}>
        <p className="eyebrow" style={{ marginBottom: 'var(--s-2)' }}>dashboard</p>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: 'var(--kg-ink)', lineHeight: 1.3 }}>
          おかえりなさい、{user?.displayName} さん
        </h1>
      </div>

      <div className="home-grid">

      {/* ── 左カラム ── */}
      <div className="home-col-left">

      {/* ── 再開カード ── */}
      <section>
        <p className="eyebrow">continue</p>
        {missionCompleted === null ? (
          <div className="card skeleton" style={{ height: 96 }} />
        ) : nextMission ? (
          <div className="card" style={{
            background: 'color-mix(in srgb, var(--kg-accent) 4%, var(--kg-paper))',
            borderColor: 'color-mix(in srgb, var(--kg-accent) 35%, transparent)',
          }}>
            <p style={{ margin: '0 0 var(--s-1)', fontWeight: 700, fontSize: '0.9375rem',
              color: 'var(--kg-ink)', lineHeight: 1.4 }}>
              M{nextMission.number} {nextMission.title}
            </p>
            <p style={{ margin: '0 0 var(--s-3)', fontSize: '0.8125rem', color: 'var(--kg-ink-3)' }}>
              {nextMission.subtitle}
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => navigate('study', { initialStudyTab: 'mission', initialMissionId: nextMission.id })}
            >
              続きから再開 →
            </button>
          </div>
        ) : (
          <div className="card" style={{
            background: 'color-mix(in srgb, var(--kg-accent) 4%, var(--kg-paper))',
            borderColor: 'color-mix(in srgb, var(--kg-accent) 35%, transparent)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', marginBottom: 'var(--s-2)' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, flexShrink: 0,
                borderRadius: 'var(--r-1)',
                background: 'color-mix(in srgb, var(--kg-accent) 15%, transparent)',
                color: 'var(--kg-accent)',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </span>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem',
                color: 'var(--kg-ink)', lineHeight: 1.4 }}>
                全ミッション制覇！
              </p>
            </div>
            <p style={{ margin: '0 0 var(--s-3)', fontSize: '0.8125rem',
              color: 'var(--kg-ink-3)', lineHeight: 1.6 }}>
              すべての学習ミッションを完了しました。試験本番に向けた準備は万全です。
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => navigate('quiz', { quizInitialCount: 10 })}
            >
              模擬試験 10 問に挑戦 →
            </button>
          </div>
        )}
      </section>

      {/* ── 週間ダッシュボード（streak + today + rank を統合） ── */}
      <section>
        <p className="eyebrow">this week</p>
        {sessions === null || stats === null ? (
          <div className="card skeleton" style={{ height: 140 }} />
        ) : (
          <div className="card" style={{ padding: 'var(--s-4)' }}>
            {/* 上段: 今日の数値 + ストリーク */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-4)',
              marginBottom: 'var(--s-3)', flexWrap: 'wrap' }}>
              {todaySummary && todaySummary.answered > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{
                      fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '2rem',
                      color: 'var(--kg-accent)', letterSpacing: '-0.02em', lineHeight: 1,
                    }}>
                      {todaySummary.answered}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-3)' }}>問</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{
                      fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '2rem',
                      color: 'var(--kg-accent)', letterSpacing: '-0.02em', lineHeight: 1,
                    }}>
                      {Math.round((todaySummary.correct / todaySummary.answered) * 100)}%
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-3)' }}>正解</span>
                  </div>
                </>
              ) : (
                <span style={{ fontSize: '0.875rem', color: 'var(--kg-ink-3)' }}>今日はまだ学習していません</span>
              )}
              {(streak ?? 0) > 0 && (
                <span style={{
                  marginLeft: 'auto', flexShrink: 0,
                  fontFamily: 'var(--font-en)', fontWeight: 700,
                  fontSize: '0.875rem', color: 'var(--kg-accent)',
                }}>
                  {streak} 日連続
                </span>
              )}
            </div>

            {/* 中段: 7日ドットカレンダー */}
            {weekActivity && (
              <div style={{ display: 'flex', justifyContent: 'space-between',
                marginBottom: 'var(--s-3)', gap: 4 }}>
                {weekActivity.map((active, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (6 - i));
                  const isToday = i === 6;
                  const dayLabel = DAY_LABELS[d.getDay()];
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 4, flex: 1 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: active ? 'var(--kg-accent)' : 'transparent',
                        border: isToday
                          ? '2px solid var(--kg-accent)'
                          : `1px solid ${active ? 'var(--kg-accent)' : 'var(--kg-rule)'}`,
                      }} />
                      <span style={{ fontSize: '0.625rem', color: 'var(--kg-ink-3)' }}>{dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 下段: ランク情報 */}
            {badge && (
              <div style={{
                borderTop: '1px solid var(--kg-rule-soft)',
                paddingTop: 'var(--s-3)',
                fontSize: '0.75rem', color: 'var(--kg-ink-3)', lineHeight: 1.5,
              }}>
                ランク：<span style={{ color: badge.color, fontWeight: 700 }}>{badge.label}</span>
                {' · '}累計 {answered} 問 · 試験 {stats?.sessionCount ?? 0} 回
                {badgeNextMsg ? ` — ${badgeNextMsg}` : ''}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── 合格確率 ── */}
      <section>
        <p className="eyebrow">overall</p>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)' }}>
          {stats === null && accuracy === null ? (
            <>
              <div className="skeleton" style={{ width: 72, height: 56, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
                <div className="skeleton" style={{ height: 16, width: '60%' }} />
                <div className="skeleton" style={{ height: 12, width: '80%' }} />
              </div>
            </>
          ) : (
            <>
              <div style={{ flexShrink: 0 }}>
                <span style={{
                  fontFamily: 'var(--font-en)',
                  fontWeight: 700,
                  fontSize: answered > 0 ? '3.5rem' : '2rem',
                  lineHeight: 1,
                  color: answered > 0 ? 'var(--kg-accent)' : 'var(--kg-ink-4)',
                  letterSpacing: '-0.02em',
                }}>
                  {answered > 0 ? `${passPct}%` : '—'}
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: '0 0 var(--s-1)', fontWeight: 700, fontSize: '0.875rem',
                  color: 'var(--kg-ink)', lineHeight: 1.4 }}>
                  推定合格確率
                </p>
                <p style={{ margin: '0 0 var(--s-2)', fontSize: '0.8125rem',
                  color: 'var(--kg-ink-3)', lineHeight: 1.6 }}>
                  {answered > 0
                    ? `${answered} 問回答済み`
                    : '試験を受けると確率が算出されます'}
                </p>
                {answered > 0 && (
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${passPct}%` }} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      </div>{/* end home-col-left */}

      {/* ── 右カラム ── */}
      <div className="home-col-right">

      {/* ── スキルレーダー ── */}
      <section>
        <p className="eyebrow">skill map</p>
        <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>スキルレーダー</h2>

        <div className="card" style={{ textAlign: 'center' }}>
          {accuracy ? (
            hasData ? (
              <RadarChart labels={radarLabels} values={radarValues} size={260} />
            ) : (
              <div style={{
                padding: 'var(--s-6) var(--s-4)',
                border: '1px dashed var(--kg-rule)',
                borderRadius: 'var(--r-1)',
              }}>
                <p style={{ margin: 0, color: 'var(--kg-ink-3)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  試験に挑戦するとここにスキルマップが表示されます
                </p>
              </div>
            )
          ) : (
            <div className="skeleton" style={{ width: 250, height: 250, borderRadius: '50%', margin: '0 auto' }} />
          )}
        </div>
      </section>

      {/* ── ミニランキング (PC のみ) ── */}
      <section className="home-mini-ranking">
        <p className="eyebrow">ranking</p>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--s-4)' }}>
          <h2 style={{ margin: 0, color: 'var(--kg-ink)' }}>ランキング</h2>
          {board && (
            <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.75rem', color: 'var(--kg-ink-3)' }}>
              top {Math.min(board.length, 3)}
            </span>
          )}
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {board === null ? (
            <div style={{ padding: 'var(--s-4)', display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 40, borderRadius: 'var(--r-1)' }} />
              ))}
            </div>
          ) : board.length === 0 ? (
            <p style={{ padding: 'var(--s-4)', margin: 0, fontSize: '0.875rem', color: 'var(--kg-ink-3)' }}>
              まだ記録がありません
            </p>
          ) : (
            <div>
              {board.slice(0, 3).map(({ stats: s, prob }, idx) => {
                const isMe = s.userId === user?.userId;
                return (
                  <div key={s.userId} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--s-3)',
                    padding: 'var(--s-3) var(--s-4)',
                    borderBottom: '1px solid var(--kg-rule-soft)',
                    background: isMe ? 'var(--kg-selected-bg)' : 'transparent',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-en)', fontWeight: 700,
                      fontSize: idx === 0 ? '1.1875rem' : '1rem',
                      color: idx === 0 ? 'var(--kg-warn)' : 'var(--kg-ink-4)',
                      flexShrink: 0, minWidth: '1.75rem', textAlign: 'center',
                    }}>
                      #{idx + 1}
                    </span>
                    <span style={{
                      flex: 1, fontSize: '0.875rem',
                      color: 'var(--kg-ink)', fontWeight: isMe ? 700 : 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {s.displayName}{isMe ? ' (あなた)' : ''}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-en)', fontWeight: 700,
                      fontSize: '0.9375rem', color: 'var(--kg-accent)', flexShrink: 0,
                    }}>
                      {prob}%
                    </span>
                  </div>
                );
              })}
              {/* 自分が上位3位外の場合 */}
              {myRank >= 3 && user && (
                <>
                  <div style={{
                    textAlign: 'center', padding: 'var(--s-1) 0',
                    fontSize: '0.75rem', color: 'var(--kg-ink-4)', letterSpacing: '0.2em',
                  }}>···</div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--s-3)',
                    padding: 'var(--s-3) var(--s-4)',
                    background: 'var(--kg-selected-bg)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '1rem',
                      color: 'var(--kg-ink-4)', flexShrink: 0, minWidth: '1.75rem', textAlign: 'center',
                    }}>
                      #{myRank + 1}
                    </span>
                    <span style={{
                      flex: 1, fontSize: '0.875rem', color: 'var(--kg-ink)', fontWeight: 700,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {user.displayName} (あなた)
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-en)', fontWeight: 700,
                      fontSize: '0.9375rem', color: 'var(--kg-accent)', flexShrink: 0,
                    }}>
                      {board[myRank]?.prob ?? 0}%
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      </div>{/* end home-col-right */}

      </div>{/* end home-grid */}

      {/* ── 学習履歴タイムライン ── */}
      <div style={{ marginTop: 'var(--s-5)' }}>
        <HistoryTimeline
          sessions={sessions}
          onRetryQuestions={(ids) => navigate('quiz', { initialQuizQuestionIds: ids })}
        />
      </div>
    </div>
  );
};
