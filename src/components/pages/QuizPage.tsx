import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { saveQuizSession } from '../../hooks/useFirebase';
import { questions, questionsByCategory, categoryLabels } from '../../data/clf-c02-questions';
import { shuffleArray, shuffleQuestionOptions, calculateAccuracy, formatTime } from '../../utils';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '../../contexts/NavigationContext';
import type { QuizAnswer, QuizResult, QuestionCategory } from '../../types/index';

const NUM_OPTIONS = [5, 10, 20, 65, questions.length] as const;

const DONT_KNOW = -2;

const CATEGORY_OPTIONS: { value: QuestionCategory | 'mixed'; label: string }[] = [
  { value: 'mixed',                 label: '全カテゴリ混合' },
  { value: 'cloud-concepts',        label: categoryLabels['cloud-concepts'] },
  { value: 'security-compliance',   label: categoryLabels['security-compliance'] },
  { value: 'cloud-technology',      label: categoryLabels['cloud-technology'] },
  { value: 'billing-support',       label: categoryLabels['billing-support'] },
];

const timeLimitSeconds = (numQuestions: number): number => {
  if (numQuestions >= 65) return 90 * 60;
  if (numQuestions >= 20) return 30 * 60;
  if (numQuestions >= 10) return 15 * 60;
  return 8 * 60;
};

const buildQuizQuestions = (category: QuestionCategory | 'mixed', count: number) => {
  const pool = category === 'mixed' ? questions : (questionsByCategory[category] ?? questions);
  return shuffleArray(pool).slice(0, Math.min(count, pool.length)).map(shuffleQuestionOptions);
};

/* ── インライン中断確認ダイアログ ── */
const AbortConfirmDialog = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--s-4)',
    }}
    onClick={onCancel}
  >
    <div
      style={{
        width: '100%', maxWidth: 340,
        background: 'var(--kg-paper)',
        borderRadius: 'var(--r-2)',
        padding: 'var(--s-5) var(--s-4)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--kg-ink)', margin: '0 0 var(--s-2)' }}>
        試験を中断しますか？
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--kg-ink-3)', margin: '0 0 var(--s-4)', lineHeight: 1.6 }}>
        進行中の回答は失われます。
      </p>
      <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
        <button className="btn btn-ghost" onClick={onCancel} style={{ flex: 1 }}>キャンセル</button>
        <button
          className="btn btn-primary"
          onClick={onConfirm}
          style={{ flex: 1, background: 'var(--kg-error)', borderColor: 'var(--kg-error)' }}
        >
          中断する
        </button>
      </div>
    </div>
  </div>
);

/* ── タイマーアイコン（残り時間警告用） ── */
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

type FeedbackMode = 'final' | 'immediate';

export const QuizPage = () => {
  const { user } = useUser();
  const {
    quizInitialCount, clearQuizInitialCount,
    initialQuizQuestionIds, clearInitialQuizQuestionIds,
  } = useNavigation();

  const [results, setResults]               = useState<QuizResult[] | null>(null);
  const [isStarted, setIsStarted]           = useState(false);
  const [isFinished, setIsFinished]         = useState(false);
  const isFinishedRef                       = useRef(false);
  const [isSaving, setIsSaving]             = useState(false);
  const [saveError, setSaveError]           = useState<string | null>(null);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [numQuestions, setNumQuestions]     = useState(() => quizInitialCount ?? 10);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'mixed'>('mixed');
  const [feedbackMode, setFeedbackMode]     = useState<FeedbackMode>('final');
  const [showImmediateFeedback, setShowImmediateFeedback] = useState(false);
  const [score, setScore]                   = useState(0);
  const [total, setTotal]                   = useState(0);
  const [expandedIndex, setExpandedIndex]   = useState<number | null>(null);
  const [quizQuestions, setQuizQuestions]   = useState(() => buildQuizQuestions('mixed', quizInitialCount ?? 10));
  const [showAbortDialog, setShowAbortDialog] = useState(false);

  // 経過タイマー
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    if (!isStarted || isFinished) return;
    const id = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isStarted, isFinished]);

  const timeLimit = timeLimitSeconds(numQuestions);
  const remaining = Math.max(0, timeLimit - elapsedSeconds);
  const isNearEnd = remaining > 0 && remaining <= 5 * 60;

  const { currentQuestionIndex, answers, selectAnswer, goToNextQuestion, goToQuestion, calculateScore, reset } = useQuiz();

  const handleStart = useCallback((overrideQuestions?: typeof quizQuestions) => {
    const qs = overrideQuestions
      ? shuffleArray(overrideQuestions).map(shuffleQuestionOptions)
      : buildQuizQuestions(selectedCategory, numQuestions);
    setQuizQuestions(qs);
    reset();
    isFinishedRef.current = false;
    setIsStarted(true);
    setIsFinished(false);
    setResults(null);
    setSavedSessionId(null);
    setSaveError(null);
    setElapsedSeconds(0);
    setShowImmediateFeedback(false);
  }, [selectedCategory, numQuestions, reset]);

  // NavigationContext 経由の初期指定を消費（学習履歴からの「苦手問題を解き直す」）
  useEffect(() => {
    if (initialQuizQuestionIds && initialQuizQuestionIds.length > 0) {
      const idSet = new Set(initialQuizQuestionIds);
      const targetQuestions = questions.filter((q) => idSet.has(q.id));
      clearInitialQuizQuestionIds();
      if (targetQuestions.length > 0) handleStart(targetQuestions);
    } else if (quizInitialCount !== null) {
      clearQuizInitialCount();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAbortConfirm = () => {
    setShowAbortDialog(false);
    reset();
    isFinishedRef.current = false;
    setIsStarted(false);
    setIsFinished(false);
    setElapsedSeconds(0);
    setShowImmediateFeedback(false);
  };

  const handleFinish = useCallback(async (qs: typeof quizQuestions) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    const { score: finalScore, results: computed } = calculateScore(qs);
    const accuracy = calculateAccuracy(finalScore, qs.length);
    setScore(finalScore);
    setTotal(qs.length);
    setResults(computed);
    setIsFinished(true);
    setExpandedIndex(null);

    if (!user) { setSaveError('ユーザー情報が見つかりません。'); return; }
    setIsSaving(true);
    setSaveError(null);

    const answersPayload: QuizAnswer[] = computed.map((r) => ({
      questionId: r.questionId,
      selected: r.selected,
      correct: r.correct,
    }));

    try {
      const sessionId = await saveQuizSession({
        userId: user.userId, displayName: user.displayName,
        score: finalScore, total: qs.length, accuracy,
        category: selectedCategory, answers: answersPayload, timestamp: Date.now(),
      });
      setSavedSessionId(sessionId);
    } catch (err) {
      setSaveError('結果の保存に失敗しました。もう一度お試しください。');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculateScore, user]);

  // 時間切れ自動終了
  useEffect(() => {
    if (isStarted && !isFinished && remaining === 0) {
      handleFinish(quizQuestions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  /* ── 開始画面 ── */
  if (!isStarted) {
    const poolSize = selectedCategory === 'mixed'
      ? questions.length
      : (questionsByCategory[selectedCategory as QuestionCategory]?.length ?? 0);
    const actualCount = Math.min(numQuestions, poolSize);
    const limitMin = Math.round(timeLimitSeconds(numQuestions) / 60);
    const catLabel = CATEGORY_OPTIONS.find((o) => o.value === selectedCategory)?.label ?? '全カテゴリ';
    const feedbackLabel = feedbackMode === 'final' ? '最後にまとめて' : '1問ごとに確認';

    return (
      <div className="fade-in">
        <p className="eyebrow">mock exam</p>
        <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>模擬試験</h2>

        {/* スペック 3 つ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--s-2)',
          marginBottom: 'var(--s-4)' }}>
          {[
            { val: '65', unit: '問' },
            { val: '90', unit: '分' },
            { val: '70', unit: '% 合格目安' },
          ].map(({ val, unit }) => (
            <div key={val} style={{
              padding: 'var(--s-3) var(--s-2)', border: '1px solid var(--kg-rule)',
              borderRadius: 'var(--r-1)', background: 'var(--kg-paper-2)', textAlign: 'center',
            }}>
              <p style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '1.875rem',
                color: 'var(--kg-accent)', margin: 0, lineHeight: 1 }}>{val}</p>
              <p style={{ fontFamily: 'var(--font-jp)', fontSize: '0.6875rem', color: 'var(--kg-ink-3)',
                margin: 'var(--s-1) 0 0', lineHeight: 1.4 }}>{unit}</p>
            </div>
          ))}
        </div>

        {/* PC 2-column: 設定カード + サマリパネル */}
        <div className="quiz-setup-grid">
          <div className="card">
            {/* カテゴリ選択 */}
            <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
              letterSpacing: '0.08em', color: 'var(--kg-ink-3)', textTransform: 'uppercase',
              margin: '0 0 var(--s-2)' }}>
              カテゴリを選択
            </p>
            <div className="chip-scroll" style={{ marginBottom: 'var(--s-4)' }}>
              {CATEGORY_OPTIONS.map(({ value, label }) => (
                <button key={value}
                  className={`chip${selectedCategory === value ? ' chip-active' : ''}`}
                  onClick={() => setSelectedCategory(value)}>
                  {label}
                </button>
              ))}
            </div>

            {/* 問題数選択 */}
            <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
              letterSpacing: '0.08em', color: 'var(--kg-ink-3)', textTransform: 'uppercase',
              margin: '0 0 var(--s-2)' }}>
              問題数を選択
            </p>
            <div className="chip-scroll" style={{ marginBottom: 'var(--s-4)' }}>
              {NUM_OPTIONS.map((n) => {
                const capped = Math.min(n, poolSize);
                return (
                  <button key={n}
                    className={`chip${numQuestions === n ? ' chip-active' : ''}`}
                    onClick={() => setNumQuestions(n)}>
                    {n === questions.length ? `全問 (${capped}問)` : n === 65 ? `65問 (本番)` : `${capped}問`}
                  </button>
                );
              })}
            </div>

            {/* フィードバックモード選択 */}
            <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
              letterSpacing: '0.08em', color: 'var(--kg-ink-3)', textTransform: 'uppercase',
              margin: '0 0 var(--s-2)' }}>
              正解の表示タイミング
            </p>
            <div className="chip-scroll" style={{ marginBottom: 'var(--s-4)' }}>
              {([
                { value: 'final',     label: '最後にまとめて' },
                { value: 'immediate', label: '1問ごとに確認' },
              ] as { value: FeedbackMode; label: string }[]).map(({ value, label }) => (
                <button key={value}
                  className={`chip${feedbackMode === value ? ' chip-active' : ''}`}
                  onClick={() => setFeedbackMode(value)}>
                  {label}
                </button>
              ))}
            </div>

            {/* モバイル向け確認 + 開始 */}
            <div style={{ padding: 'var(--s-3) var(--s-4)', background: 'var(--kg-paper-2)',
              border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)',
              marginBottom: 'var(--s-4)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--kg-ink)', fontFamily: 'var(--font-jp)' }}>
                <strong>{actualCount}</strong> 問 ·{' '}
                <span style={{ color: 'var(--kg-ink-3)' }}>制限時間 {limitMin} 分</span>
              </p>
            </div>

            <button className="btn btn-primary" onClick={() => handleStart()} style={{ width: '100%' }}>
              試験をはじめる →
            </button>
          </div>

          {/* PC サマリパネル */}
          <div className="quiz-summary-panel">
            <div style={{
              border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)',
              background: 'var(--kg-paper)', padding: 'var(--s-5)',
            }}>
              <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', letterSpacing: '0.12em',
                textTransform: 'lowercase', color: 'var(--kg-ink-3)', margin: '0 0 var(--s-4)' }}>
                your session
              </p>
              <p style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '2.75rem',
                color: 'var(--kg-ink)', lineHeight: 1, letterSpacing: '-0.02em',
                margin: '0 0 var(--s-4)' }}>
                {actualCount}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--kg-ink-3)', marginLeft: 4 }}>問</span>
              </p>
              {[
                { k: 'カテゴリ', v: catLabel },
                { k: '制限時間', v: `${limitMin} 分` },
                { k: '正解表示', v: feedbackLabel },
              ].map(({ k, v }) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '0.875rem', padding: 'var(--s-2) 0',
                  borderBottom: '1px solid var(--kg-rule-soft)',
                }}>
                  <span style={{ color: 'var(--kg-ink-3)' }}>{k}</span>
                  <span style={{ color: 'var(--kg-ink)', fontWeight: 700 }}>{v}</span>
                </div>
              ))}
              <button
                className="btn btn-primary"
                onClick={() => handleStart()}
                style={{ width: '100%', marginTop: 'var(--s-4)' }}
              >
                試験をはじめる →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── 結果画面 ── */
  if (isFinished) {
    const accuracy = calculateAccuracy(score, total);
    const passed = accuracy >= 70;

    const wrongQuestions = quizQuestions.filter((_, i) => results && !results[i]?.correct);

    return (
      <div className="fade-in">
        {/* スコア */}
        <div style={{ textAlign: 'center', padding: 'var(--s-6) 0 var(--s-5)',
          borderBottom: '1px solid var(--kg-rule)', marginBottom: 'var(--s-5)' }}>
          <p className="eyebrow" style={{ textAlign: 'center' }}>result</p>
          <p style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '5.75rem',
            color: 'var(--kg-accent)', lineHeight: 1, margin: '0 0 var(--s-2)',
            letterSpacing: '-0.03em' }}>
            {accuracy}
            <span style={{ fontSize: '2rem', color: 'var(--kg-ink-3)', fontWeight: 400 }}>%</span>
          </p>
          <p style={{ fontFamily: 'var(--font-jp)', fontSize: '0.875rem', color: 'var(--kg-ink-2)',
            margin: '0 0 var(--s-1)' }}>
            {score} / {total} 問正解
          </p>
          <p style={{ fontFamily: 'var(--font-jp)', fontSize: '0.8125rem', color: 'var(--kg-ink-3)',
            margin: '0 0 var(--s-3)' }}>
            経過時間 {formatTime(elapsedSeconds)}
          </p>
          <span style={{
            display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem',
            borderRadius: 'var(--r-1)', fontFamily: 'var(--font-en)', fontWeight: 700,
            fontSize: '0.75rem', letterSpacing: '0.06em',
            background: passed ? 'var(--kg-correct-bg)' : 'var(--kg-wrong-bg)',
            color: passed ? 'var(--kg-success)' : 'var(--kg-error)',
            border: `1px solid ${passed ? 'var(--kg-success)' : 'var(--kg-error)'}`,
          }}>
            {passed ? 'PASS' : 'FAIL'}
          </span>

          <p style={{ fontFamily: 'var(--font-jp)', fontSize: '0.875rem', color: 'var(--kg-ink-3)',
            margin: 'var(--s-4) 0 0', lineHeight: 1.7 }}>
            {accuracy === 100 ? '全問正解！完璧です。'
              : accuracy >= 80 ? '素晴らしい成績です。試験本番も期待できます。'
              : accuracy >= 70 ? '合格圏内です。もう少し復習しましょう。'
              : accuracy >= 60 ? '惜しい！苦手分野を重点的に復習しましょう。'
              : 'もっと学習が必要です。分野別に取り組みましょう。'}
          </p>
        </div>

        {/* 保存状態 */}
        {isSaving && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-3)', textAlign: 'center',
            margin: '0 0 var(--s-3)' }}>結果を保存中…</p>
        )}
        {savedSessionId && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--kg-success)', textAlign: 'center',
            margin: '0 0 var(--s-3)' }}>結果を保存しました</p>
        )}
        {saveError && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--kg-error)', textAlign: 'center',
            margin: '0 0 var(--s-3)' }}>{saveError}</p>
        )}

        {/* アクションボタン */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', marginBottom: 'var(--s-5)' }}>
          <button className="btn btn-primary" onClick={() => handleStart()} style={{ width: '100%' }}>
            もう一度演習する →
          </button>
          {wrongQuestions.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => handleStart(wrongQuestions)}
              style={{ width: '100%' }}
            >
              不正解 {wrongQuestions.length} 問だけ再演習 →
            </button>
          )}
        </div>

        {/* PC 2-column: 分野別 + 見直し */}
        <div className="quiz-results-grid">

        {/* 分野別スコア (PC 左カラム) */}
        <div>
          <h3 style={{ color: 'var(--kg-ink)', marginBottom: 'var(--s-3)' }}>分野別スコア</h3>
          <div className="card">
            {(() => {
              const catMap: Record<string, { correct: number; total: number }> = {};
              quizQuestions.forEach((q, i) => {
                const cat = q.category;
                if (!catMap[cat]) catMap[cat] = { correct: 0, total: 0 };
                catMap[cat].total++;
                if (results?.[i]?.correct) catMap[cat].correct++;
              });
              return Object.entries(catMap).map(([cat, { correct, total: t }]) => {
                const pct = t > 0 ? Math.round((correct / t) * 100) : 0;
                return (
                  <div key={cat} style={{ marginBottom: 'var(--s-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)' }}>
                        {categoryLabels[cat as keyof typeof categoryLabels] ?? cat}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-en)', fontWeight: 700,
                        fontSize: '0.8125rem', color: 'var(--kg-accent)',
                      }}>
                        {correct}/{t} · {pct}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{
                        width: `${pct}%`,
                        background: pct < 60 ? 'var(--kg-warn)' : undefined,
                      }} />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* 全問解説 (PC 右カラム) */}
        <div>
        <h3 style={{ color: 'var(--kg-ink)', marginBottom: 'var(--s-3)' }}>解説（全{total}問）</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
          {results?.map((r: QuizResult, i: number) => {
            const q = quizQuestions[i];
            const isCorrect = r.correct;
            const isOpen = expandedIndex === i;
            return (
              <div key={q.id} style={{
                border: `1px solid ${isCorrect ? 'var(--kg-success)' : 'var(--kg-error)'}`,
                borderRadius: 'var(--r-1)',
                background: isCorrect ? 'var(--kg-correct-bg)' : 'var(--kg-wrong-bg)',
                overflow: 'hidden',
              }}>
                <button onClick={() => setExpandedIndex(isOpen ? null : i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)',
                    width: '100%', padding: 'var(--s-3) var(--s-4)',
                    minHeight: 'var(--tap-min)',
                    background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '0.75rem',
                    color: isCorrect ? 'var(--kg-success)' : 'var(--kg-error)',
                    flexShrink: 0, minWidth: 14 }}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-jp)', fontSize: '0.8125rem',
                    color: 'var(--kg-ink)', lineHeight: 1.6, minWidth: 0,
                    overflow: 'hidden',
                    display: '-webkit-box', WebkitLineClamp: isOpen ? undefined : 2,
                    WebkitBoxOrient: 'vertical' as const }}>
                    {i + 1}. {q.question}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--kg-ink-3)', flexShrink: 0 }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 var(--s-4) var(--s-4)' }}>
                    {r.selected === DONT_KNOW && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--s-2)',
                        padding: 'var(--s-2) var(--s-3)', marginBottom: 'var(--s-2)',
                        borderRadius: 'var(--r-1)',
                        border: '1px solid var(--kg-error)',
                        background: 'var(--kg-wrong-bg)',
                        fontFamily: 'var(--font-jp)', fontSize: '0.8125rem',
                      }}>
                        <span style={{ color: 'var(--kg-error)', fontWeight: 700 }}>?</span>
                        <span style={{ flex: 1, color: 'var(--kg-ink)' }}>わからない（スキップ）</span>
                        <span style={{ flexShrink: 0, fontWeight: 700, fontSize: '0.6875rem',
                          color: 'var(--kg-error)' }}>あなた</span>
                      </div>
                    )}
                    {q.options.map((opt: string, idx: number) => {
                      const isThisCorrect = idx === q.correctAnswer;
                      const isUserPick    = idx === r.selected;
                      const isWrongPick   = isUserPick && !isThisCorrect;
                      return (
                        <div key={idx} style={{
                          display: 'flex', alignItems: 'center', gap: 'var(--s-2)',
                          padding: 'var(--s-2) var(--s-3)', marginBottom: 'var(--s-1)',
                          borderRadius: 'var(--r-1)',
                          border: `1px solid ${isThisCorrect ? 'var(--kg-success)' : isWrongPick ? 'var(--kg-error)' : 'var(--kg-rule)'}`,
                          background: isThisCorrect ? 'var(--kg-correct-bg)' : isWrongPick ? 'var(--kg-wrong-bg)' : 'var(--kg-paper)',
                          fontFamily: 'var(--font-jp)', fontSize: '0.8125rem',
                        }}>
                          <span style={{ fontFamily: 'var(--font-en)', fontWeight: 700, flexShrink: 0,
                            color: isThisCorrect ? 'var(--kg-success)' : isWrongPick ? 'var(--kg-error)' : 'var(--kg-ink-3)' }}>
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span style={{ flex: 1, color: 'var(--kg-ink)' }}>{opt}</span>
                          {isThisCorrect && (
                            <span style={{ flexShrink: 0, fontWeight: 700, fontSize: '0.6875rem',
                              color: 'var(--kg-success)' }}>正解</span>
                          )}
                          {isWrongPick && (
                            <span style={{ flexShrink: 0, fontWeight: 700, fontSize: '0.6875rem',
                              color: 'var(--kg-error)' }}>あなた</span>
                          )}
                        </div>
                      );
                    })}
                    <p style={{ fontFamily: 'var(--font-jp)', fontSize: '0.8125rem',
                      color: 'var(--kg-ink-2)', lineHeight: 1.85, margin: 'var(--s-3) 0 0',
                      paddingLeft: 'var(--s-3)', borderLeft: '2px solid var(--kg-accent)' }}>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </div>{/* end review column */}

        </div>{/* end quiz-results-grid */}
      </div>
    );
  }

  /* ── 試験進行中 ── */
  const question = quizQuestions[currentQuestionIndex];
  if (!question) return null;

  const progress       = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const selectedAnswer = answers[currentQuestionIndex];

  const handleConfirm = () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      handleFinish(quizQuestions);
    } else {
      goToNextQuestion();
    }
  };

  const getQStatus = (i: number) => {
    if (i === currentQuestionIndex) return 'now';
    const ans = answers[i];
    if (ans === undefined || ans === null) return 'unanswered';
    if (ans === DONT_KNOW) return 'skip';
    return 'done';
  };

  return (
    <div className="fade-in">
      {showAbortDialog && (
        <AbortConfirmDialog
          onConfirm={handleAbortConfirm}
          onCancel={() => setShowAbortDialog(false)}
        />
      )}

      {/* 上部: 進捗 + タイマー + 中断 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 'var(--s-2)' }}>
        <span style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--kg-ink)' }}>
          問 {currentQuestionIndex + 1} / {quizQuestions.length}
        </span>
        <span
          aria-live="polite"
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-en)', fontSize: '0.8125rem', fontWeight: 700,
            color: isNearEnd ? 'var(--kg-error)' : 'var(--kg-ink-3)',
            letterSpacing: '0.03em',
            flex: '0 0 auto',
          }}
        >
          {isNearEnd && <IconClock />}
          {formatTime(remaining)}
        </span>
        <button
          className="btn btn-ghost"
          onClick={() => setShowAbortDialog(true)}
          style={{ padding: '0.3rem 0.75rem', fontSize: '0.8125rem', minHeight: 'var(--tap-min)' }}
        >
          中断
        </button>
      </div>

      <div className="progress-bar" style={{ marginBottom: 'var(--s-4)' }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* PC 2-column: 問題カード + ナビゲーターレール */}
      <div className="quiz-active-grid">

      {/* 設問 */}
      <div className="card">
        <p style={{ fontFamily: 'var(--font-jp)', fontWeight: 700, fontSize: '1.1rem',
          color: 'var(--kg-ink)', lineHeight: 1.7, marginBottom: 'var(--s-4)' }}>
          {question.question}
        </p>

        {question.options.map((option, idx) => {
          const isThisCorrect = idx === question.correctAnswer;
          const isUserPick    = selectedAnswer === idx;
          const isWrongPick   = isUserPick && !isThisCorrect;
          const showResult    = feedbackMode === 'immediate' && showImmediateFeedback;
          const isSelected    = feedbackMode === 'final' ? isUserPick : (!showResult && isUserPick);
          return (
            <div key={idx}
              className={`option-item${isSelected ? ' selected' : ''}`}
              style={{
                cursor: feedbackMode === 'immediate' && selectedAnswer !== undefined ? 'default' : 'pointer',
                ...(showResult && isThisCorrect ? {
                  border: '1px solid var(--kg-success)',
                  background: 'var(--kg-correct-bg)',
                } : showResult && isWrongPick ? {
                  border: '1px solid var(--kg-error)',
                  background: 'var(--kg-wrong-bg)',
                } : {}),
              }}
              onClick={() => {
                // immediate mode: lock after selection
                if (feedbackMode === 'immediate' && selectedAnswer !== undefined) return;
                selectAnswer(currentQuestionIndex, idx);
                if (feedbackMode === 'immediate') {
                  setShowImmediateFeedback(true);
                }
                // final mode: no auto-advance; user taps confirm button
              }}
            >
              <span className="option-letter" style={{
                ...(showResult ? {
                  color: isThisCorrect ? 'var(--kg-success)' : isWrongPick ? 'var(--kg-error)' : undefined,
                } : {}),
              }}>{String.fromCharCode(65 + idx)}.</span>
              <span style={{ flex: 1, color: 'var(--kg-ink)', fontFamily: 'var(--font-jp)' }}>{option}</span>
              {feedbackMode === 'final' && isUserPick && (
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-jp)', fontSize: '0.6875rem',
                  color: 'var(--kg-accent)', fontWeight: 700 }}>
                  選択中 · 変更可
                </span>
              )}
              {feedbackMode === 'immediate' && !showResult && isUserPick && (
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-jp)', fontSize: '0.6875rem',
                  color: 'var(--kg-accent)', fontWeight: 700 }}>
                  選択中
                </span>
              )}
              {showResult && isThisCorrect && (
                <span style={{ flexShrink: 0, fontWeight: 700, fontSize: '0.6875rem',
                  color: 'var(--kg-success)' }}>正解</span>
              )}
              {showResult && isWrongPick && (
                <span style={{ flexShrink: 0, fontWeight: 700, fontSize: '0.6875rem',
                  color: 'var(--kg-error)' }}>あなた</span>
              )}
            </div>
          );
        })}

        {/* final mode: 確定ボタン + わからない */}
        {feedbackMode === 'final' && (
          <>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 'var(--s-3)' }}
              disabled={selectedAnswer === undefined}
              onClick={handleConfirm}
            >
              {currentQuestionIndex === quizQuestions.length - 1 ? '結果を見る →' : '回答して次へ →'}
            </button>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 'var(--s-2)', fontSize: '0.875rem',
                color: 'var(--kg-ink-3)', borderStyle: 'dashed' }}
              onClick={() => {
                selectAnswer(currentQuestionIndex, DONT_KNOW);
                handleConfirm();
              }}
            >
              わからない →
            </button>
          </>
        )}

        {/* immediate mode: わからないは未選択時のみ */}
        {feedbackMode === 'immediate' && selectedAnswer === undefined && (
          <button
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: 'var(--s-3)', fontSize: '0.875rem',
              color: 'var(--kg-ink-3)', borderStyle: 'dashed' }}
            onClick={() => {
              selectAnswer(currentQuestionIndex, DONT_KNOW);
              setShowImmediateFeedback(true);
            }}
          >
            わからない →
          </button>
        )}

        {/* 即時フィードバック: 解説 + 次へボタン */}
        {feedbackMode === 'immediate' && showImmediateFeedback && (
          <div style={{ marginTop: 'var(--s-4)', borderTop: '1px solid var(--kg-rule)', paddingTop: 'var(--s-4)' }}>
            {selectedAnswer === DONT_KNOW && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--s-2)',
                padding: 'var(--s-2) var(--s-3)', marginBottom: 'var(--s-3)',
                borderRadius: 'var(--r-1)',
                border: '1px solid var(--kg-error)',
                background: 'var(--kg-wrong-bg)',
                fontFamily: 'var(--font-jp)', fontSize: '0.8125rem',
              }}>
                <span style={{ color: 'var(--kg-error)', fontWeight: 700 }}>?</span>
                <span style={{ color: 'var(--kg-ink)' }}>わからない（スキップ）</span>
              </div>
            )}
            <div style={{
              padding: 'var(--s-2)',
              borderRadius: 'var(--r-1)',
              background: selectedAnswer === question.correctAnswer ? 'var(--kg-correct-bg)' : 'var(--kg-wrong-bg)',
              border: `1px solid ${selectedAnswer === question.correctAnswer ? 'var(--kg-success)' : 'var(--kg-error)'}`,
              fontFamily: 'var(--font-jp)', fontSize: '0.8125rem', fontWeight: 700,
              color: selectedAnswer === question.correctAnswer ? 'var(--kg-success)' : 'var(--kg-error)',
              marginBottom: 'var(--s-3)',
              textAlign: 'center',
            }}>
              {selectedAnswer === question.correctAnswer ? '正解！' : '不正解'}
            </div>
            <p style={{ fontFamily: 'var(--font-jp)', fontSize: '0.8125rem',
              color: 'var(--kg-ink-2)', lineHeight: 1.85, margin: '0 0 var(--s-4)',
              paddingLeft: 'var(--s-3)', borderLeft: '2px solid var(--kg-accent)' }}>
              {question.explanation}
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                setShowImmediateFeedback(false);
                if (currentQuestionIndex === quizQuestions.length - 1) {
                  handleFinish(quizQuestions);
                } else {
                  goToNextQuestion();
                }
              }}
            >
              {currentQuestionIndex === quizQuestions.length - 1 ? '結果を見る →' : '次の問題 →'}
            </button>
          </div>
        )}
      </div>{/* end question card */}

      {/* PC 問題ナビゲーターレール */}
      <div className="quiz-nav-rail">
        <div style={{
          border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)',
          background: 'var(--kg-paper)', padding: 'var(--s-4)',
        }}>
          <p style={{ fontFamily: 'var(--font-jp)', fontWeight: 700, fontSize: '0.875rem',
            color: 'var(--kg-ink)', margin: '0 0 var(--s-3)' }}>
            問題一覧
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 7 }}>
            {quizQuestions.map((_, i) => {
              const st = getQStatus(i);
              return (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  style={{
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '0.75rem',
                    borderRadius: 'var(--r-1)', border: 'none', cursor: 'pointer',
                    ...(st === 'done'
                      ? { background: 'var(--kg-accent)', color: '#fff' }
                      : st === 'now'
                      ? { background: 'transparent', border: '2px solid var(--kg-accent)', color: 'var(--kg-accent)' }
                      : st === 'skip'
                      ? { background: 'var(--kg-warn-bg)', border: '1px solid var(--kg-warn)', color: 'var(--kg-warn)' }
                      : { background: 'var(--kg-paper)', border: '1px solid var(--kg-rule)', color: 'var(--kg-ink-3)' }),
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          {/* 凡例 */}
          <div style={{ marginTop: 'var(--s-4)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { bg: 'var(--kg-accent)', border: 'none', label: '回答済み' },
              { bg: 'transparent', border: '2px solid var(--kg-accent)', label: '現在' },
              { bg: 'var(--kg-warn-bg)', border: '1px solid var(--kg-warn)', label: 'わからない' },
              { bg: 'var(--kg-paper)', border: '1px solid var(--kg-rule)', label: '未回答' },
            ].map(({ bg, border, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 'var(--r-1)', flexShrink: 0,
                  background: bg, border, boxSizing: 'border-box' as const,
                }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--kg-ink-3)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      </div>{/* end quiz-active-grid */}
    </div>
  );
};
