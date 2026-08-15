import { useState, type FormEvent } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../../firebase';
import { generateUserId, toNameKey } from '../../utils';
import type { UserRecord } from '../../types/index';

const NAME_UID_MAP_KEY = 'clf-c02-user-map';
const MAX_NAME_LENGTH = 20;

const loadUserMap = (): Record<string, UserRecord> => {
  try { return JSON.parse(localStorage.getItem(NAME_UID_MAP_KEY) ?? '{}'); }
  catch { return {}; }
};
const saveUserMap = (map: Record<string, UserRecord>) => {
  localStorage.setItem(NAME_UID_MAP_KEY, JSON.stringify(map));
};

const findUserByName = async (name: string): Promise<UserRecord | null> => {
  try {
    const snap = await get(ref(database, `usersByName/${toNameKey(name)}`));
    return snap.val() as UserRecord | null;
  } catch {
    return null;
  }
};

const registerUserByName = async (user: UserRecord): Promise<void> => {
  try {
    await set(ref(database, `usersByName/${toNameKey(user.displayName)}`), user);
  } catch {
    // non-critical: falls back to localStorage on next login from same device
  }
};

interface UserEntryPageProps {
  onSubmit: (user: UserRecord) => void;
}

export const UserEntryPage = ({ onSubmit }: UserEntryPageProps) => {
  const [displayName, setDisplayName]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice]             = useState('');
  const [error, setError]               = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      setError('名前を入力してください');
      return;
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      setError(`名前は${MAX_NAME_LENGTH}文字以内で入力してください`);
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      if (!auth.currentUser) await signInAnonymously(auth);

      // 1. Firebase を優先して検索（クロスデバイス引き継ぎ）
      let newUser = await findUserByName(trimmedName);
      if (newUser) {
        setNotice('前回の記録を引き継ぎます。');
        // ローカルキャッシュを最新に同期
        const userMap = loadUserMap();
        userMap[trimmedName] = newUser;
        saveUserMap(userMap);
      } else {
        // 2. 同デバイスのローカルキャッシュを確認
        const userMap = loadUserMap();
        if (userMap[trimmedName]) {
          newUser = userMap[trimmedName];
          setNotice('前回の記録を引き継ぎます。');
          // Firebase に登録して次回のクロスデバイス引き継ぎに備える
          await registerUserByName(newUser);
        } else {
          // 3. 新規ユーザーを作成
          newUser = { userId: generateUserId(), displayName: trimmedName, createdAt: Date.now() };
          userMap[trimmedName] = newUser;
          saveUserMap(userMap);
          await registerUserByName(newUser);
        }
      }
      setTimeout(() => onSubmit(newUser!), 300);
    } catch (err) {
      console.error('認証エラー:', err);
      setIsSubmitting(false);
      setError('初期化に失敗しました。再度お試しください。');
    }
  };

  const remaining = MAX_NAME_LENGTH - displayName.trim().length;

  return (
    <div className="user-entry-outer">
      <div className="user-entry-card fade-in">

        {/* ── ヒーロー ── */}
        <div className="user-entry-hero">
          <div className="user-entry-icon">
            <span>CLF-C02</span>
          </div>
          <span className="entry-eyebrow">aws cloud practitioner</span>
          <h1 className="entry-title">
            試験対策アプリへ、<br />ようこそ。
          </h1>
          <span className="entry-sub">Carve out your own pass.</span>
        </div>

        {/* ── フォーム ── */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--s-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 'var(--s-2)' }}>
              <label style={{
                fontFamily: 'var(--font-jp)', fontWeight: 700,
                fontSize: '0.8125rem', color: 'var(--kg-ink)', letterSpacing: '0.02em',
              }}>
                お名前
              </label>
              <span style={{
                fontSize: '0.6875rem',
                color: remaining < 5 ? 'var(--kg-warn)' : 'var(--kg-ink-4)',
                fontFamily: 'var(--font-en)',
              }}>
                {remaining < MAX_NAME_LENGTH ? `あと ${remaining} 文字` : `最大 ${MAX_NAME_LENGTH} 文字`}
              </span>
            </div>
            <input
              className="user-input"
              type="text"
              placeholder="例) 山田太郎"
              value={displayName}
              maxLength={MAX_NAME_LENGTH}
              onChange={(e) => { setDisplayName(e.target.value); setError(''); }}
              disabled={isSubmitting}
            />
            {error && (
              <p style={{
                marginTop: 'var(--s-2)', fontSize: '0.8125rem',
                color: 'var(--kg-error)', lineHeight: 1.5,
              }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn start-btn"
            style={{ width: '100%', fontSize: '0.9375rem', padding: '0.875rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? '読み込み中...' : '学習を開始 →'}
          </button>
        </form>

        {notice && (
          <p style={{
            marginTop: 'var(--s-3)', color: 'var(--kg-success)',
            fontSize: '0.8125rem', textAlign: 'center', lineHeight: 1.6,
          }}>
            {notice}
          </p>
        )}

        <p className="user-entry-hint">
          名前だけで学習を始められます。
        </p>
      </div>
    </div>
  );
};
