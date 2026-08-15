export interface ChangelogEntry {
  date: string;
  label: string;
  items: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-08-15',
    label: 'v0.2.0',
    items: [
      'GitHub リポジトリを作成し push',
      '新規 Firebase プロジェクトを作成し、Realtime Database を有効化',
      '出題ドメインを CLF-C02 の4ドメイン構成に再定義',
      'クイズ問題データにサンプル25問を追加',
      '用語集をCLF-C02向けに47語で書き換え',
    ],
  },
  {
    date: '2026-08-15',
    label: 'v0.1.0',
    items: [
      'AIF-C01 版アプリの枠組みをベースに CLF-C02 用リポジトリを新規作成',
    ],
  },
];
