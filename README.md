# CLF-C02 学習アプリ

AWS 認定 クラウドプラクティショナー（CLF-C02）試験対策のための PWA 学習アプリです。
AIF-C01 版アプリと同じ枠組みをベースに作成しています。

## 目的

- AWS Cloud Practitioner の出題範囲に沿った模擬問題を提供
- 学習モードとクイズモードを両方搭載
- Firebase Realtime Database に成績を保存
- PWA 対応でオフラインでも学習可能

## 主な機能

- 学習モード：分野・難易度でフィルタリングして問題を学習
- クイズモード：ランダムな問題でスコアを判定
- リーダーボード：Firebase に保存された成績を表示
- ユーザー管理：ローカルに名前を保存して再利用

## 必要な環境

- Node.js 18 以上
- npm 10 以上

## インストール

```bash
npm install
```

## Firebase 設定

AIF-C01 版とはデータを分離するため、**新しい Firebase プロジェクト**を作成してください。

1. Firebase コンソールで新規プロジェクト・Web アプリを作成
2. Realtime Database を有効化
3. `firebaseConfig` の値を `.env` に記載
4. `.firebaserc` の `default` を作成したプロジェクトIDに書き換える

### `.env` の例

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_FIREBASE_DATABASE_URL=https://<your-project>.firebaseio.com/
VITE_ADMIN_PIN=...
```

### `.env.example`

このリポジトリには `.env.example` が含まれています。実際の設定は `.env` にコピーして記載してください。

## 実行

```bash
npm run dev
```

## ビルド

```bash
npm run build
```

## Git の注意点

- `.env` は `.gitignore` に追加されています
- Firebase の秘密情報はリポジトリに含めないでください

## TODO：CLF-C02 コンテンツへの差し替え

AIF-C01 版から複製したままの箇所です。順に差し替えてください。

- [ ] `src/data/clf-c02-questions.ts` — 問題データ（現在は空の配列のみ）
- [ ] `src/types/index.ts` の `QuestionCategory` — カテゴリ構成を CLF-C02 のドメインに合わせて再定義
      （参考：Cloud Concepts 24% / Security and Compliance 30% / Cloud Technology and Services 34% / Billing, Pricing and Support 12%）
- [ ] `src/data/clf-c02-questions.ts` 内の `questionsByCategory` / `categoryLabels` / `radarCategoryLabels` を上記カテゴリに合わせて更新
- [ ] `src/utils/index.ts` の `CATS`（合格確率計算のカテゴリ一覧）も同様に更新
- [ ] `src/data/glossary.ts` — 用語集（AIF-C01 の内容のまま）
- [ ] `src/data/study-notes.ts` — 学習ノート（AIF-C01 の内容のまま）
- [ ] `src/data/missions.ts` — ロールプレイ学習のストーリー・章構成（AIF-C01 の内容のまま）
- [ ] `CHANGELOG.md` / `src/data/changelog.ts` — このアプリ独自の更新履歴として書き直す

## 追加情報

- PWA は `vite-plugin-pwa` で構成されています
- Firebase Realtime Database は `src/hooks/useFirebase.ts` で使用されています
- `src/components/pages/` に主要な画面コンポーネントが配置されています
