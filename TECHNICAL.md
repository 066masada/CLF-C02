# CLF-C02 AWS Cloud Practitioner 試験対策アプリ — 技術資料

> **TODO**: このファイルは AIF-C01 版から複製したままで、URL・リポジトリ・問題数・出題比率などの記述が旧アプリのままです。
> アーキテクチャの説明自体は流用できますが、固有の数値・リンクは CLF-C02 用に書き直してください（README.md の TODO も参照）。

## 概要

AWS 認定 AI Practitioner (AIF-C01) の試験対策 SPA。  
モバイルファースト設計で、問題演習・スタディモード・ストーリー形式のミッションモード・ランキングを提供する。

- **URL**: https://aif-c01-3abea.web.app
- **GitHub**: https://github.com/066masada/AIF-C01

---

## 技術スタック

| 分類 | 技術 | バージョン |
|------|------|-----------|
| UI フレームワーク | React | 19.x |
| 言語 | TypeScript | 6.x |
| ビルドツール | Vite | 8.x |
| PWA | vite-plugin-pwa | 1.x |
| バックエンド (DB) | Firebase Realtime Database | - |
| バックエンド (認証) | Firebase Anonymous Authentication | - |
| ホスティング | Firebase Hosting | - |
| スタイリング | カスタム CSS (index.css) | - |

外部 UI ライブラリ・CSS フレームワークは使用していない。

---

## ディレクトリ構成

```
AIF-C01/
├── src/
│   ├── main.tsx                    # エントリーポイント
│   ├── App.tsx                     # ルートコンポーネント・画面切り替え
│   ├── firebase.ts                 # Firebase 初期化 (database, auth)
│   ├── index.css                   # グローバルスタイル (ダークネイビー/パープルテーマ)
│   ├── components/
│   │   ├── RadarChart.tsx          # レーダーチャート (Canvas API)
│   │   └── pages/
│   │       ├── UserEntryPage.tsx   # ログイン画面
│   │       ├── HomePage.tsx        # ダッシュボード
│   │       ├── StudyPage.tsx       # 学習モード
│   │       ├── QuizPage.tsx        # 試験モード
│   │       ├── RankingPage.tsx     # ランキング
│   │       └── MissionMode.tsx     # ミッションモード (ストーリー形式)
│   ├── contexts/
│   │   └── UserContext.tsx         # ユーザー情報の Context/Provider
│   ├── hooks/
│   │   ├── useFirebase.ts          # Firebase 読み書きロジック
│   │   ├── useQuiz.ts              # クイズ状態管理
│   │   └── useQuestionsStore.ts    # 問題フィルタリング
│   ├── data/
│   │   ├── aif-c01-questions.ts    # 問題データ (97問)
│   │   └── missions.ts             # ミッションデータ・キャラクター定義
│   ├── types/
│   │   └── index.ts                # 型定義
│   └── utils/
│       └── index.ts                # 共通ユーティリティ
├── firebase.json                   # Firebase 設定 (hosting + database rules)
├── database.rules.json             # Realtime Database セキュリティルール
└── public/
    ├── favicon.svg
    └── icons.svg
```

---

## 画面構成

| 画面 | コンポーネント | 概要 |
|------|--------------|------|
| ログイン | `UserEntryPage` | 名前入力・ユーザー識別 |
| ホーム | `HomePage` | 学習統計・合格確率・レーダーチャート |
| 学習 | `StudyPage` | カテゴリ/難易度フィルター・フラッシュカード形式 |
| 試験 | `QuizPage` | 本番形式・タイマー・結果サマリー |
| ランキング | `RankingPage` | Firebase 全ユーザーの正答率ランキング |
| ミッション | `MissionMode` | ストーリー会話形式の学習・8ミッション構成 |

---

## ユーザー識別とデータ管理

### 識別方式

名前をキーとした UUID マッピングを localStorage に保持する。

```
localStorage['aif-c01-user-map'] = {
  "山田太郎": { userId: "user_xxx", displayName: "山田太郎", createdAt: ... },
  "田中花子": { userId: "user_yyy", displayName: "田中花子", createdAt: ... }
}
```

- 同じ名前 → 同じ UUID → **データ引き継ぎ**
- 別の名前 → 別の UUID → **独立したデータ**
- 「変更」ボタンは `localStorage['user']` のみ削除。マッピングは保持されるため、同名で再ログインするとデータが戻る。

### Firebase 認証

Firebase Anonymous Authentication を使用。DB 書き込み権限の付与のみが目的で、ユーザー識別には使用しない。  
アプリ起動後、初回フォーム送信時に自動でサインインする。

### localStorage キー一覧

| キー | 内容 | 削除タイミング |
|------|------|--------------|
| `user` | 現在ログイン中のユーザー情報 | 「変更」ボタン押下時 |
| `aif-c01-user-map` | 名前 → UserRecord のマッピング | 削除しない |
| `aif-c01-mission-progress-{userId}` | ミッション完了状況 | 削除しない |

---

## Firebase Realtime Database

### データ構造

```
/
├── quizSessions/
│   └── {userId}/
│       └── {sessionId}/         # QuizSession オブジェクト
│           ├── sessionId
│           ├── userId
│           ├── displayName
│           ├── score
│           ├── total
│           ├── accuracy
│           ├── category
│           ├── answers[]
│           └── timestamp
└── userStats/
    └── {userId}/                # UserStats オブジェクト
        ├── userId
        ├── displayName
        ├── totalAnswered
        ├── totalCorrect
        ├── sessionCount
        ├── categoryStats{}
        ├── difficultyStats{}
        └── lastUpdated
```

### セキュリティルール

```json
{
  "rules": {
    "quizSessions": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "userStats": {
      ".read": "auth != null",
      "$userId": {
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['userId','displayName','totalAnswered','totalCorrect'])"
      }
    }
  }
}
```

認証済みユーザー (Anonymous Auth) のみアクセス可能。未認証ユーザー・ボットは完全ブロック。

---

## 問題データ (aif-c01-questions.ts)

### 問題数・カテゴリ構成

| カテゴリ ID | 名称 | 問題数 | AIF-C01 試験比率 |
|------------|------|--------|-----------------|
| `ai-basics` | AI/ML 基礎・生成 AI 基礎 | 20問 | 20% + 24% |
| `ml-fundamentals` | 機械学習ファンダメンタルズ | 22問 | (上記に含む) |
| `aws-services` | AWS AI/ML サービス | 25問 | 28% |
| `ethics` | 責任ある AI・倫理 | 15問 | 14% |
| `practice` | セキュリティ・実践 | 15問 | 14% |
| **合計** | | **97問** | |

### 正解分布

A:25 / B:24 / C:24 / D:24（均等分布）

### 難易度

`easy` / `medium` / `hard` の3段階。各問題に `verified: true` フラグあり。

---

## ミッションモード

### 概要

新人 AI エンジニアとして大木製造のクライアント案件に携わるストーリー形式の学習モード。全 8 ミッション構成。

### 登場人物

| ID | 名前 | 役割 | 立ち位置 |
|----|------|------|---------|
| `tanaka` | 横田 | AI チームリーダー | 社内サポート役 |
| `suzuki` | 富田 部長 | 開発部長 | 社内ボケ役 |
| `sato` | 田村 | クライアント (大木製造) | 切れ者・外部視点 |
| `you` | あなた | 新人 AI エンジニア | プレイヤー |

### ミッション一覧

| # | タイトル | 主要テーマ |
|---|---------|-----------|
| M1 | AIプロジェクト始動 | AI/ML 基礎・プロジェクト立ち上げ |
| M2 | データ収集と前処理 | データ品質・前処理・特徴量エンジニアリング |
| M3 | モデル選択の壁 | 教師あり/なし学習・モデル評価指標 |
| M4 | 生成AIの落とし穴 | ハルシネーション・プロンプトエンジニアリング |
| M5 | RAGシステム構築 | RAG・Amazon Bedrock Knowledge Bases |
| M6 | 公平性と透明性 | 責任ある AI・バイアス・Amazon Clarify |
| M7 | セキュリティと監査 | データ保護・KMS・AWS Audit Manager |
| Final | 試験前夜 | 総復習・受験激励 |

### 進捗管理

完了したミッション ID を `aif-c01-mission-progress-{userId}` キーで localStorage に保存。ユーザーごとに独立管理。

---

## ビルド・デプロイ手順

```powershell
# 型チェック
npx tsc --noEmit

# プロダクションビルド
npm run build

# Firebase デプロイ (ホスティング + DB ルール)
firebase deploy --only hosting,database

# ホスティングのみ
firebase deploy --only hosting
```

---

## 合格確率アルゴリズム (calculatePassProbability)

`src/utils/index.ts` に実装。以下の要素を組み合わせて 0〜100% を算出する。

1. **生の正答率** (raw accuracy)
2. **難易度重み付き正答率** (easy×0.8 / medium×1.0 / hard×1.3)
3. **複合正答率** = 生 55% + 重み付き 45%
4. **ボリューム係数** = `1 - exp(-totalAnswered / 80)` (80問で約63%、160問で約86%)
5. **ドメインカバー率ボーナス** = 5カテゴリ各5問以上で最大+15%
6. **ロジスティック変換** = シグモイド関数で合格ライン 70% を中心に確率化

---

## 試験情報 (AIF-C01)

| 項目 | 内容 |
|------|------|
| 問題数 | 65問 |
| 試験時間 | 90分 |
| 合格点 | 700 / 1000点 (70%) |
| 出題形式 | 単一選択・複数選択 |
| 試験ドメイン | AI/ML基礎(20%) / 生成AI基礎(24%) / 基盤モデル応用(28%) / 責任あるAI(14%) / セキュリティ(14%) |
