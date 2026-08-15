import { ref, push, set, get, remove, update, runTransaction } from 'firebase/database';
import { database } from '../firebase';
import type { QuizSession, QuizAnswer, UserStats, UserRecord } from '../types/index';
import { questions } from '../data/clf-c02-questions';
import type { Question } from '../types/index';
import { toNameKey } from '../utils';

const sessionsPath = 'quizSessions';

// O(1) lookup — built once at module load
const questionMap = new Map<string, Question>(questions.map((q) => [q.id, q]));

export const updateUserStats = async (
  userId: string,
  displayName: string,
  answers: QuizAnswer[]
): Promise<void> => {
  const statsRef = ref(database, `userStats/${userId}`);
  await runTransaction(statsRef, (current: UserStats | null) => {
    const existing: UserStats = current ?? {
      userId,
      displayName,
      totalAnswered: 0,
      totalCorrect: 0,
      sessionCount: 0,
      categoryStats: {},
      difficultyStats: {},
      lastUpdated: 0,
    };

    existing.displayName = displayName;
    existing.sessionCount = (existing.sessionCount ?? 0) + 1;

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;

      existing.totalAnswered += 1;
      if (ans.correct) existing.totalCorrect += 1;

      const cat = q.category;
      if (!existing.categoryStats[cat]) existing.categoryStats[cat] = { total: 0, correct: 0 };
      existing.categoryStats[cat]!.total += 1;
      if (ans.correct) existing.categoryStats[cat]!.correct += 1;

      const diff = q.difficulty;
      if (!existing.difficultyStats[diff]) existing.difficultyStats[diff] = { total: 0, correct: 0 };
      existing.difficultyStats[diff]!.total += 1;
      if (ans.correct) existing.difficultyStats[diff]!.correct += 1;
    }

    existing.lastUpdated = Date.now();
    return existing;
  });
};

export const saveQuizSession = async (session: Omit<QuizSession, 'sessionId'>): Promise<string> => {
  const sessionRef = push(ref(database, `${sessionsPath}/${session.userId}`));
  const sessionId = sessionRef.key;
  if (!sessionId) throw new Error('試験セッション ID の生成に失敗しました');

  const payload: QuizSession = { ...session, sessionId };
  await set(sessionRef, payload);
  await updateUserStats(session.userId, session.displayName, session.answers);

  return sessionId;
};

export const fetchUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const statsRef = ref(database, `userStats/${userId}`);
    const snapshot = await get(statsRef);
    return snapshot.val() as UserStats | null;
  } catch (err) {
    console.error('fetchUserStats error', err);
    return null;
  }
};

export const fetchLeaderboard = async (): Promise<UserStats[]> => {
  try {
    const statsRef = ref(database, 'userStats');
    const snapshot = await get(statsRef);
    const raw = snapshot.val();
    if (!raw) return [];
    return Object.values(raw) as UserStats[];
  } catch (err) {
    console.error('fetchLeaderboard error', err);
    return [];
  }
};

// categoryStats はすでに userStats に集計済みなので sessions を再走査しない
export const fetchUserCategoryAccuracy = async (userId: string): Promise<Record<string, number>> => {
  try {
    const stats = await fetchUserStats(userId);
    if (!stats?.categoryStats) return {};
    const result: Record<string, number> = {};
    for (const [cat, stat] of Object.entries(stats.categoryStats)) {
      result[cat] = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    }
    return result;
  } catch (err) {
    console.error('fetchUserCategoryAccuracy error', err);
    return {};
  }
};

export const fetchUserSessions = async (userId: string): Promise<QuizSession[]> => {
  try {
    const snapshot = await get(ref(database, `quizSessions/${userId}`));
    const raw = snapshot.val();
    if (!raw) return [];
    return Object.values(raw) as QuizSession[];
  } catch (err) {
    console.error('fetchUserSessions error', err);
    return [];
  }
};

// ミッション進捗を Firebase に保存
export const saveMissionProgress = async (userId: string, completed: string[]): Promise<void> => {
  try {
    await set(ref(database, `missionProgress/${userId}`), completed);
  } catch (err) {
    console.error('saveMissionProgress error', err);
  }
};

// Firebase からミッション進捗を取得（失敗時は空配列）
export const loadMissionProgressFromFirebase = async (userId: string): Promise<string[]> => {
  try {
    const snapshot = await get(ref(database, `missionProgress/${userId}`));
    return (snapshot.val() as string[]) ?? [];
  } catch (err) {
    console.error('loadMissionProgressFromFirebase error', err);
    return [];
  }
};

/* ── 管理機能: アカウント管理 ── */

export const fetchAllUsers = async (): Promise<UserRecord[]> => {
  try {
    const snapshot = await get(ref(database, 'usersByName'));
    const raw = snapshot.val();
    if (!raw) return [];
    return Object.values(raw) as UserRecord[];
  } catch (err) {
    console.error('fetchAllUsers error', err);
    return [];
  }
};

export const deleteUserAccount = async (user: UserRecord): Promise<void> => {
  await Promise.all([
    remove(ref(database, `usersByName/${toNameKey(user.displayName)}`)),
    remove(ref(database, `userStats/${user.userId}`)),
    remove(ref(database, `quizSessions/${user.userId}`)),
    remove(ref(database, `missionProgress/${user.userId}`)),
  ]);
};

export const renameUserAccount = async (user: UserRecord, newDisplayName: string): Promise<void> => {
  const updatedUser: UserRecord = { ...user, displayName: newDisplayName };
  await set(ref(database, `usersByName/${toNameKey(newDisplayName)}`), updatedUser);
  if (toNameKey(newDisplayName) !== toNameKey(user.displayName)) {
    await remove(ref(database, `usersByName/${toNameKey(user.displayName)}`));
  }
  // userStats はクイズ受験前のユーザーには存在しないことがあるため、存在する場合のみ更新
  const statsSnapshot = await get(ref(database, `userStats/${user.userId}`));
  if (statsSnapshot.exists()) {
    await update(ref(database, `userStats/${user.userId}`), { displayName: newDisplayName });
  }
};
