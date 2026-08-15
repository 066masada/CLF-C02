import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { fetchAllUsers, fetchLeaderboard, deleteUserAccount, renameUserAccount } from '../../hooks/useFirebase';
import { formatDate } from '../../utils';
import type { UserStats } from '../../types/index';

const ADMIN_UNLOCK_KEY = 'clf-c02-admin-unlocked';
const MAX_NAME_LENGTH = 20;

interface AccountRow {
  userId: string;
  displayName: string;
  // usersByName に登録が無い（登録失敗・移行前データ等）場合は null
  createdAt: number | null;
  totalAnswered: number;
  totalCorrect: number;
  sessionCount: number;
}

const AdminPinGate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PIN as string | undefined;
    if (!expected) {
      setError('管理者PINが設定されていません（VITE_ADMIN_PIN）。');
      return;
    }
    if (pin === expected) {
      sessionStorage.setItem(ADMIN_UNLOCK_KEY, '1');
      onUnlock();
    } else {
      setError('PINが正しくありません。');
      setPin('');
    }
  };

  return (
    <div className="user-entry-outer">
      <div className="user-entry-card fade-in">
        <div className="user-entry-hero">
          <div className="user-entry-icon">
            <span>ADMIN</span>
          </div>
          <span className="entry-eyebrow">restricted area</span>
          <h1 className="entry-title">
            管理者PINを<br />入力してください
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--s-4)' }}>
            <input
              className="user-input"
              type="password"
              placeholder="PINコード"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(''); }}
              autoFocus
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
          >
            解除 →
          </button>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({
  user, onCancel, onConfirm,
}: {
  user: AccountRow;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      padding: 'var(--s-4)',
    }}
    onClick={onCancel}
  >
    <div
      style={{
        width: '100%', maxWidth: 420,
        background: 'var(--kg-paper)',
        borderRadius: 'var(--r-2)',
        padding: 'var(--s-5) var(--s-4)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2 style={{ margin: '0 0 var(--s-2)', color: 'var(--kg-ink)' }}>アカウントを削除しますか？</h2>
      <p style={{ margin: '0 0 var(--s-4)', fontSize: '0.875rem', color: 'var(--kg-ink-2)', lineHeight: 1.6 }}>
        「{user.displayName}」の登録情報・成績・受験履歴・ミッション進捗をすべて削除します。この操作は取り消せません。
      </p>
      <div style={{ display: 'flex', gap: 'var(--s-2)', justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onCancel}>キャンセル</button>
        <button
          className="btn"
          style={{ background: 'var(--kg-error)', color: '#fff' }}
          onClick={onConfirm}
        >
          削除する
        </button>
      </div>
    </div>
  </div>
);

export const AdminPage = () => {
  const { navigate } = useNavigation();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ADMIN_UNLOCK_KEY) === '1');
  const [rows, setRows] = useState<AccountRow[] | null>(null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deletingRow, setDeletingRow] = useState<AccountRow | null>(null);
  const [actionError, setActionError] = useState('');

  const loadRows = async () => {
    // usersByName（ログイン時登録）と userStats（受験時に自動生成）の両方を突き合わせる。
    // 前者だけだと、名前登録が失敗した/ルール未整備だった時期のアカウントが一覧から漏れる。
    const [users, stats] = await Promise.all([fetchAllUsers(), fetchLeaderboard()]);
    const rowMap = new Map<string, AccountRow>();
    for (const u of users) {
      rowMap.set(u.userId, {
        userId: u.userId,
        displayName: u.displayName,
        createdAt: u.createdAt,
        totalAnswered: 0,
        totalCorrect: 0,
        sessionCount: 0,
      });
    }
    for (const s of stats as UserStats[]) {
      const existing = rowMap.get(s.userId);
      if (existing) {
        existing.totalAnswered = s.totalAnswered;
        existing.totalCorrect = s.totalCorrect;
        existing.sessionCount = s.sessionCount;
      } else {
        rowMap.set(s.userId, {
          userId: s.userId,
          displayName: s.displayName,
          createdAt: null,
          totalAnswered: s.totalAnswered,
          totalCorrect: s.totalCorrect,
          sessionCount: s.sessionCount,
        });
      }
    }
    const merged = Array.from(rowMap.values())
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
    setRows(merged);
  };

  useEffect(() => {
    if (!unlocked) return;
    loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.displayName.toLowerCase().includes(q));
  }, [rows, search]);

  if (!unlocked) {
    return <AdminPinGate onUnlock={() => setUnlocked(true)} />;
  }

  const startEdit = (row: AccountRow) => {
    setEditingId(row.userId);
    setEditValue(row.displayName);
    setActionError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async (row: AccountRow) => {
    const trimmed = editValue.trim();
    if (!trimmed) { setActionError('表示名を入力してください'); return; }
    try {
      await renameUserAccount(
        { userId: row.userId, displayName: row.displayName, createdAt: row.createdAt ?? Date.now() },
        trimmed,
      );
      setEditingId(null);
      await loadRows();
    } catch (err) {
      console.error('renameUserAccount error', err);
      setActionError('表示名の更新に失敗しました');
    }
  };

  const confirmDelete = async () => {
    if (!deletingRow) return;
    try {
      await deleteUserAccount({
        userId: deletingRow.userId,
        displayName: deletingRow.displayName,
        createdAt: deletingRow.createdAt ?? 0,
      });
      setDeletingRow(null);
      await loadRows();
    } catch (err) {
      console.error('deleteUserAccount error', err);
      setActionError('削除に失敗しました');
      setDeletingRow(null);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
      {deletingRow && (
        <DeleteConfirmModal
          user={deletingRow}
          onCancel={() => setDeletingRow(null)}
          onConfirm={confirmDelete}
        />
      )}

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--s-2)', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
          <div>
            <p className="eyebrow">admin</p>
            <h2 style={{ margin: 0, color: 'var(--kg-ink)' }}>アカウント管理</h2>
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => {
              sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
              navigate('home');
            }}
          >
            管理画面を閉じる
          </button>
        </div>

        <input
          className="user-input"
          type="text"
          placeholder="表示名で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 'var(--s-4)' }}
        />

        {actionError && (
          <p style={{ marginBottom: 'var(--s-3)', fontSize: '0.8125rem', color: 'var(--kg-error)' }}>
            {actionError}
          </p>
        )}

        {filtered === null ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--s-3)', padding: 'var(--s-3)' }}>
                <div className="skeleton" style={{ flex: 1, height: 18 }} />
                <div className="skeleton" style={{ width: 60, height: 18 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--kg-ink-3)' }}>
              該当するアカウントがありません。
            </p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {filtered.map((row, idx) => (
              <div
                key={row.userId}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--s-3)',
                  padding: 'var(--s-3) var(--s-4)',
                  borderTop: idx === 0 ? 'none' : '1px solid var(--kg-rule)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  {editingId === row.userId ? (
                    <input
                      className="user-input"
                      value={editValue}
                      maxLength={MAX_NAME_LENGTH}
                      autoFocus
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{ padding: '6px 10px', fontSize: '0.875rem' }}
                    />
                  ) : (
                    <>
                      <p style={{
                        margin: '0 0 2px', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--kg-ink)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {row.displayName}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--kg-ink-4)', fontFamily: 'var(--font-en)' }}>
                        {row.createdAt !== null ? `登録 ${formatDate(row.createdAt)}` : '登録日不明'}
                      </p>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 'var(--s-3)', fontSize: '0.75rem', color: 'var(--kg-ink-3)', flexShrink: 0 }}>
                  <span>解答 {row.totalAnswered}</span>
                  <span>正解 {row.totalCorrect}</span>
                  <span>試験 {row.sessionCount}回</span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--s-2)', flexShrink: 0 }}>
                  {editingId === row.userId ? (
                    <>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
                        onClick={() => saveEdit(row)}
                      >
                        保存
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
                        onClick={cancelEdit}
                      >
                        キャンセル
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
                        onClick={() => startEdit(row)}
                      >
                        編集
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8125rem', color: 'var(--kg-error)' }}
                        onClick={() => setDeletingRow(row)}
                      >
                        削除
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
