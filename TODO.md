# CLF-C02 アプリ 作業引き継ぎメモ

最終更新: 2026-08-15
このファイルは別セッションでの継続作業用です。作業が進んだら都度更新・チェックしてください。

## これまでにやったこと

AIF-C01アプリ（`c:\work\KG\AIF-C01`）を土台に、`c:\work\KG\CLF-C02` へ新規リポジトリとして複製した。

- コード一式をコピー（`node_modules` / `dist` / `.git` は除外）
- 以下は機密・AIF-C01固有のためコピーしなかった：
  `auth-export.json`、`PROJECT_SUMMARY.md`、`SESSION_SUMMARY.md`、`.env`、
  `design_handoff_pc_layout/`、`design_handoff_ui_improvements/`、`screenshot/`、`.claude/`
- ブランディングをCLF-C02向けに変更済み：
  - `package.json`（name: `clf-c02`, version: `0.1.0`）
  - `index.html`（title）
  - `vite.config.ts`（PWA manifest の name/short_name/description）
  - ヘッダーロゴ・ユーザー登録画面バッジ（`src/App.tsx`, `src/components/pages/UserEntryPage.tsx`）
  - 資格マップの `current` フラグ（`src/components/pages/StudyPage.tsx`）
  - localStorageキー：`aif-c01-user-map` → `clf-c02-user-map`、`aif-c01-admin-unlocked` → `clf-c02-admin-unlocked`、`aif-c01-mission-progress-{userId}` → `clf-c02-mission-progress-{userId}`
- `src/data/aif-c01-questions.ts` を `src/data/clf-c02-questions.ts` にリネームし、`questions` 配列を空にした（構造だけ残したテンプレート）。全参照ファイルのimportも更新済み。
- `.firebaserc` の `default` をプレースホルダー `YOUR_NEW_FIREBASE_PROJECT_ID` に変更
- `CHANGELOG.md` / `src/data/changelog.ts` を v0.1.0 で作り直し
- `README.md` を書き直し、TODOセクションを追加
- `TECHNICAL.md` の冒頭にAIF-C01からの複製である旨の注意書きを追加（本文はまだAIF-C01のまま）
- `npm install` → `npm run build` で型エラーなしを確認
- `git init` して初回コミット済み（`f84e70e`）。**GitHubへのpushはまだ**

## 未完了タスク（優先順）

### 1. GitHubリポジトリの作成とpush
- [ ] GitHubで新規リポジトリを作成（例: `066masada/CLF-C02`）
- [ ] ローカルにリモートを追加してpush
  ```bash
  cd "c:/work/KG/CLF-C02"
  git remote add origin https://github.com/066masada/CLF-C02.git
  git push -u origin master
  ```

### 2. Firebaseプロジェクトの新規作成
AIF-C01とデータを分離するため、新しいFirebaseプロジェクトが必要。
- [ ] Firebaseコンソールで新規プロジェクト・Webアプリを作成
- [ ] Realtime Databaseを有効化（ルールは `database.rules.json` をそのまま流用可、内容は汎用的でCLF-C02固有の記述なし）
- [ ] `.env.example` を `.env` にコピーし、新プロジェクトの値を記入
- [ ] `.firebaserc` の `default` を新プロジェクトIDに書き換え
- [ ] Firebase Hostingサイトを用意し `firebase deploy` できることを確認

### 3. 出題ドメイン構成の再設計（コンテンツ作成の前提）
CLF-C02の出題ドメイン（AWS公式試験ガイド）:
| ドメイン | 比率 |
|---|---|
| Domain 1: Cloud Concepts | 24% |
| Domain 2: Security and Compliance | 30% |
| Domain 3: Cloud Technology and Services | 34% |
| Domain 4: Billing, Pricing, and Support | 12% |

- [ ] `src/types/index.ts` の `QuestionCategory` をCLF-C02のカテゴリ構成に再定義
      （現状は暫定で AIF-C01 の `'ai-basics' | 'ml-fundamentals' | 'aws-services' | 'ethics' | 'practice'` のまま）
- [ ] `src/data/clf-c02-questions.ts` 内の `questionsByCategory` / `categoryLabels` / `radarCategoryLabels` を新カテゴリに合わせて更新
- [ ] `src/utils/index.ts` の `calculatePassProbability`（付近）内の `CATS` 配列も新カテゴリに合わせて更新（合格確率計算のドメインカバレッジ判定に使用）

### 4. 問題データの作成
- [ ] `src/data/clf-c02-questions.ts` の `questions` 配列に問題を追加（現在は空配列）
  - 型は `Question`（`src/types/index.ts`）: `id`, `category`, `difficulty`, `question`, `description`, `options`, `correctAnswer`, `explanation`, `tags`, `verified`
  - 参考: `scripts/extract-questions.mjs` は画像/PDFの模擬試験からGPT等で問題を抽出するスクリプト（AIF-C01用に作ったものbut汎用的に使えるはず。プロンプト文言はCLF-C02向けに直しておいた）

### 5. その他コンテンツの書き換え（AIF-C01の内容がそのまま残っている）
- [ ] `src/data/glossary.ts` — 用語集
- [ ] `src/data/study-notes.ts` — 学習ノート
- [ ] `src/data/missions.ts` — ロールプレイ学習のストーリー・章構成（キャラクター会話含む、AIF-C01の13章構成がそのまま残っている）
- [ ] `TECHNICAL.md` 本文（URL・リポジトリリンク・問題数・出題比率表など）

### 6. 動作確認
- [ ] `npm run dev` でローカル起動し、クイズ・学習モード・ミッションモード・ランキング・管理画面がCLF-C02の内容で動くか確認
- [ ] PWAインストール・オフライン動作の確認
- [ ] Firebase Hostingへデプロイして本番確認

## 参考コマンド

```bash
cd "c:/work/KG/CLF-C02"
npm install       # 初回のみ（node_modulesは未コミット）
npm run dev        # 開発サーバー
npm run build       # ビルド確認（型チェック含む）
```
