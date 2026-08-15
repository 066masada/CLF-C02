# CLF-C02 アプリ 作業引き継ぎメモ

最終更新: 2026-08-15
このファイルは別セッションでの継続作業用です。作業が進んだら都度更新・チェックしてください。

**現在の状態**: GitHub push済み（https://github.com/066masada/CLF-C02 ／ 最新コミット `d2fa234`）、Firebase Hosting公開済み（https://clf-c02.web.app ／ v0.2.0）。ステップ1〜3完了、ステップ4（問題データ）はサンプル25問のみ、ステップ5（コンテンツ書き換え）は用語集のみ完了。詳細は下記「未完了タスク」参照。

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

### 1. GitHubリポジトリの作成とpush 【完了】
- [x] GitHubで新規リポジトリを作成（`066masada/CLF-C02`）
- [x] ローカルにリモートを追加してpush

### 2. Firebaseプロジェクトの新規作成
AIF-C01とデータを分離するため、新しいFirebaseプロジェクトが必要。
- [x] Firebaseコンソールで新規プロジェクト・Webアプリを作成（プロジェクトID: `clf-c02`）
- [x] Realtime Databaseを有効化・ルールをデプロイ（`https://clf-c02-default-rtdb.firebaseio.com/`）
- [x] `.env.example` を `.env` にコピーし、新プロジェクトの値を記入（`.gitignore`対象を確認済み）
- [x] `.firebaserc` の `default` を新プロジェクトIDに書き換え（`clf-c02`）
- [x] Firebase Hostingサイトを用意し `firebase deploy` できることを確認（公開URL: https://clf-c02.web.app ／ PWAオフライン動作の実機確認はステップ6で継続実施）

### 3. 出題ドメイン構成の再設計（コンテンツ作成の前提） 【完了】
CLF-C02の出題ドメイン（AWS公式試験ガイド）:
| ドメイン | 比率 | QuestionCategoryキー |
|---|---|---|
| Domain 1: Cloud Concepts | 24% | `cloud-concepts` |
| Domain 2: Security and Compliance | 30% | `security-compliance` |
| Domain 3: Cloud Technology and Services | 34% | `cloud-technology` |
| Domain 4: Billing, Pricing, and Support | 12% | `billing-support` |

- [x] `src/types/index.ts` の `QuestionCategory` を上記4ドメインに再定義
- [x] `src/data/clf-c02-questions.ts` 内の `questionsByCategory` / `categoryLabels` / `radarCategoryLabels` を新カテゴリに更新
- [x] `src/utils/index.ts` の `CATS` 配列を新カテゴリに更新
- [x] （追加対応）型エラー解消のため以下も新カテゴリに合わせて更新: `src/components/HistoryTimeline.tsx`、`src/hooks/useQuestionsStore.ts`、`src/components/pages/QuizPage.tsx`、`src/components/pages/HomePage.tsx`、`src/data/missions.ts`（各ミッション章の`category`値。**旧カテゴリからの暫定マッピングのみ**で、ストーリー内容自体はAIF-C01のまま＝ステップ5で要書き換え）
- [x] `npm run build` で型エラーなしを確認

### 4. 問題データの作成 【一部完了（サンプル25問）】
- [x] `src/data/clf-c02-questions.ts` の `questions` 配列にサンプル問題25問を追加
      （cloud-concepts 6問 / security-compliance 6問 / cloud-technology 9問 / billing-support 4問。ビルド確認済み）
- [ ] 本番運用に足る問題数まで増強（各ドメインとも数十問規模が望ましい）
- [x] （追加対応）`scripts/extract-questions.mjs` のカテゴリ定義がAIF-C01の旧カテゴリ（ai-basics等）のまま放置されていたため、新4ドメイン（cloud-concepts / security-compliance / cloud-technology / billing-support）に合わせて`ID_PREFIX`とプロンプト文言を修正済み

### 5. その他コンテンツの書き換え（AIF-C01の内容がそのまま残っている）
- [x] `src/data/glossary.ts` — 用語集をCLF-C02の4ドメイン構成（cloud-concepts / security-compliance / cloud-technology / billing-support）で47語に書き換え済み。`GlossaryCategory`型・`src/components/pages/TermsTab.tsx`のカテゴリ一覧も合わせて更新、ビルド確認済み
- [ ] `src/data/study-notes.ts` — 学習ノート
- [ ] `src/data/missions.ts` — ロールプレイ学習のストーリー・章構成（キャラクター会話含む、AIF-C01の13章構成がそのまま残っている。**注**: `category`フィールドの値は既にステップ3で新4ドメインへ暫定マッピング済みだが、ストーリー内容自体はAI/ML題材のまま未着手）
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
