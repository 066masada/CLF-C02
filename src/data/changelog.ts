export interface ChangelogEntry {
  date: string;
  label: string;
  items: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-08-15',
    label: 'v0.1.0',
    items: [
      'AIF-C01 版アプリの枠組みをベースに CLF-C02 用リポジトリを新規作成',
    ],
  },
];
