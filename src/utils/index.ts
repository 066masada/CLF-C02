import type { UserStats, QuestionCategory, QuizSession, Question } from '../types/index';

export const generateUserId = (): string => {
  return `user_${crypto.randomUUID().replace(/-/g, '')}`;
};

// Firebase path keys cannot contain . # $ [ ] /
export const toNameKey = (name: string): string =>
  name.trim().replace(/[.#$[\]/]/g, '-');

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('ja-JP');
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const calculateAccuracy = (correct: number, total: number): number => {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 選択肢の並びをシャッフルし、正解インデックスをシャッフル後の位置に付け替える
// （選択肢の位置パターンで正解を推測できてしまうのを防ぐ）
export const shuffleQuestionOptions = (question: Question): Question => {
  const order = shuffleArray(question.options.map((_, i) => i));
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    correctAnswer: order.indexOf(question.correctAnswer),
  };
};

export const calculatePassProbability = (stats: UserStats): number => {
  const { totalAnswered, totalCorrect, categoryStats, difficultyStats } = stats;
  if (totalAnswered === 0) return 0;

  const rawAccuracy = totalCorrect / totalAnswered;

  // Difficulty-weighted accuracy only (no mix with raw)
  const easy   = difficultyStats?.easy   ?? { total: 0, correct: 0 };
  const medium = difficultyStats?.medium ?? { total: 0, correct: 0 };
  const hard   = difficultyStats?.hard   ?? { total: 0, correct: 0 };
  const wCorrect = easy.correct * 0.7 + medium.correct * 1.0 + hard.correct * 1.4;
  const wTotal   = easy.total   * 0.7 + medium.total   * 1.0 + hard.total   * 1.4;
  const weightedAcc = wTotal > 0 ? wCorrect / wTotal : rawAccuracy;

  // Volume factor: calibrated to a ~65-question exam — ~63% at 50q, ~86% at 100q
  const volumeFactor = 1 - Math.exp(-totalAnswered / 50);

  // Bayesian shrinkage toward 0.65 (optimistic prior just above pass threshold)
  const PRIOR = 0.65;
  const adjustedAcc = weightedAcc * volumeFactor + PRIOR * (1 - volumeFactor);

  // Domain coverage penalty: 0.80 (no coverage) → 1.0 (full coverage)
  const CATS: QuestionCategory[] = ['cloud-concepts', 'security-compliance', 'cloud-technology', 'billing-support'];
  const covered = CATS.filter((c) => (categoryStats?.[c]?.total ?? 0) >= 5).length;
  const domainFactor = 0.80 + 0.20 * (covered / CATS.length);

  // Weak-category penalty: if any covered category is below 60%, apply a reduction
  const catAccList = CATS.map((c) => {
    const s = categoryStats?.[c];
    return s && s.total >= 5 ? s.correct / s.total : null;
  }).filter((v): v is number => v !== null);
  const minCatAcc = catAccList.length > 0 ? Math.min(...catAccList) : weightedAcc;
  const balancePenalty = minCatAcc < 0.60 ? 0.80 + 0.20 * (minCatAcc / 0.60) : 1.0;

  const finalEstimate = adjustedAcc * domainFactor * balancePenalty;

  // Logistic sigmoid (steepness -12); passing score = 70%
  const probability = 1 / (1 + Math.exp(-12 * (finalEstimate - 0.70)));
  return Math.round(probability * 100);
};

const toDateKey = (ts: number): string => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const calculateStreak = (sessions: QuizSession[]): number => {
  if (!sessions.length) return 0;
  const dates = new Set(sessions.map((s) => toDateKey(s.timestamp)));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!dates.has(toDateKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(toDateKey(cursor.getTime()))) return 0;
  }
  let streak = 0;
  while (dates.has(toDateKey(cursor.getTime()))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const getTodaySummary = (sessions: QuizSession[]): { answered: number; correct: number } => {
  const todayKey = toDateKey(Date.now());
  return sessions
    .filter((s) => toDateKey(s.timestamp) === todayKey)
    .reduce(
      (acc, s) => ({ answered: acc.answered + s.total, correct: acc.correct + s.score }),
      { answered: 0, correct: 0 },
    );
};

export const getWeekActivity = (sessions: QuizSession[]): boolean[] => {
  const dates = new Set(sessions.map((s) => toDateKey(s.timestamp)));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return dates.has(toDateKey(d.getTime()));
  });
};

export const getExamTitle = (passProbability: number, totalAnswered: number) => {
  if (totalAnswered < 5) return { label: '未挑戦', icon: '🌱', color: '#6ee7b7' };
  if (passProbability >= 88) return { label: '合格確実', icon: '🏆', color: '#fbbf24' };
  if (passProbability >= 72) return { label: '合格圏内', icon: '💎', color: '#60a5fa' };
  if (passProbability >= 50) return { label: '中級者', icon: '🥇', color: '#fb923c' };
  if (passProbability >= 28) return { label: '学習中', icon: '🥈', color: '#94a3b8' };
  return { label: '初学者', icon: '📚', color: '#a78bfa' };
};
