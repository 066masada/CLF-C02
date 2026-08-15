import { questions as allQuestions } from './clf-c02-questions';
import type { QuestionCategory } from '../types/index';

/* ===== 登場人物 ===== */
export interface Character {
  name: string;
  role: string;
  icon: string;
  initial: string;
  align: 'left' | 'right';
  bubbleColor: string;
  nameColor: string;
}

export const CHARACTERS: Record<string, Character> = {
  tanaka: {
    name: '横田',
    role: 'AIチームリーダー',
    icon: '👨‍💻',
    initial: '横',
    align: 'left',
    bubbleColor: 'rgba(59,130,246,0.12)',
    nameColor: '#93c5fd',
  },
  suzuki: {
    name: '富田 部長',
    role: '開発部長',
    icon: '👨‍💼',
    initial: '富',
    align: 'left',
    bubbleColor: 'rgba(100,116,139,0.15)',
    nameColor: '#94a3b8',
  },
  sato: {
    name: '田村',
    role: 'クライアント（大木製造）',
    icon: '🧑',
    initial: '田',
    align: 'left',
    bubbleColor: 'rgba(6,182,212,0.12)',
    nameColor: '#22d3ee',
  },
  you: {
    name: 'あなた',
    role: '新人AIエンジニア',
    icon: '🧑‍💻',
    initial: '私',
    align: 'right',
    bubbleColor: 'rgba(124,58,237,0.18)',
    nameColor: '#c4b5fd',
  },
};

/* ===== データ型 ===== */
export interface DialogueLine {
  speaker: keyof typeof CHARACTERS;
  text: string;
}

export interface KeyConcept {
  term: string;
  definition: string;
  diagram?: string;
}

/* ===== シーン型（新ミッション形式） ===== */
export interface DialogueScene {
  type: 'dialogue';
  lines: DialogueLine[];
}
export interface ConceptScene {
  type: 'concept';
  term: string;
  definition: string;
  diagram?: string;
  examTip?: string;
}
export interface QuizScene {
  type: 'quiz';
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
export type Scene = DialogueScene | ConceptScene | QuizScene;

export interface Mission {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: QuestionCategory | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount: number;
  badge: { icon: string; label: string; color: string };
  intro: DialogueLine[];
  concepts: KeyConcept[];
  outro: DialogueLine[];
  scenes?: Scene[];   // 10シーン構成（設定済みミッションのみ）
  audioUrl?: string;
}

/* ===== ミッション一覧 ===== */
export const MISSIONS: Mission[] = [
  /* ─────────────────────────────────────
     Mission 1: AIとは（第1章）
  ───────────────────────────────────── */
  {
    id: 'mission-1',
    number: 1,
    title: 'AIプロジェクト始動！',
    subtitle: '「AIって何？」から始まる冒険',
    category: 'ai-basics',
    difficulty: 'easy',
    questionCount: 3,
    badge: { icon: '🌱', label: 'AI入門者', color: '#6ee7b7' },
    audioUrl: 'https://drive.google.com/file/d/1jOsV0F-DoiiEyGFsQUkTlHmnwd4vRXGg/preview',
    intro: [
      { speaker: 'suzuki', text: '全社員に告ぐ！今期からAIビジネスに本格参入する！ワシが10年前からAIの重要性を主張してきた成果だ！' },
      { speaker: 'you', text: '（え、AIって何から始めれば…わたし「A」の字もわからないんですが）' },
      { speaker: 'suzuki', text: 'そんなことも知らないのか。ったく使えない。横田、さっさとこいつを鍛えろ。時間の無駄だ（吐き捨てて去る）' },
      { speaker: 'tanaka', text: '（静かにため息）…気にしないでください。基礎から丁寧に整理しましょう。まず「AI・機械学習・深層学習」の3つの関係からです' },
      { speaker: 'you', text: '全部同じじゃないんですか？' },
      { speaker: 'tanaka', text: '入れ子構造です。AI（大）⊃ 機械学習（中）⊃ 深層学習（小）。ロシアのマトリョーシカ人形のように内側に収まっています' },
      { speaker: 'you', text: '具体的にどう違うんですか？' },
      { speaker: 'tanaka', text: 'スパムメール判定が機械学習、ChatGPTやClaudeが深層学習の一種です。Netflixの「あなたへのおすすめ」も機械学習ですよ' },
      { speaker: 'you', text: '「教師あり」「教師なし」という言葉も気になっていました' },
      { speaker: 'tanaka', text: '正解ラベルで学ぶのが教師あり（スパムか否かのラベル付きデータ）、ラベルなしでパターンを自分で発見するのが教師なし（顧客の購買行動を自動グループ化）です' },
      { speaker: 'you', text: 'もう一つ「強化学習」というのも聞いたことがあります' },
      { speaker: 'tanaka', text: 'ゲームAIや自動運転で使われる手法です。試行錯誤しながら「報酬」を最大化する方向に学習します。将棋AIのAlphaZeroがこれです' },
      { speaker: 'suzuki', text: '（戻ってくる）どうだ理解できたか。ワシが昔から強化学習の有効性を主張してきたのは知っているだろう' },
      { speaker: 'tanaka', text: '（電話が鳴る）あ、大木製造の田村様からです。先日お送りしたAI資料の件かと思います' },
      { speaker: 'suzuki', text: '（声のトーンが一瞬で変わる）た、田村様！！いつもお世話になっております！！喜んでご対応いたします！！' },
    ],
    concepts: [
      {
        term: 'AI（人工知能）',
        definition: 'コンピュータが人間のように学習・推論・判断する技術の総称。機械学習・深層学習・ルールベースAIなどを含む広い概念。\n例：スマートスピーカー・顔認証・自動運転・Netflixのレコメンド',
        diagram: '┌──────────────────────────────┐\n│       AI（人工知能）           │\n│  ┌────────────────────────┐  │\n│  │       機械学習           │  │\n│  │  ┌──────────────────┐  │  │\n│  │  │    深層学習        │  │  │\n│  │  │ （ニューラルNW）   │  │  │\n│  │  └──────────────────┘  │  │\n│  └────────────────────────┘  │\n└──────────────────────────────┘',
      },
      {
        term: '機械学習',
        definition: 'データからパターンを自動的に学習し、予測や分類を行うAIの手法。大量のデータが必要。\n例：スパムメール判定・クレジットカード不正検知・株価予測',
      },
      {
        term: '深層学習（ディープラーニング）',
        definition: '多層のニューラルネットワークを使った機械学習の一種。大量データと高い計算リソースが必要だが非常に高精度。\n例：ChatGPT（テキスト生成）・Stable Diffusion（画像生成）・音声認識・自動翻訳',
      },
      {
        term: '教師あり学習・教師なし学習・強化学習',
        definition: '【教師あり】正解ラベル付きデータで学習。例：不良品検知・迷惑メール判定\n【教師なし】ラベルなしでパターン発見。例：顧客セグメンテーション・異常検知\n【強化学習】試行錯誤で報酬最大化。例：将棋AI・ゲームAI・自動運転の判断',
      },
      {
        term: 'ルールベースAI vs 機械学習',
        definition: '【ルールベース】人間がif-thenルールを明示的にプログラム。変更が容易だが複雑なパターンに弱い。\n【機械学習】データからルールを自動発見。ルールを書かなくていいが大量データが必要。\n試験ではどちらが適切かの判断が問われる',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: 'AI・機械学習・深層学習の入れ子構造と3つの学習方式、完璧に理解できましたね！' },
      { speaker: 'you', text: '田村さんはどんな内容で電話されてきたんですか？' },
      { speaker: 'tanaka', text: 'AI導入の詳細な技術的質問でした。かなりしっかりした方のようです。来週訪問することになりました' },
      { speaker: 'suzuki', text: 'ふん。次の準備を抜かりなくしろ。ワシの顔に泥を塗るな' },
    ],
    scenes: [
      /* Scene 01 — オープニング */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'suzuki', text: '全社員に告ぐ！今期からAIビジネスに本格参入する！ワシが10年前からAIの重要性を主張してきた成果だ！' },
          { speaker: 'you',    text: '（え…AIって何から始めれば。"A"の字もわからないんですが）' },
          { speaker: 'suzuki', text: 'そんなことも知らないのか。ったく使えない。横田、さっさとこいつを鍛えろ（吐き捨てて去る）' },
          { speaker: 'tanaka', text: '…気にしないでください。まず「AIとは何か」から整理しましょう。' },
        ],
      },
      /* Scene 02 — 「AIって何ですか？」 */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'you',    text: '横田さん、そもそも「AI」って…機械学習？ディープラーニング？全部同じじゃないんですか？' },
          { speaker: 'tanaka', text: '違います。入れ子構造なんですよ。AI（大）の中に機械学習（中）があって、その中にディープラーニング（小）がある。' },
          { speaker: 'you',    text: 'マトリョーシカ人形みたいな？' },
          { speaker: 'tanaka', text: 'まさに！ では一つずつ確認していきましょう。' },
        ],
      },
      /* Scene 03 — 概念：AI */
      {
        type: 'concept',
        term: 'AI（人工知能）',
        definition: 'コンピュータが人間のように学習・推論・判断する技術の総称。機械学習・深層学習・ルールベースAIなど幅広い手法を含む。\n\n例：カーナビのルート計算、顔認証ロック、スマートスピーカー、自動運転',
        diagram:
          '┌──────────────────────────────┐\n' +
          '│         AI（人工知能）         │\n' +
          '│  ┌────────────────────────┐  │\n' +
          '│  │        機械学習          │  │\n' +
          '│  │  ┌──────────────────┐  │  │\n' +
          '│  │  │ ディープラーニング  │  │  │\n' +
          '│  │  └──────────────────┘  │  │\n' +
          '│  └────────────────────────┘  │\n' +
          '└──────────────────────────────┘',
        examTip: '「AI ⊃ 機械学習 ⊃ ディープラーニング」の包含関係は最頻出。「ディープラーニングはAIではない」という誤選択肢に要注意。',
      },
      /* Scene 04 — ルールベース vs 機械学習 */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'you',    text: 'カーナビもAIなんですか？機械学習を使ってないのに？' },
          { speaker: 'tanaka', text: 'それは「ルールベースAI」。人がif-thenルールを書いてプログラムする昔ながらの方法もAIに含まれます。' },
          { speaker: 'you',    text: 'じゃあ機械学習って何が違うんですか？' },
          { speaker: 'tanaka', text: '人がルールを書く代わりに、データから機械が自分でルールを学ぶんです。NetflixのレコメンドやSpotifyの「あなたへのおすすめ」がそれです。' },
        ],
      },
      /* Scene 05 — 概念：機械学習 */
      {
        type: 'concept',
        term: '機械学習（Machine Learning）',
        definition: 'データからパターンを自動的に学習し、予測・分類を行うAIの手法。人がルールを書く代わりに、大量データから機械が規則性を自動発見する。\n\n例：スパムメール判定、クレジットカード不正検知、Netflixレコメンド、株価予測',
        examTip: '「人がルールを書く」＝ルールベースAI。「データからルールを学ぶ」＝機械学習。この対比を押さえる。',
      },
      /* Scene 06 — クイズ1：包含関係 */
      {
        type: 'quiz',
        question: '次のうち、AI・機械学習・ディープラーニングの関係を正しく表しているのはどれですか？',
        options: [
          'AI ⊃ 機械学習 ⊃ ディープラーニング（入れ子構造）',
          '機械学習 ⊃ AI ⊃ ディープラーニング',
          'ディープラーニング ⊃ 機械学習 ⊃ AI',
          '3つはそれぞれ独立した別の技術',
        ],
        answer: 0,
        explanation: 'AIが最も広い概念で、その中に機械学習があり、さらにその中にディープラーニングがある入れ子構造です。「AI ⊃ 機械学習 ⊃ ディープラーニング」をしっかり覚えましょう。',
      },
      /* Scene 07 — 概念：ディープラーニング */
      {
        type: 'concept',
        term: 'ディープラーニング（Deep Learning / 深層学習）',
        definition: '多層ニューラルネットワークを使った機械学習の一種。大量データと高い計算リソースが必要だが、画像・音声・テキスト認識で人間を超える精度を達成。\n\n例：ChatGPT・Claude（テキスト生成）、顔認証（画像認識）、Alexa（音声認識）、自動翻訳',
        diagram: '入力データ →[層1]→[層2]→[層3]→…→[層N]→ 出力\n           ↑ ニューラルネットワーク（脳の神経回路を模倣）',
        examTip: '「大量データ・高計算コスト・高精度」がキーワード。Amazon SageMaker や Amazon Bedrock はディープラーニングを活用する代表的なAWSサービス。',
      },
      /* Scene 08 — 3種類の学習方式 & クライアント登場 */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'tanaka', text: '機械学習には3種類あります。正解ラベル付きで学ぶ「教師あり学習」、ラベルなしでパターン発見する「教師なし学習」、試行錯誤で報酬最大化する「強化学習」です。' },
          { speaker: 'you',    text: '強化学習って…将棋AIみたいなやつですか？' },
          { speaker: 'tanaka', text: 'そうです！AlphaZeroや自動運転の判断学習がこれです。（電話が鳴る）あ、大木製造の田村様から——' },
          { speaker: 'suzuki', text: '（声のトーンが一瞬で変わる）た、田村様！！いつもお世話になっております！！' },
          { speaker: 'you',    text: '（…さっきと別人みたいだ）' },
        ],
      },
      /* Scene 09 — クイズ2：学習方式 */
      {
        type: 'quiz',
        question: '自動運転AIが「急ブレーキ→事故減少」という経験を繰り返して安全な運転を学習する手法はどれですか？',
        options: [
          '教師あり学習',
          '教師なし学習',
          '強化学習',
          '転移学習',
        ],
        answer: 2,
        explanation: '正解はC。強化学習は「試行錯誤＋報酬」で学習する手法。報酬（安全な運転＝ポイント付与）を最大化する方向に自律的に学習します。将棋AI・ゲームAI・自動運転の判断に使われます。',
      },
      /* Scene 10 — エピローグ */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'you',    text: 'なんとか掴めてきました。AI ⊃ 機械学習 ⊃ ディープラーニング、そして教師あり・なし・強化学習の3種類ですね。' },
          { speaker: 'tanaka', text: '完璧です！田村様からはAI導入の詳細な技術的質問がありました。来週訪問することになりましたよ。' },
          { speaker: 'suzuki', text: 'ふん。次の準備を抜かりなくしろ。ワシの顔に泥を塗るな。' },
          { speaker: 'tanaka', text: 'お疲れ様でした。次のミッションではより深い概念に進みます。AWSとのつながりも見えてきますよ。' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────
     Mission 2: 機械学習の基礎（第2章）
  ───────────────────────────────────── */
  {
    id: 'mission-2',
    number: 2,
    title: 'データで学ぶ！機械学習の仕組み',
    subtitle: '横田先輩のホワイトボード特別講義',
    category: 'ml-fundamentals',
    difficulty: 'easy',
    questionCount: 3,
    badge: { icon: '📊', label: '機械学習見習い', color: '#93c5fd' },
    audioUrl: 'https://drive.google.com/file/d/1uL6Z9pJLF1FLXL2fjv1_HHCACJiOUPHY/preview',
    intro: [
      { speaker: 'tanaka', text: '今日は機械学習の仕組みを実例で説明します。まず質問です——モデルはどうやって賢くなると思いますか？' },
      { speaker: 'you', text: 'データをたくさん入れれば…？' },
      { speaker: 'tanaka', text: '概ねその通りです。ただ「どんなデータを」「どう使うか」が非常に重要なんです' },
      { speaker: 'suzuki', text: '（通りがかって）何をグズグズやってる！さっさと鍛えろ、時間の無駄だ' },
      { speaker: 'tanaka', text: '（苦笑）…スパム判定モデルを例にすると、データを「学習用・検証用・テスト用」の3つに分けます' },
      { speaker: 'you', text: '全部で学習した方が精度が上がりそうですが、なぜ3分割するんですか？' },
      { speaker: 'tanaka', text: '全データで学習すると「答えを丸暗記」したモデルになってしまいます。テスト前に丸暗記して応用問題が全滅するのと同じ「過学習」が起きるんです' },
      { speaker: 'you', text: 'あーー！まさにそれ学生時代にやりました（笑）AIも同じ失敗をするんですね' },
      { speaker: 'suzuki', text: '（戻ってくる）「過学習」？それはワシのことではないか。ワシほど勉強してきた人間はそうそういない。誇らしいことだ' },
      { speaker: 'tanaka', text: '…部長の場合は…その…別の問題かと。特徴量の設計について説明します。モデルが学習に使う入力の各要素が「特徴量」です' },
      { speaker: 'you', text: '家賃予測なら「広さ」「駅からの距離」「築年数」が特徴量ですか？' },
      { speaker: 'tanaka', text: '完璧です！良い特徴量があれば精度が高いモデルになります。逆に「ゴミデータを入れればゴミが出る」、これをガベージイン・ガベージアウトといいます' },
      { speaker: 'you', text: '評価指標はどう決めるんですか？精度（Accuracy）だけ見ればいい？' },
      { speaker: 'tanaka', text: 'いいえ。がん検診AIなら「見逃し（再現率の低下）」が致命的です。詐欺検知なら「誤検知（適合率の低下）」が問題。用途によって見るべき指標が変わります' },
    ],
    concepts: [
      {
        term: '特徴量（フィーチャー）',
        definition: 'AIが学習に使う入力データの各要素。特徴量の設計がモデル精度を大きく左右する（ガベージイン・ガベージアウト）。\n例：スパム判定では「件名の単語」「送信元ドメイン」「URLの数」\n家賃予測では「広さ」「駅からの距離」「築年数」が特徴量',
      },
      {
        term: '学習・検証・テスト分割',
        definition: 'データを3つに分けてモデルを評価する手法。一般的に6:2:2程度で分割。テストデータは一度しか使わないのが原則。',
        diagram: '全データ（100%）\n│\n├─ 学習用データ  60% → モデルを訓練\n│\n├─ 検証用データ  20% → パラメータ調整\n│\n└─ テスト用データ 20% → 最終評価（1回限り）\n\n※テストデータは一度しか使わないのが鉄則！',
      },
      {
        term: '過学習（オーバーフィッティング）',
        definition: '訓練データのパターンを丸暗記してしまい、新しいデータに対応できない状態。テスト前の丸暗記と同じ。\n対策：データ量を増やす・正則化（L1/L2）・ドロップアウト・早期停止（Early Stopping）',
      },
      {
        term: '評価指標（精度・適合率・再現率・F値）',
        definition: '【精度 Accuracy】全体のうち正解の割合。不均衡データでは使えない\n【適合率 Precision】「陽性」と予測したうち本当に陽性の割合（誤検知を減らしたい場合）\n【再現率 Recall】実際の陽性のうち検出できた割合（見逃しを減らしたい場合：がん検診）\n【F値 F1-score】適合率と再現率の調和平均',
      },
      {
        term: 'ハイパーパラメータ',
        definition: '学習アルゴリズムの動作を制御するパラメータ。学習前に人間が設定する必要がある（モデルが自動で学ぶ「パラメータ」とは別物）。\n例：学習率・バッチサイズ・ニューラルネットワークの層数・決定木の深さ',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: '特徴量・過学習・データ分割・評価指標、全部バッチリです！「丸暗記」の例えは面接でも使えますよ（笑）' },
      { speaker: 'you', text: '良いデータなしに良いAIなし、ですね。それにしても部長の反応が…' },
      { speaker: 'suzuki', text: 'ちなみにだな、ワシが昔から「やりすぎは良くない」と言い続けてきたのを知っているか？つまり過学習防止を提唱していたわけだ' },
      { speaker: 'tanaka', text: '……（1.5秒の沈黙）……おっしゃる通りです、部長' },
    ],
    scenes: [
      /* Scene 01 — オープニング */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'tanaka', text: '田村さんから「不良品検知AIを作れるか？」という話が出ました。まず機械学習の基礎を固めましょう。ホワイトボードを使います' },
          { speaker: 'you',    text: '特別講義ですね！どこから始めますか？' },
          { speaker: 'tanaka', text: '「モデルはどうやって賢くなるか」という根本から。データを入れれば入れるほど賢くなると思いますか？' },
          { speaker: 'suzuki', text: '（通りがかって）量より質！ワシが昔から言ってきた格言だ' },
        ],
      },
      /* Scene 02 — 丸暗記問題 */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'you',    text: '全データで学習した方が、より正確なモデルになるんじゃないですか？' },
          { speaker: 'tanaka', text: 'それが落とし穴です。全データで学習すると「答えを丸暗記」したモデルになってしまう' },
          { speaker: 'you',    text: 'テスト前に問題集を丸暗記したのに応用問題が全滅した……あの経験と同じですか？' },
          { speaker: 'tanaka', text: 'まさにそれ！これを「過学習（オーバーフィッティング）」と言います。だからデータを3つに分けるんです' },
        ],
      },
      /* Scene 03 — 概念：学習・検証・テスト分割 */
      {
        type: 'concept',
        term: '学習・検証・テストデータの分割',
        definition: 'データを3つに分けてモデルを評価する手法。一般的に 6:2:2 程度で分割する。\n\n【学習用データ 60%】モデルを訓練する\n【検証用データ 20%】ハイパーパラメータの調整・モデル選択\n【テスト用データ 20%】最終評価（1回限り）',
        diagram:
          '全データ（100%）\n' +
          '│\n' +
          '├─ 学習用データ  60% → モデルを訓練\n' +
          '│\n' +
          '├─ 検証用データ  20% → パラメータ調整\n' +
          '│\n' +
          '└─ テスト用データ 20% → 最終評価（1回限り）',
        examTip: 'テストデータは「一度しか使わない」が鉄則。複数回使うと「テストデータへの過学習」が起き、実際の本番精度より高く見えてしまう。',
      },
      /* Scene 04 — データ分割を会話で消化 */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'you',    text: '大木製造の不良品検知なら、画像データを3分割すればいいんですね？' },
          { speaker: 'tanaka', text: 'そうです。学習データで「不良品の見た目パターン」を覚えさせ、検証データで設定を調整し、テストデータで「本当に使えるか」を最終確認します' },
          { speaker: 'suzuki', text: '（自信満々に）「テストは一度きり」——ワシが若い頃から徹底してきた方針だ' },
          { speaker: 'you',    text: '（…部長はどこでそれを？）' },
        ],
      },
      /* Scene 05 — 概念：過学習 */
      {
        type: 'concept',
        term: '過学習（オーバーフィッティング）',
        definition: '訓練データのパターンを丸暗記してしまい、新しいデータに対応できない状態。\n\n【症状】学習データでは高精度 → テストデータでは低精度\n【対策】\n・データ量を増やす\n・正則化（L1/L2 Regularization）\n・ドロップアウト（Dropout）\n・早期停止（Early Stopping）',
        examTip: '「学習データ精度は高いがテストデータ精度が低い」→ 過学習のサイン。逆の「学習もテストも低精度」は未学習（Underfitting）。',
      },
      /* Scene 06 — クイズ1：データ分割 */
      {
        type: 'quiz',
        question: 'モデルの最終性能評価に使うデータとして正しいものはどれですか？',
        options: [
          '学習データ（訓練データ）',
          '検証データ',
          'テストデータ',
          '学習データとテストデータの平均',
        ],
        answer: 2,
        explanation: '正解はC。テストデータは最終評価のために1回だけ使います。複数回使うと「テストデータへの過学習」が起き、実際の本番精度より高く見えてしまいます。検証データはモデル選択・パラメータ調整に使います。',
      },
      /* Scene 07 — 概念：評価指標 */
      {
        type: 'concept',
        term: '評価指標：精度・適合率・再現率・F値',
        definition: '【精度 Accuracy】全体のうち正解の割合。不均衡データでは使えない\n【適合率 Precision】「陽性」と予測したうち本当に陽性の割合（誤検知を減らしたい場合）\n【再現率 Recall】実際の陽性のうち検出できた割合（見逃しを減らしたい場合）\n【F値 F1-score】適合率と再現率の調和平均',
        diagram:
          '           実際: 陽性   実際: 陰性\n' +
          '予測: 陽性  TP（正解）  FP（誤検知）\n' +
          '予測: 陰性  FN（見逃し） TN（正解）\n\n' +
          '再現率 = TP/(TP+FN)  ← 見逃しを減らす指標',
        examTip: 'がん検診・不良品検知では「見逃し（FN）が致命的」→ 再現率（Recall）を優先。これは試験で頻繁に問われる判断問題。',
      },
      /* Scene 08 — AWS実例・田村さんの質問 */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'sato',   text: '大木製造の田村です。不良品検知の精度目標を「99%」と設定したいのですが、どう思いますか？' },
          { speaker: 'you',    text: '製造ラインでは不良品の見逃しが最悪です。精度（Accuracy）だけでは…不良品が1%しかない場合、全部「良品」と答えるだけで99%になってしまいますよね？' },
          { speaker: 'tanaka', text: '完璧な指摘です。不均衡データでは Accuracy は使えません。「見逃しゼロ」を目指すなら再現率（Recall）を評価軸にします' },
          { speaker: 'sato',   text: 'なるほど。指標の選び方まで考えないといけないんですね' },
        ],
      },
      /* Scene 09 — クイズ2：評価指標の選択 */
      {
        type: 'quiz',
        question: '工場の不良品検知AIで「不良品の出荷を絶対に防ぎたい」場合、最も重視すべき評価指標はどれですか？',
        options: [
          '精度（Accuracy）',
          '適合率（Precision）',
          '再現率（Recall）',
          'F値（F1-score）',
        ],
        answer: 2,
        explanation: '正解はC（再現率）。「見逃し（FN）を絶対に防ぎたい」→ 再現率 = TP/(TP+FN) を最大化します。精度は不均衡データでは使えず、適合率は誤検知（FP）の削減を優先する指標です。',
      },
      /* Scene 10 — エピローグ */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'you',    text: 'データ3分割・過学習・評価指標の選び方——全部つながってきました！' },
          { speaker: 'tanaka', text: '完璧です。「良いデータなしに良いAIなし」が今日の本質。田村さんにも自信を持って答えられましたね' },
          { speaker: 'suzuki', text: '（誰も聞いていないが）F値とはワシが昔……その……（そっと離れていく）' },
          { speaker: 'tanaka', text: '次はディープラーニングの核心へ。ニューラルネットワークの仕組みを解き明かします！' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────
     Mission 3: ディープラーニング（第3章）
  ───────────────────────────────────── */
  {
    id: 'mission-3',
    number: 3,
    title: 'ニューラルネットの深部へ！',
    subtitle: 'ディープラーニングの仕組みを解き明かせ',
    category: 'ml-fundamentals',
    difficulty: 'easy',
    questionCount: 3,
    badge: { icon: '🧠', label: 'ディープラーナー', color: '#a78bfa' },
    audioUrl: 'https://drive.google.com/file/d/1fj02PNZeuOYStQ8HGU1DWcKs8t5gLS-U/preview',
    intro: [
      { speaker: 'tanaka', text: '今日はディープラーニングの仕組みを掘り下げます。ニューラルネットワークって聞いたことありますか？' },
      { speaker: 'you', text: '脳の神経細胞を模倣したものですよね？' },
      { speaker: 'tanaka', text: 'その通りです。ニューロン（ノード）が層をなして繋がり、各接続に「重み」があります。この重みを学習で調整することで賢くなります' },
      { speaker: 'suzuki', text: '（割り込んで）ニューラルネットワークならワシも知っているぞ。ワシが若い頃に設計したようなものだ' },
      { speaker: 'tanaka', text: '……そうですか。画像認識に特化したCNNというネットワークがあります。「畳み込み」で画像の局所的なパターン（エッジや形状）を抽出します' },
      { speaker: 'you', text: '工場の不良品検知カメラに使えそうですね！' },
      { speaker: 'tanaka', text: 'まさにそのユースケースです。不良品の「傷」「歪み」などのパターンをCNNが自動で学習します' },
      { speaker: 'you', text: 'テキスト処理はどうですか？画像と同じCNNで良いんですか？' },
      { speaker: 'tanaka', text: 'テキストには「Transformer」というアーキテクチャが主流です。「Attention（注意機構）」で文中の重要な単語の関係を捉えます。ChatGPTの基盤技術です' },
      { speaker: 'suzuki', text: 'Attention…ワシが昔から「細部に注意を払え」と言ってきたのはそういう意味だったのだ' },
      { speaker: 'you', text: '（すごい後付け解釈だ…）バックプロパゲーションというのも教えてください' },
      { speaker: 'tanaka', text: '予測が外れたとき、「どの重みが悪かったか」を逆方向に伝播させて自動修正する仕組みです。勾配降下法と組み合わせて重みを少しずつ最適な方向へ動かします' },
      { speaker: 'you', text: 'つまり間違えるたびに賢くなる仕組みですね' },
      { speaker: 'tanaka', text: 'まさに。そして各ノードの出力に「活性化関数（ReLU等）」を通すことで非線形な複雑なパターンを学習できるようになります' },
    ],
    concepts: [
      {
        term: 'ニューラルネットワーク',
        definition: '脳の神経細胞（ニューロン）を模倣したモデル。入力層・隠れ層・出力層で構成される。各接続に「重み（weight）」があり、学習でこの重みを調整する。\n層を深く（多く）すると「ディープラーニング」になる',
        diagram: '入力層          隠れ層           出力層\n[x1] ─┐                         ┌─ [犬]\n[x2] ─┼──→ [○]─[○]─[○] ──┤\n[x3] ─┘    ニューロン（重み付き）  └─ [猫]',
      },
      {
        term: 'CNN（畳み込みニューラルネットワーク）',
        definition: '画像認識に特化したネットワーク。畳み込み層でエッジ・形状などの局所パターンを抽出し、プーリング層でダウンサンプリングする。\n用途：画像分類・物体検出・医療画像診断・製造業の外観検査\n例：工場ラインの不良品検知、X線画像の異常検知',
      },
      {
        term: 'Transformer / Attention機構',
        definition: '文章内の単語間の関係を「注意（Attention）」で重み付けするアーキテクチャ。位置に関係なく関連する単語を直接参照できる。\n用途：自然言語処理・機械翻訳・テキスト生成\n代表例：GPT（生成）・BERT（理解）がTransformerを基盤とする',
      },
      {
        term: 'バックプロパゲーション（誤差逆伝播法）',
        definition: '予測の誤差を出力層から入力層へ逆向きに伝播させ、各重みを自動更新する学習アルゴリズム。「勾配降下法」と組み合わせて使う。\n学習率（Learning Rate）が大きすぎると発散、小さすぎると学習が遅い',
      },
      {
        term: '活性化関数',
        definition: 'ニューロンの出力に非線形変換を加える関数。これがないと深層ネットワークでも線形モデルと同じになってしまう。\n【ReLU】現在最もよく使われる。負の値を0に。計算が速い\n【Sigmoid】0〜1に収める。出力層の二値分類に使用\n【Softmax】複数クラスの確率分布を出力',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: 'CNN・Transformer・バックプロパゲーション・活性化関数——ディープラーニングの核心を押さえました！' },
      { speaker: 'you', text: '画像はCNN、テキストはTransformer、という使い分けが大事なんですね' },
      { speaker: 'suzuki', text: 'ふん…当然ワシはすべて知っていた。確認のために聞いていただけだ' },
      { speaker: 'tanaka', text: '次はAWSのインフラ基礎を学びます。クライアント訪問まであと少しです！' },
    ],
    scenes: [
      /* Scene 01 — オープニング */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'sato',   text: '田村です。M2の「過学習」や「データ分割」は理解できました。ところで…不良品検知AIは具体的にどうやって「傷」を学習するんですか？' },
          { speaker: 'tanaka', text: '今日はその核心「ディープラーニング」を説明します。脳の神経細胞を模倣した仕組みです' },
          { speaker: 'you',    text: '脳を模倣！？AIって本当に人間の脳に似てるんですか？' },
          { speaker: 'tanaka', text: '構造のアイデアは似ていますが、実際の脳とは全く別物です。「ニューラルネットワーク」から始めましょう' },
        ],
      },
      /* Scene 02 — 層を深くする意味 */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'suzuki', text: '（通りがかって）ニューロン！ワシが若い頃から「神経を研ぎ澄ませ」と言い続けてきたのはこういう意味だったのだ' },
          { speaker: 'you',    text: '層を「深く」するとどう変わるんですか？ただ増やせばいいんですか？' },
          { speaker: 'tanaka', text: '深くするだけでは逆効果です。各ニューロンの出力に「活性化関数」を通さないと、どれだけ層を積んでも線形な変換しかできません' },
          { speaker: 'you',    text: '線形だと何が困るんですか？' },
          { speaker: 'tanaka', text: '「傷あり・傷なし」を分けるような複雑な境界は直線では表現できません。活性化関数が非線形な表現力を与えてくれます' },
        ],
      },
      /* Scene 03 — 概念：ニューラルネットワーク */
      {
        type: 'concept',
        term: 'ニューラルネットワーク',
        definition: '脳の神経細胞（ニューロン）を模倣したモデル。入力層・隠れ層・出力層で構成される。各接続に「重み（weight）」があり、学習でこの重みを調整することで精度が上がる。\n\n層を深く（多く）すると「ディープラーニング」になる。',
        diagram:
          '入力層          隠れ層           出力層\n' +
          '[x1] ─┐                         ┌─ [良品]\n' +
          '[x2] ─┼──→ [○]─[○]─[○] ──┤\n' +
          '[x3] ─┘    重み付き接続          └─ [不良品]',
        examTip: '「入力層→隠れ層（複数）→出力層」が基本。隠れ層が多い＝「深い」＝ディープラーニング。',
      },
      /* Scene 04 — バックプロパゲーションへ */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'you',    text: '重みを「調整する」って、どうやって正しい重みを見つけるんですか？' },
          { speaker: 'tanaka', text: '「間違えたとき」に誤差を逆方向へ伝えて自動修正します。これが「バックプロパゲーション（誤差逆伝播法）」です' },
          { speaker: 'you',    text: '間違えるたびに賢くなる仕組みですね！' },
          { speaker: 'tanaka', text: 'そうです。修正の「歩幅」が「学習率（Learning Rate）」。大きすぎると発散し、小さすぎると収束が遅い。この調整が重要です' },
        ],
      },
      /* Scene 05 — 概念：活性化関数 + バックプロパゲーション */
      {
        type: 'concept',
        term: '活性化関数とバックプロパゲーション',
        definition: '【活性化関数】ニューロンの出力に非線形変換を加える関数\n・ReLU：負の値を0に。計算が速く現在の主流（隠れ層）\n・Sigmoid：0〜1に変換。二値分類の出力層に使用\n・Softmax：複数クラスの確率分布を出力（多クラス分類）\n\n【バックプロパゲーション】誤差を出力層→入力層へ逆向きに伝播させ、各重みを自動更新するアルゴリズム。勾配降下法と組み合わせて使う。',
        examTip: 'ReLU＝隠れ層の主流、Sigmoid＝二値出力、Softmax＝多クラス出力。この組み合わせが試験頻出。「バックプロパゲーション＝誤差を逆向きに伝播」をキーワードで覚える。',
      },
      /* Scene 06 — クイズ1：活性化関数 */
      {
        type: 'quiz',
        question: '多クラス分類（良品・軽欠陥・重欠陥の3種類）モデルの出力層に使う活性化関数として最も適切なものはどれですか？',
        options: [
          'ReLU',
          'Sigmoid',
          'Softmax',
          '活性化関数は不要',
        ],
        answer: 2,
        explanation: '正解はC（Softmax）。複数クラスの確率分布を出力し、合計が1になります。ReLUは隠れ層に使用、Sigmoidは二値（0 or 1）の出力層に使用します。「多クラス分類の出力層 → Softmax」はセットで覚えましょう。',
      },
      /* Scene 07 — 概念：CNN */
      {
        type: 'concept',
        term: 'CNN（畳み込みニューラルネットワーク）',
        definition: '画像認識に特化したネットワーク。フィルターが画像をスキャンし、エッジ・形状などの局所パターンを抽出する。\n\n【畳み込み層】フィルターで特徴マップを生成\n【プーリング層】ダウンサンプリングで位置ずれに頑健に\n\n用途：画像分類・物体検出・製造業の外観検査・医療画像診断',
        diagram:
          '画像入力 (H×W)\n' +
          '    ↓ 畳み込み（フィルターでパターン抽出）\n' +
          '特徴マップ（エッジ・テクスチャ・形状）\n' +
          '    ↓ プーリング（サイズ縮小）\n' +
          '    ↓ 全結合層\n' +
          '良品 / 不良品（出力）',
        examTip: '「画像・動画の認識 → CNN」は最頻出。AWSでは Amazon Rekognition が事前学習済みCNNベースのモデルを提供。カスタムラベルで独自分類も追加学習可能。',
      },
      /* Scene 08 — Transformer と AWS実例 */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'sato',   text: '不良品検知は画像なのでCNNですね。では修理マニュアルの自動分類はどうですか？テキストデータです' },
          { speaker: 'you',    text: 'テキストには「Transformer」というアーキテクチャが主流です。文中の離れた単語同士の関係を「Attention（注意機構）」で直接とらえます' },
          { speaker: 'tanaka', text: 'ChatGPT・Claude・BERTはすべてTransformerが基盤です。AWSでは Amazon Comprehend（テキスト分析）や Amazon Bedrock（LLM）が該当します' },
          { speaker: 'sato',   text: '画像→CNN→Rekognition、テキスト→Transformer→ComprehendやBedrock、という使い分けですね' },
        ],
      },
      /* Scene 09 — クイズ2：CNN vs Transformer */
      {
        type: 'quiz',
        question: '工場の製品画像から「傷」「変形」を自動検知するAIモデルを構築する場合、最も適したネットワークアーキテクチャはどれですか？',
        options: [
          'RNN（再帰型ニューラルネットワーク）',
          'CNN（畳み込みニューラルネットワーク）',
          'Transformer',
          '単純パーセプトロン',
        ],
        answer: 1,
        explanation: '正解はB（CNN）。CNNは画像の局所パターン（エッジ・形状・テクスチャ）を自動で抽出するため画像認識に最適です。RNNは時系列データ、Transformerはテキスト処理が主な用途です。AWSではAmazon Rekognitionのカスタムラベル機能で大木製造の独自不良品分類を追加学習できます。',
      },
      /* Scene 10 — エピローグ */
      {
        type: 'dialogue',
        lines: [
          { speaker: 'you',    text: 'ニューラルネット・活性化関数・バックプロパゲーション・CNN・Transformer——全部つながりました！' },
          { speaker: 'tanaka', text: '完璧です。「画像→CNN」「テキスト→Transformer」この使い分けが試験で最頻出です。大木製造への提案に自信が持てますね' },
          { speaker: 'suzuki', text: '（誰も求めていないのに）Transformer…「変革」か。ワシが昔から「変革こそ成長の源泉」と言ってきたのはそういうことだ' },
          { speaker: 'tanaka', text: '次はAWSのインフラ基礎です。クラウドの全体像を掴んだら、いよいよ大木製造への本格提案ができます！' },
        ],
      },
    ],
  },

  /* ─────────────────────────────────────
     Mission 4: AWSの概要（第4章）
  ───────────────────────────────────── */
  {
    id: 'mission-4',
    number: 4,
    title: 'クラウドの地図を手に入れろ！',
    subtitle: 'AWSの全体像とWell-Architectedを理解する',
    category: 'aws-services',
    difficulty: 'easy',
    questionCount: 3,
    badge: { icon: '☁️', label: 'クラウド入門者', color: '#fbbf24' },
    audioUrl: 'https://drive.google.com/file/d/1cCvfbhckciKXC6DRzfXIsrECGM9ofrDP/preview',
    intro: [
      { speaker: 'tanaka', text: '大木製造への提案書作成のため、AWSの基礎を固めましょう。まず「なぜクラウドなのか」から' },
      { speaker: 'you', text: '自社にサーバーを置く「オンプレミス」と何が違うんですか？' },
      { speaker: 'tanaka', text: '初期コストゼロ・使った分だけ払う従量課金・スケーラビリティ（需要に合わせて即増減）の3点が大きな違いです' },
      { speaker: 'suzuki', text: '（割り込んで）ワシが3年前にクラウド移行を提案したとき、全員が反対した。先見の明があるのはワシだけだ' },
      { speaker: 'you', text: '（記録には残っていないような気がするけど…）AWSのグローバルインフラはどういう構造ですか？' },
      { speaker: 'tanaka', text: '3層構造です。リージョン（地理的な独立した地域）→ アベイラビリティゾーン（AZ、リージョン内の物理的に独立したデータセンター群）→ エッジロケーション（CDN配信拠点）' },
      { speaker: 'you', text: 'AZが複数あることで何の意味があるんですか？' },
      { speaker: 'tanaka', text: '片方のAZが災害や障害で停止しても、別AZで継続できます。マルチAZ構成が高可用性の基本です' },
      { speaker: 'you', text: 'Well-Architected Frameworkというのも聞きました' },
      { speaker: 'tanaka', text: 'AWSが提唱する優良システム設計の6本柱です——運用優秀性・セキュリティ・信頼性・パフォーマンス効率・コスト最適化・持続可能性。試験頻出です！' },
      { speaker: 'suzuki', text: 'フレームワーク！ワシが昔から「フレームワークが大事だ」と言ってきた。当然だろう' },
      { speaker: 'you', text: '責任共有モデルというのも出てきました' },
      { speaker: 'tanaka', text: 'AWSが守る部分（物理インフラ・電源・ネットワーク）とユーザーが守る部分（IAM設定・データ暗号化・OS更新）を明確に分けた考え方です。非常に重要な試験ポイントです' },
    ],
    concepts: [
      {
        term: 'クラウドのメリット（オンプレとの比較）',
        definition: '【初期コスト不要】サーバー購入・データセンター費用ゼロ\n【従量課金】使った分だけ支払う（OPEX化）\n【スケーラビリティ】需要に応じて即座にリソース増減\n【グローバル展開】世界中のリージョンに即座にデプロイ可能\n【高可用性】マルチAZ/マルチリージョンで冗長化',
      },
      {
        term: 'リージョン・AZ・エッジロケーション',
        definition: '【リージョン】世界各地の独立した地理的エリア（例：ap-northeast-1=東京）\n【アベイラビリティゾーン（AZ）】リージョン内の物理的に独立したDC群。通常3つ以上。マルチAZで障害対策\n【エッジロケーション】CloudFront等のCDN配信拠点。ユーザーの近くからコンテンツ配信',
        diagram: 'リージョン（東京）\n├── AZ-1a（データセンター群）\n├── AZ-1c（データセンター群）\n└── AZ-1d（データセンター群）\n\nエッジロケーション（全世界450拠点以上）',
      },
      {
        term: 'Well-Architected Framework 6本柱',
        definition: '① 運用優秀性：監視・自動化・継続的改善\n② セキュリティ：IAM最小権限・暗号化・監査\n③ 信頼性：障害回復・スケーリング・バックアップ\n④ パフォーマンス効率：適切なリソース選択・モニタリング\n⑤ コスト最適化：無駄な支出削減・使用量最適化\n⑥ 持続可能性：エネルギー効率・カーボンフットプリント削減',
      },
      {
        term: '責任共有モデル',
        definition: 'AWSとユーザーがセキュリティの責任を分担する考え方。\n【AWSの責任】クラウドのセキュリティ：物理インフラ・ネットワーク・ハイパーバイザー\n【ユーザーの責任】クラウドでのセキュリティ：IAM設定・データ暗号化・OS/アプリのパッチ・セキュリティグループ設定',
      },
      {
        term: 'IaaS・PaaS・SaaS',
        definition: '【IaaS（インフラaas）】仮想マシン/ネットワークを提供。OS以上はユーザー管理。例：EC2, S3\n【PaaS（プラットフォームaas）】アプリ実行環境を提供。コードだけ書けばOK。例：AWS Lambda, RDS\n【SaaS（ソフトウェアaas）】アプリそのものを提供。設定するだけ。例：Amazon WorkMail\n試験では各サービスがIaaS/PaaS/SaaSのどれかを問われる',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: 'Well-Architected 6本柱・リージョン/AZ・責任共有モデル——AWSの地図が頭に入りましたね！' },
      { speaker: 'you', text: '責任共有モデルは「AWSが守る vs 自分が守る」を明確に理解することが大事ですね' },
      { speaker: 'suzuki', text: '提案書の作成はワシが最終確認する。○○、ちゃんと書けるか？' },
      { speaker: 'tanaka', text: '次は具体的なAWSサービスを学びます。アーキテクチャ設計の準備です！' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '大木製造への提案書作成のため、AWSの基礎を固めましょう。まず「なぜクラウドか」という根本から' },
        { speaker: 'you', text: '自社サーバーを置く「オンプレミス」と何が違うんですか？' },
        { speaker: 'tanaka', text: '3点あります。①初期コストゼロ ②使った分だけ払う従量課金 ③需要に合わせて即増減できるスケーラビリティ' },
        { speaker: 'suzuki', text: '（割り込んで）ワシが3年前にクラウド移行を提案したとき全員が反対した。先見の明はワシだけだ' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'AWSは世界中にサーバーがあるんですよね？その構造はどうなっているんですか？' },
        { speaker: 'tanaka', text: '3層構造です。リージョン（地理的エリア）→ アベイラビリティゾーン（AZ・物理的に独立したDC群）→ エッジロケーション（CDN拠点）' },
        { speaker: 'you', text: 'AZが複数あるのはなぜですか？' },
        { speaker: 'tanaka', text: '片方のAZが災害や障害で停止しても別AZで継続できます。マルチAZ構成が高可用性の基本です' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'リージョン・AZ・エッジロケーション',
        definition: '【リージョン】世界各地の独立した地理的エリア（例：ap-northeast-1=東京）\n【アベイラビリティゾーン（AZ）】リージョン内の物理的に独立したDC群。通常3つ以上。マルチAZで障害対策\n【エッジロケーション】CloudFront等のCDN配信拠点。ユーザーの近くからコンテンツ配信',
        diagram: 'リージョン（東京）\n├── AZ-1a（データセンター群）\n├── AZ-1c（データセンター群）\n└── AZ-1d（データセンター群）\n\nエッジロケーション（全世界450拠点以上）',
        examTip: '「マルチAZ＝高可用性」「マルチリージョン＝災害対策（DR）」の使い分けが頻出。AZは同じリージョン内。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: '「Well-Architected Framework」という言葉が提案書の参考資料に出てきました' },
        { speaker: 'tanaka', text: 'AWSが提唱する優良システム設計の6本柱です。試験では6つ全部の名前と意味が問われます' },
        { speaker: 'suzuki', text: 'フレームワーク！ワシが昔から「フレームワークが大事だ」と言ってきた。当然だろう' },
        { speaker: 'you', text: '（部長は何でも「昔から言ってきた」と言う気がする…）6本柱、教えてください！' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'Well-Architected Framework 6本柱',
        definition: '① 運用優秀性：監視・自動化・継続的改善\n② セキュリティ：IAM最小権限・暗号化・監査\n③ 信頼性：障害回復・スケーリング・バックアップ\n④ パフォーマンス効率：適切なリソース選択・モニタリング\n⑤ コスト最適化：無駄な支出削減・使用量最適化\n⑥ 持続可能性：エネルギー効率・カーボンフットプリント削減',
        examTip: '6本柱の名前と概要を覚える。特に「セキュリティ」と「信頼性」の違い（セキュリティ＝防御、信頼性＝障害からの回復）が混同されやすい。',
      },
      /* Scene 06 */
      { type: 'quiz', question: '大木製造のAIシステムで「AZの一つが障害を起こしても、処理を継続できる」要件を満たす設計として正しいのはどれですか？',
        options: ['シングルAZ・冗長なし', 'マルチAZ（複数AZにリソースを分散）', 'マルチリージョン（別リージョンに同期）', 'エッジロケーションの活用'],
        answer: 1,
        explanation: '正解はB（マルチAZ）。1つのAZ障害に耐えるにはマルチAZ構成が標準解。マルチリージョンはリージョン全体の障害に備える（DR用途）でコストが高い。',
      },
      /* Scene 07 */
      { type: 'concept', term: '責任共有モデル（Shared Responsibility Model）',
        definition: 'AWSとユーザーがセキュリティの責任を分担する考え方。\n\n【AWSの責任】クラウドのセキュリティ\n物理インフラ・ネットワーク・ハードウェア・ハイパーバイザー\n\n【ユーザーの責任】クラウドでのセキュリティ\nIAM設定・データ暗号化・OS/アプリのパッチ・セキュリティグループ・データ分類',
        examTip: '「AWSが守る」=物理・インフラ、「ユーザーが守る」=IAM・データ・アプリ。「ユーザーのデータ暗号化」はユーザー責任。混同しやすいので要注意。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: '「IaaS」「PaaS」「SaaS」という言葉も提案書に出てきました。整理してもらえますか？' },
        { speaker: 'tanaka', text: 'IaaSは仮想マシン・ネットワーク提供（EC2・S3）。PaaSはアプリ実行環境提供でコードだけ書けばOK（Lambda・RDS）。SaaSはアプリそのものを提供（WorkMail）です' },
        { speaker: 'suzuki', text: '当然ワシはすべて使いこなしている（小声：SaaSはともかくPaaSはよくわからん）' },
        { speaker: 'you', text: 'つまり管理する範囲が違うんですね。IaaSは自分で管理することが多い、SaaSはほぼ管理なし、という理解で合っていますか？' },
        { speaker: 'tanaka', text: 'まさにその通りです！' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: '責任共有モデルにおいて、「ユーザーが責任を持つ」項目として正しいのはどれですか？',
        options: ['物理データセンターの電源管理', 'ハイパーバイザーのパッチ適用', 'IAMユーザーのアクセス権限設定', 'ネットワーク機器のファームウェア更新'],
        answer: 2,
        explanation: '正解はC（IAMの権限設定）。IAM・データ暗号化・OS/アプリのパッチはユーザー責任。物理インフラ・ハイパーバイザー・ネットワーク機器はAWSの責任。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'リージョン/AZ・Well-Architected 6本柱・責任共有モデル・IaaS/PaaS/SaaS——全部つながりました！' },
        { speaker: 'tanaka', text: '完璧です。「クラウドの地図」が頭に入りましたね。この地図があれば次の具体的なサービス選定も迷いません' },
        { speaker: 'suzuki', text: '提案書の最終確認はワシがする。クラウドのことはワシに任せろ（小声：念のため横田に確認してもらうが）' },
        { speaker: 'tanaka', text: '次は大木製造のシステム設計に使う具体的なAWSサービスです。IAM・S3・EC2から始めましょう！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 5: AWSの代表的なサービス（第5章）
  ───────────────────────────────────── */
  {
    id: 'mission-5',
    number: 5,
    title: 'AWSサービスで武装せよ！',
    subtitle: 'IAM・S3・EC2・RDS——設計の基本を押さえる',
    category: 'aws-services',
    difficulty: 'easy',
    questionCount: 3,
    badge: { icon: '🔧', label: 'AWSアーキテクト見習い', color: '#34d399' },
    audioUrl: 'https://drive.google.com/file/d/1sxucElMn0KBy7Me5qPkB_05rO9dA1GQR/preview',
    intro: [
      { speaker: 'tanaka', text: '今日は大木製造のシステム設計に使うAWSサービスを整理します。まずアクセス管理の要「IAM」から' },
      { speaker: 'you', text: 'IAMって何の略ですか？' },
      { speaker: 'tanaka', text: 'Identity and Access Management。ユーザー・グループ・ロール・ポリシーを使ってAWSリソースへのアクセスを管理します。鉄則は「最小権限の原則」——必要最小限の権限だけ付与' },
      { speaker: 'suzuki', text: '（割り込んで）ワシのアカウントには全権限をつけておいてくれ。業務上必要だから' },
      { speaker: 'tanaka', text: '……それは最小権限の原則に反しますので……。次にストレージです。S3はオブジェクトストレージで、画像・動画・ログなど何でも保存できます' },
      { speaker: 'you', text: '耐久性が「イレブンナイン（99.999999999%）」って本当ですか？' },
      { speaker: 'tanaka', text: '本当です。複数AZに自動で複製されるため、データが消える確率が非常に低い。大木製造の製品画像や学習データの保存に最適です' },
      { speaker: 'you', text: 'EC2はどういうときに使うんですか？' },
      { speaker: 'tanaka', text: '仮想サーバーです。Webサーバー・アプリサーバー・ML学習環境など、柔軟にOSやスペックを選べます。GPUインスタンス（p3, g4dn等）はML学習に特化しています' },
      { speaker: 'you', text: 'データベースはRDSとDynamoDBのどちらを使うべきですか？' },
      { speaker: 'tanaka', text: 'RDSはMySQL/PostgreSQL等のリレーショナルDB（テーブル・結合・トランザクションが必要な場合）。DynamoDBはNoSQLで超高速・無制限スケール（検索キーが単純で大量データの場合）。用途で選びます' },
      { speaker: 'suzuki', text: '当然ワシはどちらも使いこなせる。むしろワシが決める' },
      { speaker: 'you', text: 'VPCというのはネットワークの分離ですよね？' },
      { speaker: 'tanaka', text: 'はい。仮想プライベートクラウド——AWSクラウド内に自分専用の仮想ネットワークを作る機能です。インターネットに公開する「パブリックサブネット」と、DBなど内部だけの「プライベートサブネット」を分けます' },
    ],
    concepts: [
      {
        term: 'IAM（Identity and Access Management）',
        definition: 'AWSリソースへのアクセスを管理するサービス。\n【ユーザー】個人のAWSアカウント\n【グループ】ユーザーをまとめてポリシーを一括適用\n【ロール】EC2やLambdaなどAWSサービスに権限を付与\n【ポリシー】JSON形式でアクセス権限を定義\n\n鉄則：最小権限の原則（必要最小限の権限のみ付与）',
      },
      {
        term: 'Amazon S3（Simple Storage Service）',
        definition: 'オブジェクトストレージサービス。\n【特徴】耐久性99.999999999%（11ナイン）・容量無制限・バケット単位で管理\n【用途】学習データの保存・モデルアーティファクト・静的ウェブサイト・ログ保存\n【ストレージクラス】Standard（頻繁アクセス）/ Glacier（長期保存・低コスト）',
      },
      {
        term: 'Amazon EC2（Elastic Compute Cloud）',
        definition: '仮想サーバー（IaaS）。OS・スペックを自由に選択。\n【汎用】m系（バランス型）\n【コンピュート最適化】c系（高CPU負荷）\n【GPU最適化】p系/g系（ML学習・推論に最適）\n【メモリ最適化】r系（大容量メモリが必要なDB）\nML学習にはp3（NVIDIA V100）やg4dn（T4）を使用',
      },
      {
        term: 'Amazon RDS vs Amazon DynamoDB',
        definition: '【Amazon RDS】マネージドRDB。MySQL・PostgreSQL・Aurora等。テーブル結合・複雑なクエリ・トランザクションが必要な場合に使用。マルチAZ対応で高可用性\n【Amazon DynamoDB】フルマネージドNoSQL。ミリ秒レイテンシ・無制限スケール。キーバリュー/ドキュメント型。ゲームのスコア・IoTデータ・セッション管理に最適',
      },
      {
        term: 'Amazon VPC（Virtual Private Cloud）',
        definition: 'AWS上に作る自分専用の仮想ネットワーク。\n【サブネット】VPC内のIPアドレス範囲の区画\n【パブリックサブネット】インターネットゲートウェイ経由で外部公開（Webサーバー）\n【プライベートサブネット】外部からアクセス不可（DB・バックエンド）\n【セキュリティグループ】仮想ファイアウォール（インスタンス単位）',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: 'IAM・S3・EC2・RDS/DynamoDB・VPC——設計の基礎サービスを完全に把握しました！' },
      { speaker: 'you', text: 'RDSとDynamoDBの使い分けが最初は難しそうでしたが、用途で考えると明快ですね' },
      { speaker: 'suzuki', text: '提案書にこれを盛り込めば完璧だ。ワシが総仕上げする' },
      { speaker: 'tanaka', text: '次は大木製造の工場データを扱うためのデータエンジニアリングです！' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '今日は大木製造のシステム設計に使うAWSサービスを整理します。まずアクセス管理の要「IAM」から' },
        { speaker: 'you', text: 'IAMって何の略ですか？' },
        { speaker: 'tanaka', text: 'Identity and Access Management。ユーザー・グループ・ロール・ポリシーでAWSリソースへのアクセスを管理します。鉄則は「最小権限の原則」' },
        { speaker: 'suzuki', text: '（割り込んで）ワシのアカウントには全権限をつけておいてくれ。業務上必要だから' },
        { speaker: 'tanaka', text: '……それは最小権限の原則に反しますので……' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'S3はよく聞きますが、どんなストレージですか？' },
        { speaker: 'tanaka', text: 'オブジェクトストレージです。耐久性が「イレブンナイン（99.999999999%）」、容量制限なし、画像・動画・ログ何でも保存できます' },
        { speaker: 'you', text: '大木製造の製品画像や学習データの保存に使えますね！' },
        { speaker: 'tanaka', text: 'まさにそれが王道の使い方です。バケット単位で管理し、ストレージクラスでコスト最適化もできます' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'IAM（Identity and Access Management）',
        definition: 'AWSリソースへのアクセスを管理するサービス。\n【ユーザー】個人のAWSアカウント\n【グループ】ユーザーをまとめてポリシーを一括適用\n【ロール】EC2やLambdaなどAWSサービスに権限を付与\n【ポリシー】JSON形式でアクセス権限を定義\n\n鉄則：最小権限の原則（Principle of Least Privilege）',
        examTip: '「ルートアカウントは日常利用しない」「MFAを有効化する」「アクセスキーは定期ローテーション」がIAMのベストプラクティス3点。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'EC2はどういうときに使うんですか？' },
        { speaker: 'tanaka', text: '仮想サーバーです。Webサーバー・アプリサーバー・ML学習環境など、OSやスペックを自由に選べます。GPU搭載のp3・g4dnインスタンスはML学習に特化しています' },
        { speaker: 'you', text: 'データベースはRDSとDynamoDBのどちらを使うべきですか？' },
        { speaker: 'tanaka', text: 'RDSはMySQL等のリレーショナルDB（テーブル結合・トランザクションが必要な場合）。DynamoDBはNoSQLで超高速・無制限スケール（シンプルなキーアクセス・大量データ）。用途で選びます' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'Amazon S3 / EC2',
        definition: '【Amazon S3】オブジェクトストレージ。耐久性99.999999999%（11ナイン）・容量無制限。学習データ・モデル保存・静的ウェブサイトに使用。ストレージクラス：Standard（頻繁）/ Glacier（長期保存・低コスト）\n\n【Amazon EC2】仮想サーバー（IaaS）。ML学習用GPU：p3（V100）・g4dn（T4）。汎用：m系、コンピュート最適化：c系、メモリ最適化：r系',
        examTip: 'S3はML学習データの保存場所として必ず登場。EC2のGPUインスタンス（p/g系）はML学習に使うと覚える。',
      },
      /* Scene 06 */
      { type: 'quiz', question: 'IAMのベストプラクティスとして正しくないものはどれですか？',
        options: ['ルートアカウントは日常業務に使わない', 'MFA（多要素認証）を有効化する', '管理者ユーザーには全権限ポリシーをアタッチする', 'アクセスキーは定期的にローテーションする'],
        answer: 2,
        explanation: '正解はC。「全権限の付与」は最小権限の原則に反します。管理者であっても必要な権限のみ付与するのが正しい設計です。A・B・Dはすべて正しいベストプラクティスです。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'Amazon RDS vs Amazon DynamoDB',
        definition: '【Amazon RDS】マネージドRDB。MySQL・PostgreSQL・Aurora等。テーブル結合・複雑なクエリ・トランザクションが必要な場合。マルチAZ対応で高可用性\n\n【Amazon DynamoDB】フルマネージドNoSQL。ミリ秒レイテンシ・無制限スケール。キーバリュー/ドキュメント型。ゲームスコア・IoTデータ・セッション管理に最適',
        diagram: '複雑なクエリ・JOIN必要 → RDS\n大量データ・高速KV     → DynamoDB\nトランザクション重視   → RDS (Aurora)\nサーバーレス・スケール → DynamoDB',
        examTip: '「関係があるデータ→RDS」「大量・高速・シンプル→DynamoDB」。AuroraはRDSの高性能版（MySQL/PostgreSQL互換）。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'VPCというのはネットワークの分離ですよね？' },
        { speaker: 'tanaka', text: 'はい。仮想プライベートクラウド——AWS内に自分専用の仮想ネットワークを作ります。WebサーバーはパブリックサブネットでインターネットOK、DBはプライベートサブネットで外部からアクセス不可にします' },
        { speaker: 'sato', text: '田村です。大木製造のデータは工場内のネットワークとAWSをつなぎたいのですが' },
        { speaker: 'tanaka', text: 'その場合は「AWS Direct Connect」か「VPN」でオンプレミスとVPCを接続します。Direct Connectは専用線で高速・安定です' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: '大木製造の工場センサーデータ（秒単位の大量データ）を格納するのに最も適したデータベースはどれですか？',
        options: ['Amazon RDS (MySQL)', 'Amazon DynamoDB', 'Amazon Redshift', 'Amazon ElastiCache'],
        answer: 1,
        explanation: '正解はB（DynamoDB）。秒単位の大量センサーデータはシンプルなキーバリューアクセスで、DynamoDBのミリ秒レイテンシ・無制限スケールが最適。RDSは複雑なクエリ向き、Redshiftはデータウェアハウス、ElastiCacheはキャッシュ専用です。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'IAM・S3・EC2・RDS/DynamoDB・VPC——AWSの主要サービスが全部つながりました！' },
        { speaker: 'tanaka', text: '完璧です。「どのサービスを使うか」の判断基準が身に付きましたね。大木製造の提案書の骨格ができました' },
        { speaker: 'suzuki', text: '（胸を張って）これでワシも大木製造に自信を持って提案できる。最終確認はワシが——横田、念のため確認を頼む' },
        { speaker: 'tanaka', text: '次は大木製造の1,000台センサーデータを扱うデータエンジニアリングです！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 6: データエンジニアリング（第6章）
  ───────────────────────────────────── */
  {
    id: 'mission-6',
    number: 6,
    title: '工場データの大河を制せ！',
    subtitle: 'ストリーミング・ETL・データレイクの設計',
    category: 'aws-services',
    difficulty: 'medium',
    questionCount: 3,
    badge: { icon: '🔄', label: 'データエンジニア', color: '#f59e0b' },
    audioUrl: 'https://drive.google.com/file/d/1X6oVU6mtEmUXDttuCqYjnKXsuHM6yYNm/preview',
    intro: [
      { speaker: 'sato', text: '田村です。先日の資料を拝見しました。弊社の工場では毎秒1,000台のセンサーからデータが発生しています。これをどう扱いますか？' },
      { speaker: 'suzuki', text: '（すかさず）もちろん対応しております！横田、説明してやれ' },
      { speaker: 'tanaka', text: 'リアルタイムのストリーミングデータには「Amazon Kinesis」が最適です。毎秒何千件ものデータをリアルタイムに受信・処理できます' },
      { speaker: 'sato', text: '受け取ったデータはそのままAIに入れられますか？' },
      { speaker: 'tanaka', text: '実はそのままでは使えないことが多いです。欠損値・フォーマット統一・不要列の削除といった「ETL（Extract・Transform・Load）」処理が必要です' },
      { speaker: 'you', text: '「ETL」はどのサービスで行うんですか？' },
      { speaker: 'tanaka', text: '「AWS Glue」がAWSのマネージドETLサービスです。サーバーレスで動き、自動的にデータのスキーマ（構造）を検出してくれる「データカタログ」機能も便利です' },
      { speaker: 'sato', text: '処理後のデータはどこに保存しますか？分析もしたいのですが' },
      { speaker: 'tanaka', text: '2つの選択肢があります。S3をベースにした「データレイク」に生データを溜め込む方法と、分析クエリに特化した「Amazon Redshift」に整理済みデータを入れる方法です' },
      { speaker: 'you', text: 'データレイクとデータウェアハウスの違いは何ですか？' },
      { speaker: 'tanaka', text: 'データレイクはあらゆる形式のデータを生のまま蓄積。データウェアハウスは分析用に整理・構造化されたデータを蓄積。Redshiftは列指向DBで集計クエリが非常に高速です' },
      { speaker: 'suzuki', text: 'データレイク！ワシはずっとこの言葉の本質を理解してきた。まさに「大河」だ' },
      { speaker: 'sato', text: '「Amazon Athena」という名前も聞いたことがあります' },
      { speaker: 'tanaka', text: 'S3上のデータに直接SQLクエリを実行できるサーバーレスサービスです。Redshiftほど高速ではないですが、データの移動なしにクエリできるのが利点です' },
    ],
    concepts: [
      {
        term: 'Amazon Kinesis（ストリーミングデータ処理）',
        definition: 'リアルタイムのストリーミングデータを収集・処理するサービス群。\n【Kinesis Data Streams】データを収集してリアルタイム処理（ミリ秒レイテンシ）\n【Kinesis Data Firehose】ストリームデータをS3/Redshiftに自動配信\n【Kinesis Data Analytics】SQLでストリームデータをリアルタイム分析\n用途：IoTセンサー・ログ収集・クリックストリーム',
      },
      {
        term: 'AWS Glue（マネージドETLサービス）',
        definition: 'サーバーレスのETL（抽出・変換・ロード）サービス。\n【Glue Data Catalog】データのスキーマ（構造）を自動検出・管理するメタデータストア\n【Glue ETL Jobs】Apache Sparkベースで大規模データ変換\n【Glue Crawlers】S3等を自動スキャンしてスキーマを検出\n試験ではGlue=ETL・データカタログとセットで覚える',
      },
      {
        term: 'データレイク vs データウェアハウス',
        definition: '【データレイク（S3ベース）】あらゆる形式のデータを生のまま大量蓄積。スキーマは後で定義（Schema on Read）。柔軟だが分析には前処理が必要\n【データウェアハウス（Redshift）】分析用に整理・構造化済みのデータを蓄積。スキーマは事前定義（Schema on Write）。集計クエリが高速',
        diagram: '生データ(CSV,JSON,動画)\n        ↓\n  データレイク(S3)\n        ↓ ETL(Glue)\n データウェアハウス\n     (Redshift)\n        ↓\n    BI分析・AI学習',
      },
      {
        term: 'Amazon Redshift（データウェアハウス）',
        definition: 'ペタバイト規模のデータウェアハウスサービス。列指向ストレージで集計クエリが非常に高速。\n【特徴】列指向DB・大規模並列処理（MPP）・S3とのシームレスな連携（Redshift Spectrum）\n用途：売上分析・BI（Business Intelligence）・ML学習データの準備\nAthenaとの違い：常時クラスター稼働のため高速・高コスト',
      },
      {
        term: 'ETLパイプライン設計',
        definition: 'Extract（抽出）→ Transform（変換）→ Load（ロード）の一連の処理。\n【データ品質の問題】欠損値・重複・外れ値・フォーマット不一致\n【変換処理例】欠損値の補完・カテゴリのエンコード・正規化・特徴量エンジニアリング\nAWSでの一般的な流れ：Kinesis→S3（生）→Glue→S3（加工済）→Redshift/SageMaker',
      },
    ],
    outro: [
      { speaker: 'sato', text: 'Kinesis→Glue→S3→Redshiftというパイプラインが明確になりました。具体的な提案書を期待しています' },
      { speaker: 'tanaka', text: '「流れるデータ」から「使えるデータ」に変換するパイプライン設計、完璧に理解できました！' },
      { speaker: 'you', text: 'データが使えるようになって初めてAIが動き出すんですね' },
      { speaker: 'suzuki', text: 'ワシが「データが命」と言い続けてきた意味がわかったか。当然だが' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '田村です。弊社の工場では毎秒1,000台のセンサーからデータが発生しています。これをどう扱いますか？' },
        { speaker: 'suzuki', text: '（すかさず）もちろん対応しております！横田、説明してやれ' },
        { speaker: 'tanaka', text: 'リアルタイムのストリーミングデータには「Amazon Kinesis」が最適です。毎秒何千件ものデータをリアルタイムに受信・処理できます' },
        { speaker: 'you', text: 'そのままAIに入れられますか？' },
        { speaker: 'tanaka', text: '実はそのままでは使えないことが多い。欠損値・フォーマット統一・不要列の削除といった「ETL処理」が先に必要です' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: '「ETL」はどのサービスで行うんですか？' },
        { speaker: 'tanaka', text: '「AWS Glue」がマネージドETLサービスです。サーバーレスで動き、データのスキーマを自動検出する「データカタログ」機能も備えています' },
        { speaker: 'you', text: 'データカタログって何ですか？' },
        { speaker: 'tanaka', text: '「どこにどんな形式のデータがあるか」のメタデータ管理台帳です。S3の大量ファイルも自動で整理して検索できるようになります' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'Amazon Kinesis（ストリーミングデータ処理）',
        definition: 'リアルタイムのストリーミングデータを収集・処理するサービス群。\n【Kinesis Data Streams】データを収集してリアルタイム処理（ミリ秒レイテンシ）\n【Kinesis Data Firehose】ストリームデータをS3/Redshiftに自動配信\n【Kinesis Data Analytics】SQLでストリームデータをリアルタイム分析\n\n用途：IoTセンサー・ログ収集・クリックストリーム',
        examTip: '「リアルタイム・ストリーミング → Kinesis」はセットで覚える。バッチ処理との違いは「流れ続けるデータを止めずに処理する」点。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '処理後のデータはどこに保存しますか？分析もしたいのですが' },
        { speaker: 'tanaka', text: '2つの選択肢があります。S3をベースにした「データレイク」に生データを溜め込む方法と、分析クエリに特化した「Amazon Redshift」に整理済みデータを入れる方法です' },
        { speaker: 'you', text: 'データレイクとデータウェアハウスの違いは何ですか？' },
        { speaker: 'tanaka', text: 'データレイクはあらゆる形式を生のまま大量蓄積。データウェアハウスは分析用に整理・構造化されたデータを蓄積します。Redshiftは列指向DBで集計クエリが高速です' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'AWS Glue / ETLパイプライン',
        definition: '【AWS Glue】サーバーレスのETLサービス。\n・Glue Data Catalog：データのスキーマを自動検出・管理するメタデータストア\n・Glue ETL Jobs：Apache Sparkベースで大規模データ変換\n・Glue Crawlers：S3等を自動スキャンしてスキーマ検出\n\n【ETLの流れ】Extract（抽出）→ Transform（変換）→ Load（ロード）\nデータ品質：欠損値・重複・外れ値・フォーマット不一致を修正',
        examTip: '「Glue = ETL + データカタログ」をセットで覚える。試験では「サーバーレスETL」「スキーマ自動検出」というキーワードでGlueを選ぶ。',
      },
      /* Scene 06 */
      { type: 'quiz', question: '大木製造の工場センサーから毎秒送られるデータをリアルタイムで収集・処理するサービスはどれですか？',
        options: ['AWS Glue', 'Amazon Kinesis Data Streams', 'Amazon S3', 'Amazon Redshift'],
        answer: 1,
        explanation: '正解はB（Kinesis Data Streams）。リアルタイム・ストリーミングデータの収集処理はKinesisが担当。GlueはETL変換、S3はストレージ、Redshiftはデータウェアハウスです。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'データレイク vs データウェアハウス',
        definition: '【データレイク（S3ベース）】あらゆる形式（CSV・JSON・動画・画像）を生のまま大量蓄積。スキーマは後で定義（Schema on Read）。柔軟だが分析には前処理が必要\n\n【データウェアハウス（Redshift）】分析用に整理・構造化済みデータを蓄積。スキーマは事前定義（Schema on Write）。列指向DBで集計クエリが高速',
        diagram: '生データ(CSV/JSON/画像)\n        ↓\n  データレイク(S3)\n        ↓ ETL(Glue)\n データウェアハウス\n     (Redshift)\n        ↓\n    BI分析・AI学習',
        examTip: 'データレイク＝生データをそのまま保存・柔軟、Redshift＝構造化・高速分析。AthenaはS3に直接SQLを実行するサーバーレスの選択肢。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '「Amazon Athena」という名前も聞いたことがあります' },
        { speaker: 'tanaka', text: 'S3上のデータに直接SQLクエリを実行できるサーバーレスサービスです。Redshiftほど高速ではないですが、データ移動なしにクエリできる利点があります' },
        { speaker: 'suzuki', text: 'データレイク！ワシはずっとこの言葉の本質を理解してきた。まさに「大河」だ' },
        { speaker: 'you', text: '（部長の「大河」は本当に関係あるんだろうか…）全体の流れを整理すると、Kinesis→S3→Glue→Redshift、という順番ですか？' },
        { speaker: 'tanaka', text: '正確にはKinesis→S3（生データレイク）→Glue（ETL変換）→S3（加工済）→Redshift・SageMakerという流れです' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: '大木製造の工場データパイプラインで「データ変換・クレンジング」を担当するAWSサービスはどれですか？',
        options: ['Amazon Kinesis', 'AWS Glue', 'Amazon Redshift', 'Amazon Athena'],
        answer: 1,
        explanation: '正解はB（AWS Glue）。GlueはETL（抽出・変換・ロード）を担うサーバーレスサービスです。Kinesisはストリーミング収集、RedshiftはDWH格納・分析、AthenaはS3への直接クエリです。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'Kinesis→Glue→S3→Redshiftのパイプラインが全部つながりました！' },
        { speaker: 'tanaka', text: '完璧です。「流れるデータ」から「使えるデータ」へ。このパイプラインが大木製造AIの土台になります' },
        { speaker: 'sato', text: 'パイプラインの全体像が明確になりました。具体的な提案書を期待しています' },
        { speaker: 'tanaka', text: '次はいよいよAWSのAIサービスです。大木製造への本番提案に入ります！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 7: AWS AIサービス（第7章）
  ───────────────────────────────────── */
  {
    id: 'mission-7',
    number: 7,
    title: 'AIサービスで難題を解決せよ！',
    subtitle: '大木製造・田村様への本番提案',
    category: 'aws-services',
    difficulty: 'medium',
    questionCount: 3,
    badge: { icon: '🤖', label: 'AIサービスマスター', color: '#fbbf24' },
    audioUrl: 'https://drive.google.com/file/d/1qVj-g_t7in1ZgeRv0pSCMbttyrVLsr7s/preview',
    intro: [
      { speaker: 'suzuki', text: '今日の大木製造・田村さんは重要顧客だ。余計なことは言うな。特に○○、黙っていろ' },
      { speaker: 'suzuki', text: '（会議室に入った瞬間、声のトーンが完全に変わる）田村様！本日はお時間をいただき誠にありがとうございます！！' },
      { speaker: 'sato', text: '富田部長、よろしくお願いします。早速ですが、工場の課題を3つ伝えます。①製品画像の不良品検知 ②修理マニュアルの多言語展開 ③コールセンターの音声テキスト化。それぞれどう対応しますか？' },
      { speaker: 'suzuki', text: 'はい！もちろんです！横田、詳細を…' },
      { speaker: 'sato', text: '（2秒の沈黙）……横田さんに直接お聞きしてもいいですか？' },
      { speaker: 'tanaka', text: '①画像の不良品検知には「Amazon Rekognition」が最適です。カメラ画像をリアルタイムで分析し、傷・歪みを自動検知します。事前学習済みモデルのため、すぐに使い始められます' },
      { speaker: 'sato', text: '②のマニュアル多言語展開は？' },
      { speaker: 'you', text: '（思い切って発言する）テキスト内のキーワードや言語を自動識別する「Amazon Comprehend」でドキュメント分析し、「Amazon Translate」で自動翻訳します。その翻訳テキストを「Amazon Polly」で音声化すれば、音声マニュアルも作れます！' },
      { speaker: 'sato', text: '（少し驚いた表情で）なるほど。○○さん、いい提案ですね' },
      { speaker: 'suzuki', text: '（あわてて）そ、それはワシが指導してきた結果です！！' },
      { speaker: 'tanaka', text: '③のコールセンター音声テキスト化は「Amazon Transcribe」です。リアルタイムで音声をテキストに変換し、その後Comprehendで感情分析もできます' },
      { speaker: 'sato', text: '社内Q&Aシステムも欲しいのですが、対応できますか？' },
      { speaker: 'tanaka', text: '「Amazon Kendra」という機械学習ベースの企業内検索エンジンがあります。PDFや社内ドキュメントから自然言語で検索できます。Eコマースのレコメンド機能は「Amazon Personalize」です' },
    ],
    concepts: [
      {
        term: 'Amazon Rekognition（画像・動画分析）',
        definition: '事前学習済みの画像・動画分析サービス。モデル学習不要ですぐ使える。\n【機能】物体検出・顔認識・表情分析・テキスト検出・動画内の人物トラッキング\n【カスタムラベル】自社製品の不良品など独自の分類を追加学習可能\n用途：工場の外観検査・セキュリティ監視・年齢確認・メディアコンテンツモデレーション',
      },
      {
        term: 'Amazon Comprehend（テキスト分析）',
        definition: 'テキストから意味を抽出するNLPサービス。\n【感情分析】テキストのポジティブ/ネガティブを判定（カスタマーレビュー分析）\n【エンティティ抽出】人名・地名・組織名・日付を自動抽出\n【キーフレーズ抽出】重要フレーズを自動識別\n【言語検出】テキストの言語を自動識別\nComprehend Medical：医療テキスト専用版',
      },
      {
        term: 'Amazon Transcribe / Amazon Polly',
        definition: '【Amazon Transcribe】音声→テキスト変換（Speech to Text）。コールセンター・会議録・字幕生成に使用。話者分離機能あり\n【Amazon Polly】テキスト→音声変換（Text to Speech）。自然な音声で50以上の言語・音声に対応。多言語マニュアルの音声化に使用\n覚え方：Transcribe=書き起こし、Polly=おしゃべり',
      },
      {
        term: 'Amazon Kendra（エンタープライズ検索）',
        definition: '機械学習を使ったインテリジェントな企業内検索エンジン。\n【特徴】自然言語での質問に答える（「有給休暇は何日？」→規則書から直接回答）\n【データソース】S3・SharePoint・Salesforce・データベース等に接続\n【用途】社内Q&Aシステム・コールセンター支援・ナレッジベース\n通常の全文検索と違い、文脈を理解した回答が可能',
      },
      {
        term: 'Amazon Personalize / その他AIサービス',
        definition: '【Personalize】リアルタイムパーソナライゼーション。Eコマースのレコメンド・動画配信の「おすすめ」。Netflix同様のアルゴリズムをAPIとして提供\n【Textract】PDF・スキャン文書からテキスト・表・フォームを自動抽出\n【Lex】音声・テキストチャットボット作成（Alexaと同じ技術）\n試験では「入力と出力の形式」で適切なサービスを選ぶ問題が多い',
      },
    ],
    outro: [
      { speaker: 'sato', text: '各課題への対応サービスが明確になりました。次回、詳細な見積もりを持ってきてください' },
      { speaker: 'suzuki', text: '（会議室を出た瞬間に戻って）どうだ、ワシの指導の成果だろう！田村さん、さすが目利きだ' },
      { speaker: 'you', text: '（田村さんが見ていたのは横田先輩でしたが…）' },
      { speaker: 'tanaka', text: '○○さん、途中で自分から発言できましたね！成長しています。次はSageMakerでモデルを作ります！' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'suzuki', text: '今日の大木製造・田村さんは重要顧客だ。余計なことは言うな。特に○○、黙っていろ' },
        { speaker: 'suzuki', text: '（会議室に入った瞬間、声のトーンが完全に変わる）田村様！本日はお時間をいただき誠にありがとうございます！！' },
        { speaker: 'sato', text: '富田部長、よろしくお願いします。早速ですが工場の課題を3つ伝えます。①製品画像の不良品検知 ②修理マニュアルの多言語展開 ③コールセンターの音声テキスト化。それぞれどう対応しますか？' },
        { speaker: 'suzuki', text: 'はい！もちろんです！横田、詳細を…' },
        { speaker: 'sato', text: '（2秒の沈黙）……横田さんに直接お聞きしてもいいですか？' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '①画像の不良品検知には「Amazon Rekognition」が最適です。カメラ画像をリアルタイムで分析し、傷・歪みを自動検知します。事前学習済みモデルのため、すぐ使い始められます' },
        { speaker: 'sato', text: '②のマニュアル多言語展開は？' },
        { speaker: 'you', text: '（思い切って発言する）テキストを分析する「Amazon Comprehend」でドキュメントを解析し、「Amazon Translate」で自動翻訳します。翻訳テキストを「Amazon Polly」で音声化すれば音声マニュアルも作れます！' },
        { speaker: 'sato', text: '（少し驚いた表情で）なるほど。○○さん、いい提案ですね' },
        { speaker: 'suzuki', text: '（あわてて）そ、それはワシが指導してきた結果です！！' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'Amazon Rekognition（画像・動画分析）',
        definition: '事前学習済みの画像・動画分析サービス。モデル学習不要ですぐ使える。\n【機能】物体検出・顔認識・表情分析・テキスト検出・動画内人物トラッキング\n【カスタムラベル】自社製品の不良品など独自の分類を追加学習可能\n\n用途：工場の外観検査・セキュリティ監視・年齢確認・メディアコンテンツモデレーション',
        examTip: '「画像・動画 → Rekognition」は最頻出。カスタムラベルで大木製造の独自不良品分類を追加学習できる点もポイント。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '③のコールセンター音声テキスト化は「Amazon Transcribe」です。リアルタイムで音声をテキストに変換します。さらに Comprehend で感情分析もできます' },
        { speaker: 'sato', text: '社内Q&Aシステムも欲しいのですが。修理マニュアルを検索して答えてくれるようなもの' },
        { speaker: 'tanaka', text: '「Amazon Kendra」という機械学習ベースの企業内検索エンジンがあります。PDFや社内ドキュメントから自然言語で検索できます' },
        { speaker: 'you', text: '「先週の不良率は？」と話しかけたら答えてくれる感じですね！' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'Amazon Comprehend / Translate / Polly',
        definition: '【Amazon Comprehend】テキスト分析NLPサービス。感情分析（ポジ/ネガ）・エンティティ抽出（人名・地名）・言語検出・キーフレーズ抽出\n\n【Amazon Translate】テキスト自動翻訳。75言語以上に対応。Comprehendで言語検出→Translateで翻訳という組み合わせが定番\n\n【Amazon Polly】テキスト→音声変換（TTS）。50以上の言語・音声。翻訳テキストの音声マニュアル化に活用',
        examTip: 'Transcribe（音声→テキスト）とPolly（テキスト→音声）は逆方向。混同しやすいので「Transcribe=書き起こし」「Polly=おしゃべり」で覚える。',
      },
      /* Scene 06 */
      { type: 'quiz', question: 'コールセンターの通話音声を自動でテキストに変換し、顧客の感情を分析したい。使用するAWSサービスの組み合わせとして正しいのはどれですか？',
        options: ['Amazon Polly → Amazon Comprehend', 'Amazon Transcribe → Amazon Comprehend', 'Amazon Translate → Amazon Rekognition', 'Amazon Kendra → Amazon Polly'],
        answer: 1,
        explanation: '正解はB。Transcribeで音声→テキスト変換し、Comprehendでテキストの感情分析を行います。Pollyはテキスト→音声（逆方向）、TranslateはテキストをAI翻訳、Kendraは文書検索です。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'Amazon Transcribe / Kendra / Personalize',
        definition: '【Amazon Transcribe】音声→テキスト変換（STT）。話者分離機能・専門用語カスタム辞書対応。コールセンター・会議録・字幕生成\n\n【Amazon Kendra】ML搭載の企業内検索エンジン。自然言語で社内ドキュメントを検索。S3・SharePoint等に接続\n\n【Amazon Personalize】リアルタイムレコメンド。Eコマース「あなたへのおすすめ」・動画サービスの推薦',
        examTip: '試験では「入力と出力の形式」でサービスを選ぶ。音声→テキスト=Transcribe、検索=Kendra、推薦=Personalize。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: 'Eコマースサイトで部品をレコメンドする機能も追加したいのですが' },
        { speaker: 'tanaka', text: '「Amazon Personalize」が最適です。NetflixやAmazonのようなレコメンドエンジンをAPIで利用できます' },
        { speaker: 'you', text: 'Textractという名前も聞きました' },
        { speaker: 'tanaka', text: 'PDF・スキャン文書からテキスト・表・フォームを自動抽出するサービスです。紙の検査レポートをデジタル化するのに使えます' },
        { speaker: 'sato', text: '各課題への対応が明確になりました。次回、詳細な見積もりを期待しています' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: 'AIサービスのユースケースの組み合わせで正しいものはどれですか？',
        options: ['画像から文字を読み取る → Amazon Transcribe', 'PDFから表データを抽出する → Amazon Textract', '顧客レビューの感情分析 → Amazon Rekognition', 'テキストを音声に変換する → Amazon Translate'],
        answer: 1,
        explanation: '正解はB（Textract）。PDFや文書からテキスト・表・フォームを抽出するのがTextractです。Transcribeは音声→テキスト、Rekognitionは画像分析、Translateはテキスト翻訳です。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'Rekognition・Comprehend・Transcribe・Polly・Kendra・Personalize——全部つながりました！' },
        { speaker: 'tanaka', text: '完璧です。「入力形式→目的→サービス」の対応表が頭に入りましたね。大木製造の3課題全部に答えられました' },
        { speaker: 'suzuki', text: '（誰も頼んでいないのに）田村さん、ワシの部下は優秀でしょう。なんといっても——' },
        { speaker: 'tanaka', text: '次はSageMakerで不良品検知モデルを実際に構築します！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 8: SageMaker AI（第8章）
  ───────────────────────────────────── */
  {
    id: 'mission-8',
    number: 8,
    title: 'MLパイプラインを構築せよ！',
    subtitle: 'SageMakerで不良品検知モデルを作る',
    category: 'ml-fundamentals',
    difficulty: 'medium',
    questionCount: 3,
    badge: { icon: '🏭', label: 'MLエンジニア', color: '#fb923c' },
    audioUrl: 'https://drive.google.com/file/d/1yNS_lM3mxWevAoTI3P1YxJsebr-qOuOK/preview',
    intro: [
      { speaker: 'tanaka', text: '大木製造の不良品検知モデルを実際に作ります。SageMaker Studioを開いてください' },
      { speaker: 'you', text: 'まず何をするんですか？' },
      { speaker: 'tanaka', text: '最初のステップはデータ準備です。「SageMaker Data Wrangler」を使います。300種類以上のデータ変換がGUIで使えます' },
      { speaker: 'suzuki', text: '（のぞき込んで）「ワングラー」？ワシも若い頃はデータを格闘技（レスリング）のように扱っていた。懐かしい' },
      { speaker: 'you', text: 'ラベル付けはどうするんですか？不良品と良品の判断は人がやるんですよね？' },
      { speaker: 'tanaka', text: '「SageMaker Ground Truth」を使います。クラウドソーシングやチームで画像にラベルを付けられます。Active Learning機能で効率化もできます' },
      { speaker: 'you', text: '特徴量はどこで管理するんですか？複数のモデルで同じ特徴量を使い回したい' },
      { speaker: 'tanaka', text: '「SageMaker Feature Store」で特徴量を一元管理できます。チーム全体で共有して再利用でき、学習時と推論時で同じ特徴量を使うことが保証されます' },
      { speaker: 'you', text: 'モデルが完成したら、どうやって本番に出しますか？' },
      { speaker: 'tanaka', text: '4つのデプロイ方法があります。リアルタイム推論・サーバーレス推論・バッチ変換・非同期推論です。工場の検査ラインにはリアルタイム推論が最適です' },
      { speaker: 'suzuki', text: '「4つのデプロイ」？ワシが昔から「選択肢は4つが理想だ」と主張してきたのと一致するな' },
      { speaker: 'you', text: 'プログラミングが苦手な田村さんのチームも自分でモデルを作れますか？' },
      { speaker: 'tanaka', text: '「SageMaker Canvas」というノーコードツールがあります。コードを書かずにGUIでMLモデルを作れます。「SageMaker JumpStart」は事前学習済みモデルをワンクリックでデプロイできます' },
    ],
    concepts: [
      {
        term: 'SageMaker Data Wrangler（データ前処理）',
        definition: 'ノーコードでデータの前処理・視覚化ができるツール。\n【機能】300種類以上の変換（欠損値補完・エンコード・正規化）をGUIで適用\n【データ品質レポート】外れ値・クラス不均衡・特徴量の分布を自動レポート\n【接続先】S3・Athena・Redshift・Feature Store等\nMLパイプラインの最初のステップとして使用',
      },
      {
        term: 'SageMaker Ground Truth（ラベリング）',
        definition: '機械学習用のデータラベリングサービス。\n【人手ラベリング】AWS Marketplace経由のアノテーターまたは社内チームが画像・テキストにラベルを付ける\n【Active Learning】AIが「不確かなデータ」だけを人間に提示し、ラベリング工数を最大70%削減\n用途：画像分類・物体検出・テキスト分類・音声ラベリング',
      },
      {
        term: 'SageMaker Feature Store（特徴量管理）',
        definition: '機械学習の特徴量を一元管理・共有するサービス。\n【オンラインストア】低レイテンシでのリアルタイム推論用（ミリ秒アクセス）\n【オフラインストア】学習・バッチ推論用（S3に保存）\n【メリット】特徴量の再利用・学習と推論で同じ特徴量を保証・チーム全体で共有可能',
      },
      {
        term: 'SageMakerの4つのデプロイオプション',
        definition: '【リアルタイム推論】常時起動エンドポイント。低レイテンシが必要な場合（工場ライン・APIサービス）\n【サーバーレス推論】呼び出し時のみ起動。トラフィックが断続的な場合。コスト最適\n【バッチ変換】大量データを一括処理。リアルタイム性不要な場合（月次レポート）\n【非同期推論】大きなペイロード・長い処理時間に対応（動画・大規模文書）',
        diagram: '低レイテンシ・高頻度 → リアルタイム推論\n断続的トラフィック → サーバーレス推論\n大量バッチ処理   → バッチ変換\n大きな入力・長時間 → 非同期推論',
      },
      {
        term: 'SageMaker Canvas / JumpStart',
        definition: '【SageMaker Canvas】ノーコードMLツール。コーディング不要でGUIのみでモデル作成・予測。データサイエンティスト以外でも使える。自動ML（AutoML）で最適モデルを自動選択\n【SageMaker JumpStart】事前学習済みモデルとMLソリューションのカタログ。ワンクリックでデプロイ・ファインチューニング可能',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: 'Data Wrangler→Ground Truth→Feature Store→学習→デプロイ、MLパイプラインの全体像が見えましたね！' },
      { speaker: 'you', text: '4つのデプロイ方法、用途ごとに選べるようになりました！' },
      { speaker: 'suzuki', text: 'ちょうどモデルが完成したな。田村さんへのデモ準備をしろ。ワシが最終確認する' },
      { speaker: 'tanaka', text: '次は田村さんがリクエストした「生成AI」です。ChatGPTのような仕組みを理解しましょう！' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '大木製造の不良品検知モデルを実際に作ります。SageMaker Studioを開いてください' },
        { speaker: 'you', text: 'まず何をするんですか？' },
        { speaker: 'tanaka', text: '最初は「データ前処理」です。「SageMaker Data Wrangler」を使います。300種類以上のデータ変換がGUIで使えます' },
        { speaker: 'suzuki', text: '（のぞき込んで）「ワングラー」？ワシも若い頃はデータを格闘技のように扱っていた。懐かしい' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'ラベル付けはどうするんですか？不良品と良品の判断は人がやるんですよね？' },
        { speaker: 'tanaka', text: '「SageMaker Ground Truth」を使います。クラウドソーシングやチームで画像にラベルを付けられます。Active Learning機能で効率化もできます' },
        { speaker: 'you', text: 'Active Learningとは何ですか？' },
        { speaker: 'tanaka', text: 'AIが「不確かなデータ」だけを人間に提示します。明らかに良品・不良品とわかるデータは自動で処理し、ラベリング工数を最大70%削減できます' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'SageMaker Data Wrangler / Ground Truth',
        definition: '【SageMaker Data Wrangler】ノーコードでデータ前処理・可視化\n・300種類以上の変換（欠損値補完・エンコード・正規化）をGUIで適用\n・データ品質レポート：外れ値・クラス不均衡・特徴量分布を自動レポート\n・接続先：S3・Athena・Redshift等\n\n【SageMaker Ground Truth】MLデータラベリングサービス\n・Active Learning：不確かなデータのみ人間に提示し工数70%削減',
        examTip: 'Data Wrangler＝前処理GUI、Ground Truth＝ラベリング。MLパイプラインでは「Wrangler→Ground Truth→学習」の順序が問われる。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: '特徴量はどこで管理するんですか？複数のモデルで同じ特徴量を使い回したい' },
        { speaker: 'tanaka', text: '「SageMaker Feature Store」で特徴量を一元管理できます。チーム全体で共有・再利用でき、学習時と推論時で同じ特徴量を使うことが保証されます' },
        { speaker: 'you', text: 'モデルが完成したら、どうやって本番に出しますか？' },
        { speaker: 'tanaka', text: '4つのデプロイ方法があります。リアルタイム推論・サーバーレス推論・バッチ変換・非同期推論です。工場検査ラインにはリアルタイムが最適です' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'SageMaker Feature Store',
        definition: '機械学習の特徴量を一元管理・共有するサービス。\n\n【オンラインストア】低レイテンシでリアルタイム推論用（ミリ秒アクセス）\n【オフラインストア】学習・バッチ推論用（S3に保存）\n\n【メリット】\n・特徴量の再利用でチーム効率化\n・学習と推論で同じ特徴量を保証（training-serving skewを防ぐ）\n・チーム全体でカタログとして共有',
        examTip: '「training-serving skew（学習と推論で特徴量が違う）」防止がFeature Storeの主な目的。試験では「特徴量の再利用・一貫性」のキーワードで選ぶ。',
      },
      /* Scene 06 */
      { type: 'quiz', question: '大木製造の不良品画像にラベル（良品/不良品）を付けるためのSageMakerサービスはどれですか？',
        options: ['SageMaker Data Wrangler', 'SageMaker Ground Truth', 'SageMaker Feature Store', 'SageMaker Model Monitor'],
        answer: 1,
        explanation: '正解はB（Ground Truth）。画像・テキストへのラベリングはGround Truthが担当。Active Learning機能でアノテーション工数を最大70%削減できます。Data Wranglerは前処理、Feature Storeは特徴量管理、Model Monitorは本番監視です。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'SageMakerの4つのデプロイオプション',
        definition: '【リアルタイム推論】常時起動エンドポイント。低レイテンシが必要（工場ライン・APIサービス）\n【サーバーレス推論】呼び出し時のみ起動。トラフィックが断続的な場合。コスト最適\n【バッチ変換】大量データを一括処理。リアルタイム性不要（月次レポート）\n【非同期推論】大きなペイロード・長い処理時間に対応（動画・大規模文書）',
        diagram: '低レイテンシ・高頻度 → リアルタイム推論\n断続的トラフィック  → サーバーレス推論\n大量バッチ処理     → バッチ変換\n大きな入力・長時間  → 非同期推論',
        examTip: '4オプションの使い分けは試験頻出。「工場ライン→リアルタイム」「月次処理→バッチ変換」「動画解析→非同期」の組み合わせを覚える。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'プログラミングが苦手な田村さんのチームも自分でモデルを作れますか？' },
        { speaker: 'tanaka', text: '「SageMaker Canvas」というノーコードツールがあります。コードを書かずにGUIでMLモデルを作れます' },
        { speaker: 'you', text: '既存モデルをすぐ使いたい場合は？' },
        { speaker: 'tanaka', text: '「SageMaker JumpStart」は事前学習済みモデルをワンクリックでデプロイできます。基盤モデルからコンピュータビジョンまで豊富なラインナップです' },
        { speaker: 'suzuki', text: 'ノーコード！ワシにもできるな（小声：でもUIが英語だと困る）' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: '月に1回、製品画像10万枚をまとめて不良品分類する処理に最適なSageMakerデプロイオプションはどれですか？',
        options: ['リアルタイム推論エンドポイント', 'サーバーレス推論', 'バッチ変換', '非同期推論'],
        answer: 2,
        explanation: '正解はC（バッチ変換）。月次の大量データを一括処理する場合はバッチ変換が最適・最安。リアルタイム推論は常時起動コストがかかる。サーバーレスは断続的アクセス向け、非同期は大きな単一ペイロード向けです。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'Data Wrangler→Ground Truth→Feature Store→学習→デプロイ——MLパイプラインの全体像が見えました！' },
        { speaker: 'tanaka', text: '完璧です。4つのデプロイオプションも用途ごとに選べるようになりましたね。大木製造のデモ準備ができました' },
        { speaker: 'suzuki', text: 'ちょうどモデルが完成したな。田村さんへのデモはワシが立会いをする。よし、準備万端だ' },
        { speaker: 'tanaka', text: '次は田村さんがリクエストした「生成AI」です。ChatGPTのような仕組みを理解しましょう！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 9: 生成AIの概要（第9章）
  ───────────────────────────────────── */
  {
    id: 'mission-9',
    number: 9,
    title: '生成AI旋風！LLMの謎を解け',
    subtitle: '「ChatGPTみたいなの作って」への答え',
    category: 'ai-basics',
    difficulty: 'medium',
    questionCount: 3,
    badge: { icon: '✨', label: '生成AIマスター', color: '#e879f9' },
    audioUrl: 'https://drive.google.com/file/d/1ufOsPFcLRhuo5IVQnz_VKUP4X2Z0QW5S/preview',
    intro: [
      { speaker: 'sato', text: '田村です。社長がChatGPTを見て「ウチでも同じようなものを作れ」と言っています。どこから始めますか？' },
      { speaker: 'suzuki', text: '（すかさず）もちろん対応できます！ワシが生成AIの先駆者として10年以上研究してきた成果を…' },
      { speaker: 'sato', text: '（静かに）横田さん、説明してください' },
      { speaker: 'tanaka', text: '生成AIの核心は「LLM（大規模言語モデル）」です。膨大なテキストデータで学習した巨大なモデルが、次に来る言葉を確率的に予測することでテキストを生成します' },
      { speaker: 'you', text: '「基盤モデル（FM）」と「LLM」はどう違うんですか？' },
      { speaker: 'tanaka', text: '基盤モデルはテキスト・画像・音声など多様なタスクに使える汎用的な大規模モデルの総称。LLMはテキスト特化の基盤モデルです。ClaudeやGPT-4が代表例です' },
      { speaker: 'sato', text: 'モデルをゼロから作るのですか？コストが心配です' },
      { speaker: 'tanaka', text: '3つの選択肢があります。①プロンプトエンジニアリング（既存モデルをそのまま使い、指示の工夫だけで対応）②RAG（社内データを検索して回答に使う）③ファインチューニング（自社データで追加学習）。コスト・精度のトレードオフがあります' },
      { speaker: 'you', text: '「ハルシネーション」という問題も聞きました' },
      { speaker: 'tanaka', text: 'AIが事実と異なる情報を自信満々に答えてしまう問題です。RAGで最新・自社情報を検索参照させることが有効な対策になります' },
      { speaker: 'suzuki', text: '「ハルシネーション」？ワシも会議でよく…その、そういうことはない。断じてない' },
      { speaker: 'sato', text: 'プロンプトエンジニアリングというのを詳しく教えてもらえますか？' },
      { speaker: 'tanaka', text: 'AIへの指示の書き方の工夫です。「Zero-shot」はそのまま質問、「Few-shot」は例を数件見せてから質問、「Chain-of-Thought」は「ステップバイステップで考えてください」と明示する方法です' },
    ],
    concepts: [
      {
        term: 'LLM（大規模言語モデル）と基盤モデル（FM）',
        definition: '【LLM】テキストを入力してテキストを生成するモデル。次の単語を確率的に予測する仕組み。パラメータ数が数十億〜数千億。例：Claude・GPT-4・Llama\n【基盤モデル（Foundation Model）】テキスト・画像・音声など多様なタスクに対応できる汎用的な大規模事前学習モデル。LLMはFMの一種\n試験：FMを活用する方法（プロンプト/RAG/ファインチューニング）の使い分けが頻出',
      },
      {
        term: 'プロンプトエンジニアリング',
        definition: 'LLMへの指示（プロンプト）を工夫して望む出力を引き出す技術。モデルを変更せずに性能を向上させる。\n【Zero-shot】例なしで直接質問\n【Few-shot】2〜5件の例を見せてから質問。精度向上に効果的\n【Chain-of-Thought（CoT）】「ステップバイステップで考えて」と指示。複雑な推論に有効\n【System Prompt】AIの役割・制約・ペルソナを定義する前置き',
      },
      {
        term: 'RAG（検索拡張生成）',
        definition: 'Retrieval-Augmented Generation。LLMが回答する前に関連情報をデータベースから検索し、その情報をコンテキストとして与える手法。\n【仕組み】① 質問をエンベディング変換 → ② ベクターDBで類似文書検索 → ③ 検索結果+質問をLLMに入力 → ④ 回答生成\n【効果】ハルシネーション軽減・最新情報への対応・社内独自情報を参照可能',
        diagram: '質問: 「製品Aの保証期間は？」\n        ↓\n  ベクター検索\n  社内マニュアルDB\n        ↓ 関連文書を取得\n  LLM (Claude等)\n  「製品Aの保証は2年です」\n        ↓\n  根拠付きの正確な回答',
      },
      {
        term: 'ファインチューニング vs プロンプトエンジニアリング vs RAG',
        definition: '【プロンプトエンジニアリング】コスト最小・すぐ試せる。ただし複雑なタスクには限界\n【RAG】最新情報・社内情報の参照が必要な場合。ハルシネーション対策に有効。実装コスト中程度\n【ファインチューニング】特定ドメインのスタイル・知識をモデルに組み込む。コスト高・データが必要\n試験では「どのアプローチが適切か」の状況判断が頻出',
      },
      {
        term: 'ハルシネーション（幻覚）',
        definition: 'LLMが事実と異なる情報を自信を持って生成してしまう問題。\n【原因】学習データにない情報を確率的に「もっともらしい」テキストで補完するため\n【対策】① RAG（事実ベースの情報を検索参照）② 温度パラメータを低く設定 ③ 出力に「出典」を要求 ④ Human in the Loopで人間確認\n重要情報（医療・法律・財務）では特に注意が必要',
      },
    ],
    outro: [
      { speaker: 'sato', text: '基盤モデル・RAG・ハルシネーション対策、理解しました。まずRAGから始めましょう' },
      { speaker: 'tanaka', text: 'プロンプトエンジニアリング→RAG→ファインチューニングの選択基準が明確になりましたね！' },
      { speaker: 'you', text: '「ハルシネーション」の対策としてRAGが有効なのが分かりました' },
      { speaker: 'suzuki', text: '（小声で）RAGとファインチューニングの違い…今度こっそり○○に聞いておこう' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '田村です。社長がChatGPTを見て「ウチでも同じようなものを作れ」と言っています。どこから始めますか？' },
        { speaker: 'suzuki', text: '（すかさず）もちろん対応できます！ワシが生成AIの先駆者として10年以上研究してきた成果を…' },
        { speaker: 'sato', text: '（静かに）横田さん、説明してください' },
        { speaker: 'tanaka', text: '生成AIの核心は「LLM（大規模言語モデル）」です。膨大なテキストデータで学習し、次に来る言葉を確率的に予測することでテキストを生成します' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: '「基盤モデル（FM）」と「LLM」はどう違うんですか？' },
        { speaker: 'tanaka', text: '基盤モデルはテキスト・画像・音声など多様なタスクに使える汎用的な大規模モデルの総称。LLMはテキスト特化の基盤モデルです。Claude・GPT-4が代表例です' },
        { speaker: 'sato', text: 'モデルをゼロから作るのですか？コストが心配です' },
        { speaker: 'tanaka', text: '3つの選択肢があります。①プロンプトエンジニアリング（既存モデルをそのまま使い指示の工夫）②RAG（社内データを検索して回答に使う）③ファインチューニング（自社データで追加学習）です' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'LLM（大規模言語モデル）と基盤モデル（FM）',
        definition: '【LLM（Large Language Model）】テキスト入力→テキスト生成モデル。次の単語を確率的に予測する仕組み。パラメータ数が数十億〜数千億。例：Claude・GPT-4・Llama\n\n【基盤モデル（Foundation Model / FM）】テキスト・画像・音声など多様なタスクに対応できる汎用的な大規模事前学習モデル。LLMはFMの一種\n\n活用方法：プロンプトエンジニアリング / RAG / ファインチューニング',
        examTip: '「FM（基盤モデル）はLLMを含む広い概念」がポイント。FMの活用3手法（プロンプト/RAG/ファインチューニング）の使い分けは試験最頻出。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: 'プロンプトエンジニアリングというのを詳しく教えてもらえますか？' },
        { speaker: 'tanaka', text: 'AIへの指示の書き方の工夫です。「Zero-shot」はそのまま質問、「Few-shot」は例を数件見せてから質問、「Chain-of-Thought」は「ステップバイステップで考えてください」と明示する方法です' },
        { speaker: 'you', text: '例を見せるだけで精度が上がるんですか？' },
        { speaker: 'tanaka', text: 'Few-shotは効果的です。特に分類・変換タスクで「入力→期待する出力」の例を2〜5件見せると、モデルが形式を理解して精度が大幅に向上します' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'プロンプトエンジニアリング',
        definition: 'LLMへの指示（プロンプト）を工夫して望む出力を引き出す技術。モデルを変更せずに性能を向上させる。\n\n【Zero-shot】例なしで直接質問\n【Few-shot】2〜5件の例を見せてから質問。精度向上に効果的\n【Chain-of-Thought（CoT）】「ステップバイステップで考えて」と指示。複雑な推論に有効\n【System Prompt】AIの役割・制約・ペルソナを定義する前置き',
        examTip: 'コスト最小の改善手法＝プロンプトエンジニアリング。モデル変更なし・データ不要・即実施可能。試験では「まず試すべき手法」として選ぶ。',
      },
      /* Scene 06 */
      { type: 'quiz', question: 'LLMを使って「大木製造の社内規定に関するQ&A」システムを構築したい。モデルの再学習なしで最新の社内文書を参照させる手法として最適なのはどれですか？',
        options: ['Zero-shot プロンプトエンジニアリング', 'ファインチューニング', 'RAG（検索拡張生成）', '継続事前学習'],
        answer: 2,
        explanation: '正解はC（RAG）。社内の最新文書を検索して参照させるにはRAGが最適。ファインチューニングはモデルの挙動・スタイルを変えるがデータが古くなる。プロンプトだけでは文書内容をモデルが知らない。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'RAG（検索拡張生成）',
        definition: 'Retrieval-Augmented Generation。LLMが回答前に関連情報をDBから検索し、そをコンテキストとして与える手法。\n\n【仕組み】\n① 質問をエンベディング変換\n② ベクターDBで類似文書検索\n③ 検索結果＋質問をLLMに入力\n④ 根拠付きの回答生成\n\n【効果】ハルシネーション軽減・最新情報対応・社内独自情報を参照可能',
        diagram: '質問: 「製品Aの保証期間は？」\n        ↓ エンベディング変換\n  ベクターDB検索\n  社内マニュアルDB\n        ↓ 関連文書を取得\n  LLM (Claude等)\n「製品Aの保証は2年です」（根拠付き）',
        examTip: 'RAGはハルシネーション対策の定番。「最新情報・社内情報が必要→RAG」「特定ドメインのスタイル変更→ファインチューニング」の使い分けが頻出。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: '「ハルシネーション」という問題も聞きました' },
        { speaker: 'tanaka', text: 'AIが事実と異なる情報を自信満々に答えてしまう問題です。RAGで最新・自社情報を検索参照させることが有効な対策になります' },
        { speaker: 'suzuki', text: '「ハルシネーション」？ワシも会議でよく…その、そういうことはない。断じてない' },
        { speaker: 'you', text: '（でも先週の売上を「覚えていない」と言っていた部長が…）ファインチューニングはどういうときに使うんですか？' },
        { speaker: 'tanaka', text: '特定のドメイン語彙・スタイル・応答形式をモデルに組み込みたい場合です。コストが高く、自社ドメインのデータが十分にある場合に有効です' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: 'カスタマーサポートAIで「敬語・自社ブランドの話し方」を徹底させたい。最も適切な手法はどれですか？',
        options: ['Zero-shot プロンプト', 'RAG（社内ドキュメント検索）', 'ファインチューニング', '継続事前学習'],
        answer: 2,
        explanation: '正解はC（ファインチューニング）。特定のスタイル・話し方をモデルに「焼き込む」にはファインチューニングが最適。RAGは情報参照向き、Zero-shotプロンプトはスタイル維持が弱い。継続事前学習は大量の生データで基礎知識を更新する手法です。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'LLM・FM・プロンプトエンジニアリング・RAG・ファインチューニング——全部整理できました！' },
        { speaker: 'tanaka', text: '完璧です。「まずプロンプト→効果不十分ならRAG→さらに必要ならファインチューニング」というコスト順の判断が試験でも実務でも基本です' },
        { speaker: 'sato', text: '基盤モデルの活用方法が整理できました。まずRAGから実装を始めましょう' },
        { speaker: 'tanaka', text: '次はAmazon Qです。社員が日常業務で使えるAIアシスタントを導入します！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 10: Amazon Q（第10章）
  ───────────────────────────────────── */
  {
    id: 'mission-10',
    number: 10,
    title: '社内AIアシスタントを導入せよ！',
    subtitle: 'Amazon Qで業務効率を革命する',
    category: 'aws-services',
    difficulty: 'medium',
    questionCount: 3,
    badge: { icon: '🔍', label: 'Amazon Qマスター', color: '#38bdf8' },
    audioUrl: 'https://drive.google.com/file/d/1-CUTNrVUdMs3m5KYZ2HO8J1aUYReqNKo/preview',
    intro: [
      { speaker: 'suzuki', text: '経営会議で「社員の生産性を上げろ」と言われた。AIを使って何か手を打て。ワシはもうアイデアがある——ないでもないが、横田に聞いた方が早い' },
      { speaker: 'tanaka', text: '「Amazon Q」がピッタリです。AWSが提供するAIアシスタントサービスで、主に2つがあります——Q BusinessとQ Developerです' },
      { speaker: 'you', text: '具体的にどう違うんですか？' },
      { speaker: 'tanaka', text: 'Q Businessは「社内向けChatGPT」です。S3の社内マニュアル・規則書・議事録を読ませて、社員が自然言語で質問できるようにします' },
      { speaker: 'suzuki', text: '「有給は何日取れる？」「経費申請のフローは？」とか聞けるわけか。ワシの秘書代わりだな' },
      { speaker: 'tanaka', text: 'その通りです。SharePoint・Salesforce・Confluence・S3などのデータソースに接続できます。社員はAWSの知識なしに使えます' },
      { speaker: 'you', text: 'Q Developerは開発者向けですか？' },
      { speaker: 'tanaka', text: 'そうです。IDEの中でコード補完・コード生成・バグ修正・セキュリティスキャンをAIが支援します。Visual Studio CodeやIntelliJ IDEAのプラグインとして使えます' },
      { speaker: 'you', text: 'コードを書きながらAIに「このバグを直して」と言えるんですか？' },
      { speaker: 'tanaka', text: 'まさに。さらにQ Developerはコードのセキュリティ脆弱性を自動スキャンして修正提案もしてくれます' },
      { speaker: 'suzuki', text: 'Amazon Q in QuickSightというのも聞いたぞ' },
      { speaker: 'tanaka', text: 'BIツールのQuickSightで自然言語を使ってグラフ・ダッシュボードを作れる機能です。「先月の売上を都道府県別に棒グラフで見せて」と話しかけるだけでOKです' },
      { speaker: 'suzuki', text: 'では「ワシの残業時間を月別にグラフ化しろ」と頼んでみるか' },
      { speaker: 'you', text: '（部長の残業時間データは…存在するんだろうか）' },
    ],
    concepts: [
      {
        term: 'Amazon Q Business（社内AIアシスタント）',
        definition: '社内ドキュメントに基づいてQ&Aができるエンタープライズ向けAIサービス。\n【機能】自然言語でのドキュメント検索・要約・Q&A生成\n【データソース接続】S3・SharePoint・Salesforce・Confluence・JIRAなど40以上\n【ユーザー管理】IAM Identity Centerで社員ごとにアクセス権限制御\n用途：社内FAQ・オンボーディング支援・規程検索',
      },
      {
        term: 'Amazon Q Developer（開発者向けAI）',
        definition: 'ソフトウェア開発を支援するAIコーディングアシスタント。\n【コード補完】次のコードをリアルタイム提案（GitHub Copilot相当）\n【コード生成】自然言語で機能を説明すると実装を生成\n【セキュリティスキャン】脆弱性（SQLインジェクション・クロスサイトスクリプティング等）を自動検出・修正提案\n【対応IDE】VS Code・IntelliJ・JetBrains系',
      },
      {
        term: 'Amazon Q in QuickSight（NLQビジュアル化）',
        definition: 'BIツールのAmazon QuickSightに統合された自然言語クエリ（NLQ）機能。\n【操作】「先月の売上を都道府県別に棒グラフで表示」と自然言語で入力するだけでグラフ自動生成\n【Executive Summary】ダッシュボードのインサイトを自動要約\nSQLやグラフ設定の知識なしにデータ分析が可能',
      },
      {
        term: 'AWSのGenAIスタック（3層構造）',
        definition: 'AWSの生成AIは3層に整理される。\n【インフラ層】AWS Trainium（学習用チップ）・Inferentia（推論用チップ）\n【プラットフォーム層】Amazon Bedrock（モデルAPI・RAG・Agents）\n【アプリケーション層】Amazon Q（エンドユーザー向けAIアシスタント）\n試験ではどのサービスがどの層かを問われることがある',
        diagram: '─────────────────────────────\n アプリ層   Amazon Q Business/Developer\n─────────────────────────────\n プラット   Amazon Bedrock\n フォーム   （モデル・RAG・Agents）\n─────────────────────────────\n インフラ   Trainium / Inferentia\n─────────────────────────────',
      },
      {
        term: 'Amazon Q のユースケース使い分け',
        definition: '【Q Business】社員が社内情報を自然言語で検索・質問したい → 社内Q&A・知識管理\n【Q Developer】開発者がコーディング効率を上げたい → IDE統合・コード生成・セキュリティ\n【Q in QuickSight】非エンジニアがデータ分析したい → 自然言語でグラフ作成\n【Q in AWS Console】AWSの操作方法を質問したい → コンソール内ヘルプ\n試験ではシナリオから適切なQサービスを選ぶ問題が出る',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: 'Q Business・Q Developer・Q in QuickSightの使い分けが明確になりました！' },
      { speaker: 'you', text: 'Q Businessを大木製造さんにも提案できますね' },
      { speaker: 'suzuki', text: 'ワシもQ Developerを使ってみるか……（小声で）コードが書けないのはナイショだが' },
      { speaker: 'tanaka', text: '次はいよいよAmazon Bedrockです。生成AIシステムの核心に入ります！' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'suzuki', text: '経営会議で「社員の生産性を上げろ」と言われた。AIを使って何か手を打て。ワシはもうアイデアがある——ないでもないが、横田に聞いた方が早い' },
        { speaker: 'tanaka', text: '「Amazon Q」がピッタリです。AWSが提供するAIアシスタントサービスで、主に2つがあります——Q BusinessとQ Developerです' },
        { speaker: 'you', text: '具体的にどう違うんですか？' },
        { speaker: 'tanaka', text: 'Q Businessは「社内向けChatGPT」です。社内ドキュメントを読ませて社員が自然言語で質問できます。Q Developerは開発者向けのコーディングAIアシスタントです' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'suzuki', text: '「有給は何日取れる？」「経費申請のフローは？」とか聞けるわけか。ワシの秘書代わりだな' },
        { speaker: 'tanaka', text: 'その通りです。SharePoint・Salesforce・Confluence・S3などのデータソースに接続できます。社員はAWSの知識なしに使えます' },
        { speaker: 'you', text: 'アクセス制御はどうなりますか？誰でも全社員の情報を見られたら困ります' },
        { speaker: 'tanaka', text: 'IAM Identity Centerで社員ごとにアクセス権限を制御できます。営業は営業資料のみ、人事は人事規定のみ、というように権限を設定できます' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'Amazon Q Business（社内AIアシスタント）',
        definition: '社内ドキュメントに基づいてQ&Aができるエンタープライズ向けAIサービス。\n\n【機能】自然言語でのドキュメント検索・要約・Q&A生成\n【データソース接続】S3・SharePoint・Salesforce・Confluence・JIRA等40以上\n【ユーザー管理】IAM Identity Centerで社員ごとにアクセス権限制御\n\n用途：社内FAQ・オンボーディング支援・規程検索',
        examTip: 'Q Business＝社内ドキュメントのRAGシステム（エンドユーザー向け）。自分でRAGを構築するのがBedrock Knowledge Base。「既製品か自作か」でQ BusinessとBedrockを区別。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'Q Developerは開発者向けですか？' },
        { speaker: 'tanaka', text: 'そうです。IDEの中でコード補完・コード生成・バグ修正・セキュリティスキャンをAIが支援します。VS CodeやIntelliJのプラグインとして使えます' },
        { speaker: 'you', text: '「このバグを直して」と言えるんですか？' },
        { speaker: 'tanaka', text: 'まさに。さらに脆弱性（SQLインジェクション等）を自動スキャンして修正提案もしてくれます' },
        { speaker: 'suzuki', text: 'Amazon Q in QuickSightというのも聞いたぞ' },
        { speaker: 'tanaka', text: 'BIツールで「先月の売上を都道府県別に棒グラフで見せて」と自然言語で入力するだけでグラフを自動生成してくれる機能です' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'Amazon Q Developer / Q in QuickSight',
        definition: '【Amazon Q Developer】ソフトウェア開発を支援するAIコーディングアシスタント\n・コード補完・生成：自然言語で機能を説明すると実装を生成\n・セキュリティスキャン：脆弱性（SQLインジェクション・XSS等）を自動検出・修正提案\n・対応IDE：VS Code・IntelliJ・JetBrains系\n\n【Amazon Q in QuickSight】自然言語クエリ（NLQ）でグラフ・ダッシュボードを自動生成',
        examTip: 'Q Developer＝開発者のコーディング支援、Q Business＝一般社員の社内情報検索。「対象ユーザー」と「用途」で区別する。',
      },
      /* Scene 06 */
      { type: 'quiz', question: '大木製造の社員が「製品Aの保証規定は何ページですか？」と社内マニュアルPDFに対して自然言語で質問できるシステムを最小工数で構築したい。最適なサービスはどれですか？',
        options: ['Amazon Kendra', 'Amazon Q Business', 'Amazon Bedrock + カスタムRAG実装', 'Amazon Q Developer'],
        answer: 1,
        explanation: '正解はB（Q Business）。社内ドキュメントへの自然言語Q&Aを最小工数で構築するにはQ Businessが最適。Kendraも選択肢だが、Q BusinessはLLMとRAGが統合されており更に簡単。Bedrockはカスタム実装が必要でエンジニアリング工数がかかる。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'AWSのGenAIスタック（3層構造）',
        definition: 'AWSの生成AIサービスは3層に整理される。\n\n【インフラ層】\nAWS Trainium（学習用AIチップ）・Inferentia（推論用AIチップ）\n\n【プラットフォーム層】\nAmazon Bedrock（モデルAPI・RAG・Agents・Guardrails）\n\n【アプリケーション層】\nAmazon Q（エンドユーザー向けAIアシスタント）',
        diagram: '─────────────────────────────\n アプリ層  Amazon Q Business/Developer\n─────────────────────────────\n プラット  Amazon Bedrock\n フォーム  （モデル・RAG・Agents）\n─────────────────────────────\n インフラ  Trainium / Inferentia\n─────────────────────────────',
        examTip: 'GenAIスタックの3層：インフラ（チップ）→プラットフォーム（Bedrock）→アプリ（Q）。試験では「どのサービスがどの層か」を問われる。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'Q BusinessとBedrockのKnowledge Baseは何が違うんですか？どちらも社内文書RAGっぽい…' },
        { speaker: 'tanaka', text: 'Q Businessは非エンジニアの社員向けの「完成品」。Bedrock Knowledge BaseはエンジニアがカスタムRAGを自作するためのAPIです。大木製造の社員向けには Q Business、自社サービスに組み込むなら Bedrock です' },
        { speaker: 'sato', text: '田村です。大木製造の一般社員が使う場合はQ Business、外部顧客向けの検索機能はBedrockで実装——という理解で合っていますか？' },
        { speaker: 'tanaka', text: '完璧な理解です！' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: '新入社員が社内規定や手続きを自然言語で調べられるツールを「エンジニアがほぼいない状態」で導入したい。最適なサービスはどれですか？',
        options: ['Amazon Bedrock + Lambda + カスタム実装', 'Amazon Q Business', 'Amazon SageMaker JumpStart', 'Amazon Kendra + カスタムUI'],
        answer: 1,
        explanation: '正解はB（Q Business）。エンジニアリング工数最小で社内Q&Aシステムを構築できるのがQ Businessです。BedrockやKendraはカスタム実装が必要でエンジニアリング工数がかかります。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'Q Business・Q Developer・Q in QuickSight——「Qシリーズ」の使い分けが完全に整理できました！' },
        { speaker: 'tanaka', text: '完璧です。「誰が使うか・何をしたいか」で選ぶと迷いません。大木製造にはQ Businessが最適な提案ですね' },
        { speaker: 'suzuki', text: 'ワシもQ Developerを使ってみるか…（小声で）コードが書けないのはナイショだが' },
        { speaker: 'tanaka', text: '次はいよいよAmazon Bedrockです。生成AIシステムの核心に入ります！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 11: Amazon Bedrock（第11章）
  ───────────────────────────────────── */
  {
    id: 'mission-11',
    number: 11,
    title: 'Amazon Bedrockで生成AIを構築せよ！',
    subtitle: '基盤モデルAPI・RAG・ガードレール・Agents',
    category: 'aws-services',
    difficulty: 'medium',
    questionCount: 3,
    badge: { icon: '🪨', label: 'Bedrockビルダー', color: '#818cf8' },
    audioUrl: 'https://drive.google.com/file/d/1FCF0lAU_cBNkxpH4_CJZCitVggEMVIYk/preview',
    intro: [
      { speaker: 'sato', text: '田村です。RAGシステムの実装に入りたいと思います。Amazon Bedrockを使う予定ですが、何から始めますか？' },
      { speaker: 'tanaka', text: 'まずBedrockのモデルカタログからモデルを選びます。Anthropicのclaude（テキスト生成・推論）・Amazon Titan（汎用）・MetaのLlama（オープンソース）・Stability AIのStable Diffusion（画像生成）等があります' },
      { speaker: 'you', text: '自社の用途でモデルを選べるんですね。RAGの実装は？' },
      { speaker: 'tanaka', text: '「Bedrock Knowledge Base」が便利です。S3に社内ドキュメントを置くだけで、自動的にベクター化してRAGシステムを作れます。エンベディングモデルも含めてフルマネージドです' },
      { speaker: 'sato', text: '不適切な回答を返さないようにする仕組みはありますか？' },
      { speaker: 'tanaka', text: '「Bedrock Guardrails」で制御できます。特定のトピックを禁止したり（競合他社の話はNG等）、個人情報（PII）を自動マスクしたり、有害コンテンツをフィルタリングできます' },
      { speaker: 'suzuki', text: '「ガードレール」！ワシが長年安全第一を主張してきたのはそういうことだ' },
      { speaker: 'you', text: '複数ステップの作業を自動化したいのですが——たとえば「問い合わせ内容を確認して、在庫を調べて、メールを返信する」という一連の流れです' },
      { speaker: 'tanaka', text: '「Agents for Bedrock」がそれを実現します。自然言語でLLMがタスクを計画し、定義したツール（API・データベース）を順番に呼び出して完遂します' },
      { speaker: 'sato', text: '推論パラメータの「Temperature」と「Top-p」の違いを教えていただけますか？' },
      { speaker: 'tanaka', text: 'Temperatureは出力の「ランダム性」を制御します。0に近いほど確実な答え、高いほど創造的。Top-pは確率上位p%の単語候補のみ使用します。コード生成ならTemperature低め、ブレスト用途なら高めにします' },
      { speaker: 'you', text: 'Bedrockはモデルトレーニングにも使えますか？' },
      { speaker: 'tanaka', text: '「Model Customization」でファインチューニングと継続事前学習ができます。ただしBedrockの主な使い方はAPIで既存モデルを呼び出す「推論」です' },
    ],
    concepts: [
      {
        term: 'Amazon Bedrockのモデルカタログ',
        definition: 'APIで利用できる基盤モデルのラインナップ。\n【Anthropic Claude】テキスト生成・複雑な推論・長文理解（最大200K tokens）\n【Amazon Titan】汎用テキスト生成・エンベディング生成\n【Meta Llama】オープンソース。カスタマイズ自由度が高い\n【Stability AI Stable Diffusion】画像生成\n【Mistral AI】高速・コスト効率重視\nサーバー管理不要・APIキーで即利用可能',
      },
      {
        term: 'Bedrock Knowledge Base（RAG実装）',
        definition: 'フルマネージドのRAGサービス。\n【仕組み】S3にドキュメント配置→自動でエンベディング変換→ベクターDBに格納→質問時に類似文書を検索→LLMに渡して回答生成\n【対応ベクターDB】OpenSearch Serverless・Pinecone・Aurora（pgvector）等\n【設定不要の部分】エンベディングモデルの選択・ベクター変換・検索ロジック\n用途：社内Q&A・製品サポート・ドキュメント検索',
      },
      {
        term: 'Bedrock Guardrails（ガードレール）',
        definition: 'LLMの入出力を制御して安全性・コンプライアンスを確保するサービス。\n【コンテンツフィルタリング】暴力・ヘイト・性的コンテンツ等のブロック\n【トピック拒否】特定トピックへの回答を禁止（例：競合他社への言及）\n【PIIマスキング】個人情報（名前・住所・電話番号等）を自動で「[NAME]」に置換\n【グラウンディング】ハルシネーション検出・根拠なし回答のブロック',
      },
      {
        term: 'Agents for Bedrock（AIエージェント）',
        definition: 'LLMが複数ステップのタスクを自律的に計画・実行するサービス。\n【仕組み】① ユーザーの指示を受ける → ② LLMがステップを計画 → ③ 定義されたアクション（APIコール・DBクエリ）を順次実行 → ④ 結果を統合して回答\n【アクショングループ】Lambda関数やOpenAPI定義で呼び出せるツールを登録\n用途：顧客対応の自動化・複雑なデータ取得・ワークフロー自動化',
      },
      {
        term: '推論パラメータ（Temperature / Top-p / Top-k）',
        definition: '【Temperature（0〜1）】出力のランダム性。0＝最確率の単語を選択（確実・単調）、1＝ランダム（創造的・不安定）\n　→ コード生成・事実回答は低め（0.1〜0.3）、アイデア出し・物語は高め（0.7〜0.9）\n【Top-p（Nucleus Sampling）】確率上位p%の単語候補から選択\n【Top-k】確率上位k個の単語候補から選択\n【Max Tokens】出力の最大長を制御',
      },
    ],
    outro: [
      { speaker: 'sato', text: 'Knowledge Base・Guardrails・Agentsの組み合わせで要件が満たせそうです。開発を進めましょう' },
      { speaker: 'tanaka', text: 'Bedrockの全機能——モデル選択・RAG・ガードレール・エージェント・推論パラメータ、完全に理解しました！' },
      { speaker: 'you', text: '実際に動くシステムが形になってきた実感があります！' },
      { speaker: 'suzuki', text: '（涙ぐみそうになりながら）ワシの指導が…まあ良かった。次は審査があるんだろう、任せろ' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '田村です。RAGシステムの実装に入りたいと思います。Amazon Bedrockを使う予定ですが、何から始めますか？' },
        { speaker: 'tanaka', text: 'まずBedrockのモデルカタログからモデルを選びます。Claude（テキスト生成・推論）・Amazon Titan（汎用）・Llama（オープンソース）・Stable Diffusion（画像生成）等があります' },
        { speaker: 'you', text: '自社の用途でモデルを選べるんですね。RAGの実装は？' },
        { speaker: 'tanaka', text: '「Bedrock Knowledge Base」が便利です。S3に社内ドキュメントを置くだけで、自動的にベクター化してRAGシステムを作れます' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '不適切な回答を返さないようにする仕組みはありますか？' },
        { speaker: 'tanaka', text: '「Bedrock Guardrails」で制御できます。特定のトピックを禁止したり、個人情報（PII）を自動マスクしたり、有害コンテンツをフィルタリングできます' },
        { speaker: 'suzuki', text: '「ガードレール」！ワシが長年安全第一を主張してきたのはそういうことだ' },
        { speaker: 'you', text: '競合他社の話題が出たときに回答を拒否させることもできますか？' },
        { speaker: 'tanaka', text: 'できます。それが「トピック拒否」機能です。「競合他社について話しないで」というルールを設定できます' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'Amazon Bedrockのモデルカタログ',
        definition: 'APIで利用できる基盤モデルのラインナップ。サーバー管理不要・APIキーで即利用可能。\n\n【Anthropic Claude】テキスト生成・複雑な推論・長文理解（最大200K tokens）\n【Amazon Titan】汎用テキスト生成・エンベディング生成\n【Meta Llama】オープンソース。カスタマイズ自由度が高い\n【Stability AI Stable Diffusion】画像生成\n【Mistral AI】高速・コスト効率重視',
        examTip: 'Bedrockはモデルを「所有」するのではなく「APIで利用」するサービス。Claudeはテキスト、Stable Diffusionは画像生成という使い分けを覚える。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'Bedrock Knowledge Baseの仕組みを教えてください' },
        { speaker: 'tanaka', text: 'S3にドキュメントを置くと自動でエンベディング変換→ベクターDBに格納されます。質問が来ると類似文書を検索してLLMに渡して回答生成します。エンベディングもベクターDBもフルマネージドです' },
        { speaker: 'you', text: '複数ステップの作業を自動化したい場合は？例えば「問い合わせ確認→在庫調査→メール返信」という一連の流れ' },
        { speaker: 'tanaka', text: '「Agents for Bedrock」がそれを実現します。LLMがタスクを計画し、定義したツール（API・データベース）を順番に呼び出して完遂します' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'Bedrock Knowledge Base / Guardrails',
        definition: '【Bedrock Knowledge Base】フルマネージドRASサービス\n・S3ドキュメント→自動エンベディング→ベクターDB→質問時に検索→LLMで回答\n・対応ベクターDB：OpenSearch Serverless・Pinecone・Aurora（pgvector）等\n\n【Bedrock Guardrails】LLMの入出力を制御して安全性を確保\n・コンテンツフィルタ：暴力・ヘイト等のブロック\n・トピック拒否：特定トピックへの回答を禁止\n・PIIマスキング：個人情報を「[NAME]」等に自動置換',
        examTip: 'Knowledge Base＝RAGのマネージド実装。Guardrails＝安全フィルター。「ハルシネーション対策→RAG」「有害コンテンツ対策→Guardrails」で区別する。',
      },
      /* Scene 06 */
      { type: 'quiz', question: 'Bedrock上のチャットボットで「ユーザーの氏名・住所が含まれる回答を自動マスクしたい」要件を実現するサービスはどれですか？',
        options: ['Bedrock Knowledge Base', 'Bedrock Guardrails', 'Agents for Bedrock', 'Amazon Macie'],
        answer: 1,
        explanation: '正解はB（Bedrock Guardrails）。GuardrailsのPIIマスキング機能で個人情報を「[NAME]」「[ADDRESS]」等に自動置換できます。Knowledge BaseはRAG、Agentsはマルチステップ自動化、MacieはS3内のPII検出です。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'Agents for Bedrock / 推論パラメータ',
        definition: '【Agents for Bedrock】LLMが複数ステップのタスクを自律的に計画・実行\n・ユーザー指示→LLMが計画→アクション（Lambda/API）を順次実行→結果統合して回答\n・用途：顧客対応自動化・複雑なデータ取得・ワークフロー自動化\n\n【推論パラメータ】\n・Temperature（0〜1）：低=確実・高=創造的\n・Top-p：確率上位p%の候補から選択\n・Max Tokens：出力の最大長',
        examTip: 'Temperature低め（0.1〜0.3）→コード生成・事実回答。Temperature高め（0.7〜0.9）→アイデア出し・創作。試験では「コード生成に適したTemperature」という問題が出る。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '推論パラメータの「Temperature」と「Top-p」の違いを教えていただけますか？' },
        { speaker: 'tanaka', text: 'Temperatureは出力の「ランダム性」を制御します。0に近いほど確実な答え、高いほど創造的。Top-pは確率上位p%の単語候補のみ使用します' },
        { speaker: 'you', text: '大木製造の不良品判定AIならTemperatureは低めにすべきですか？' },
        { speaker: 'tanaka', text: 'はい。「傷あり/なし」という事実判断なので Temperature は 0.1〜0.2 が適切です。創作的な文章生成なら 0.7〜0.9 に上げます' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: 'Bedrock上で「製品の不良有無を事実ベースで判定する」AIシステムに最適なTemperature設定はどれですか？',
        options: ['Temperature = 0.9（高ランダム）', 'Temperature = 0.5（中間）', 'Temperature = 0.1（低ランダム）', 'Temperatureは画像認識に関係ない'],
        answer: 2,
        explanation: '正解はC（0.1）。事実ベースの判定・分類タスクはTemperatureを低くして「最も確率が高い（＝確実な）」回答を選ばせる。Temperature高=創造的だが不確実。画像そのものはRekognitionで処理し、LLMはテキスト説明生成に使う場合の設定です。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'モデルカタログ・Knowledge Base・Guardrails・Agents・推論パラメータ——Bedrockの全機能が整理できました！' },
        { speaker: 'tanaka', text: '完璧です。Bedrockを使えば「モデル選択→RAG構築→安全フィルター→エージェント化」まで一貫して構築できます' },
        { speaker: 'sato', text: 'Knowledge Base・Guardrails・Agentsの組み合わせで要件が満たせそうです。開発を進めましょう' },
        { speaker: 'tanaka', text: '次は難関の「AIセキュリティとガバナンス」審査に挑みます！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 12: AIセキュリティとガバナンス（第12章）
  ───────────────────────────────────── */
  {
    id: 'mission-12',
    number: 12,
    title: '難関セキュリティ審査を突破せよ！',
    subtitle: '責任あるAI・コンプライアンス・Macie',
    category: 'ethics',
    difficulty: 'hard',
    questionCount: 3,
    badge: { icon: '🛡️', label: 'AIガバナンス担当', color: '#f43f5e' },
    audioUrl: 'https://drive.google.com/file/d/1YwwobAW_DSRJS6FJ31C_eeg8Ow7vLjS6/preview',
    intro: [
      { speaker: 'sato', text: '田村です。大木製造の情報セキュリティ部門から監査が入ります。AIシステムの倫理・安全性・コンプライアンスを証明する必要があります' },
      { speaker: 'suzuki', text: '（声のトーンが上がる）任せてください！ワシが直接対応しま——横田、頼む' },
      { speaker: 'tanaka', text: '監査の核心は「責任あるAI（Responsible AI）」の8つの次元です。公平性・透明性・説明可能性・プライバシー・堅牢性・安全性・制御性・持続可能性' },
      { speaker: 'you', text: 'AIバイアスについて詳しく聞かれそうです' },
      { speaker: 'tanaka', text: 'バイアスの原因はほぼ「学習データの偏り」です。特定の人種・性別・年齢が過少代表されていると、モデルが不公平な判断をします。Amazonが2018年に廃止した採用AIが教訓的な事例です' },
      { speaker: 'you', text: 'バイアスの検出にはどのAWSサービスを使いますか？' },
      { speaker: 'tanaka', text: '「Amazon SageMaker Clarify」です。バイアス検出と「なぜその判断をしたか」を説明するSHAP値の計算ができます。これが「説明可能なAI（XAI）」の実装です' },
      { speaker: 'sato', text: '個人情報の扱いはどう証明しますか？' },
      { speaker: 'tanaka', text: '「Amazon Macie」がS3内の個人情報（氏名・住所・クレカ番号等）を機械学習で自動検出して報告します。さらに「AWS Audit Manager」でコンプライアンス証拠を自動収集できます' },
      { speaker: 'you', text: 'AWSの責任共有モデルの観点からは？' },
      { speaker: 'tanaka', text: 'AWSが「クラウドのセキュリティ（物理インフラ）」を担保し、我々が「クラウドでのセキュリティ（IAM設定・データ暗号化・アプリのセキュリティ）」を担保します' },
      { speaker: 'suzuki', text: '「Human in the Loop」も入れておけ。ワシがチェックする仕組みだ。最終判断はワシが下す' },
      { speaker: 'tanaka', text: '実は「Human in the Loop」は非常に重要な概念です。AIが自動判断するだけでなく、重要な決定に人間が関与するプロセスです——特に採用・審査・医療などでは必須です' },
    ],
    concepts: [
      {
        term: '責任あるAI（Responsible AI）8つの次元',
        definition: '① 公平性：特定グループへの差別なく平等に機能すること\n② 透明性：どのようなデータで学習したかを公開\n③ 説明可能性：なぜそう判断したかを説明できる（XAI・SHAP値）\n④ プライバシー：個人情報の適切な取扱い・匿名化\n⑤ 堅牢性：攻撃・異常データへの耐性\n⑥ 安全性：物理的・社会的に害を与えない設計\n⑦ 制御性：Human in the Loopで人間が最終判断に関与\n⑧ 持続可能性：環境負荷を考慮したAI運用',
      },
      {
        term: 'AIバイアスと公平性',
        definition: '【AIバイアスの原因】学習データの偏り（特定の属性が過少・過剰に代表）。ラベル付け者の偏見がモデルに伝播。\n【種類】統計的バイアス（サンプリング偏り）/ 社会的バイアス（性差別・人種差別の再現）\n【具体例】Amazon採用AI（2018年廃止）：男性エンジニアの履歴書で学習→女性を不当に低評価\n【対策】多様な学習データ収集・定期的なバイアス監査・SageMaker Clarifyで検出',
      },
      {
        term: 'SageMaker Clarify（バイアス検出・説明可能AI）',
        definition: '【バイアス検出】学習前・学習後にデータとモデルのバイアスを定量評価。公平性メトリクス（DI・DPPL等）を算出\n【モデル説明可能性】SHAP（SHapley Additive exPlanations）値で「各特徴量が予測にどれだけ影響したか」を数値化\n用途：ローン審査・採用・医療診断AIの公平性証明・規制対応\nSageMaker Model Monitorと連携して本番環境の継続バイアス監視も可能',
      },
      {
        term: 'Amazon Macie / AWS Audit Manager',
        definition: '【Amazon Macie】S3バケット内の機密データを機械学習で自動検出・分類。氏名・住所・クレジットカード・パスポート番号等のPIIを特定。GDPRやHIPAAのコンプライアンス対応に使用\n【AWS Audit Manager】AWSの利用状況からコンプライアンス証拠を自動収集・レポート化。PCI DSS・ISO 27001・SOC 2等のフレームワークに対応。手動での証拠収集が不要になる',
      },
      {
        term: 'AI規制とガバナンスフレームワーク',
        definition: '【EU AI Act（欧州AI法）】世界初の包括的AI規制。リスクレベル（容認不可・高・限定・最小）で義務を分類。高リスクAI（採用・信用評価・医療）は厳格な要件\n【NIST AI RMF】米国標準技術研究所のAIリスク管理フレームワーク。Govern・Map・Measure・Manageの4機能\n【Human in the Loop】重要な自動判断に人間が関与するプロセス。AIと人間の協働で品質・倫理を担保',
      },
    ],
    outro: [
      { speaker: 'sato', text: '（後日）監査に合格しました。Clarify・Macie・Audit Managerの証拠が決め手でした' },
      { speaker: 'tanaka', text: '責任あるAI8次元・バイアス対策・コンプライアンス——難関審査を乗り越えました！' },
      { speaker: 'you', text: 'AIは作るだけでなく「正しく使う」ことがいかに重要か、身に染みました' },
      { speaker: 'suzuki', text: '（胸を張って）もちろん！ワシが倫理を重視しろと指示してきた結果だ！田村さんに合格報告してくる！！' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '田村です。大木製造の情報セキュリティ部門から監査が入ります。AIシステムの倫理・安全性・コンプライアンスを証明する必要があります' },
        { speaker: 'suzuki', text: '（声のトーンが上がる）任せてください！ワシが直接対応しま——横田、頼む' },
        { speaker: 'tanaka', text: '監査の核心は「責任あるAI（Responsible AI）」の8つの次元です。公平性・透明性・説明可能性・プライバシー・堅牢性・安全性・制御性・持続可能性' },
        { speaker: 'you', text: 'AIバイアスについて詳しく聞かれそうです' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: 'バイアスの原因はほぼ「学習データの偏り」です。特定の人種・性別・年齢が過少代表されていると、モデルが不公平な判断をします' },
        { speaker: 'you', text: '具体的な事例はありますか？' },
        { speaker: 'tanaka', text: 'Amazonが2018年に廃止した採用AIが有名です。男性エンジニアの履歴書で学習したため、女性を不当に低評価してしまいました。バイアスは必ず証明可能な形で対処する必要があります' },
        { speaker: 'suzuki', text: '（小声で）ワシの採用判断も…いや、それは別の話だ' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: '責任あるAI（Responsible AI）8つの次元',
        definition: '① 公平性：特定グループへの差別なく平等に機能すること\n② 透明性：どのようなデータで学習したかを公開\n③ 説明可能性：なぜそう判断したかを説明できる（XAI・SHAP値）\n④ プライバシー：個人情報の適切な取扱い・匿名化\n⑤ 堅牢性：攻撃・異常データへの耐性\n⑥ 安全性：物理的・社会的に害を与えない設計\n⑦ 制御性：Human in the Loopで人間が最終判断に関与\n⑧ 持続可能性：環境負荷を考慮したAI運用',
        examTip: '8次元の全名称を覚える。「説明可能性（Explainability）」と「透明性（Transparency）」の違いに注意：透明性は学習データの公開、説明可能性はなぜその判断をしたかの説明。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'バイアスの検出にはどのAWSサービスを使いますか？' },
        { speaker: 'tanaka', text: '「Amazon SageMaker Clarify」です。バイアス検出と「なぜその判断をしたか」を説明するSHAP値の計算ができます。これが「説明可能なAI（XAI）」の実装です' },
        { speaker: 'you', text: 'SHAP値とは何ですか？' },
        { speaker: 'tanaka', text: '各特徴量が予測にどれだけ影響したかを数値化したものです。「このローン審査で不承認になったのは、年収より勤務年数が主な要因でした」と説明できるようになります' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'SageMaker Clarify / AIバイアスと公平性',
        definition: '【SageMaker Clarify】バイアス検出・説明可能AI\n・バイアス検出：学習前・学習後のデータとモデルのバイアスを定量評価\n・SHAP値：各特徴量が予測に与えた影響を数値化（XAI）\n・本番監視：Model Monitorと連携してリアルタイムのバイアスを継続監視\n\n【AIバイアス原因】学習データの偏り（過少代表・過剰代表）\n【事例】Amazon採用AI（2018年廃止）：男性優遇バイアス',
        examTip: 'Clarify＝バイアス検出＋SHAP値（XAI）の両方を担う。「なぜその判断？→SHAP値→Clarify」の連想で選ぶ。',
      },
      /* Scene 06 */
      { type: 'quiz', question: 'ローン審査AIで「なぜ却下されたか」を顧客に説明するため、各特徴量の影響度を数値化したい。使用するサービスとアプローチは？',
        options: ['Amazon Rekognition カスタムラベル', 'SageMaker Clarify（SHAP値）', 'Amazon Macie（PII検出）', 'Bedrock Guardrails'],
        answer: 1,
        explanation: '正解はB（Clarify + SHAP値）。SHAP値は各特徴量が予測に与えた影響度を定量化し、「年収が最も影響した」「勤務年数が次」と説明可能にします。これが説明可能なAI（XAI）の実装方法です。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'Amazon Macie / AWS Audit Manager',
        definition: '【Amazon Macie】S3バケット内の機密データを機械学習で自動検出・分類。氏名・住所・クレジットカード・パスポート等のPIIを特定。GDPRやHIPAAのコンプライアンス対応\n\n【AWS Audit Manager】AWSの利用状況からコンプライアンス証拠を自動収集・レポート化。PCI DSS・ISO 27001・SOC 2等のフレームワークに対応。手動での証拠収集が不要',
        examTip: 'Macie＝S3のPII自動検出（データ保護）。Audit Manager＝コンプライアンス証拠の自動収集（監査対応）。どちらも「自動化」がキーワード。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '個人情報の扱いはどう証明しますか？' },
        { speaker: 'tanaka', text: '「Amazon Macie」がS3内の個人情報を機械学習で自動検出します。「AWS Audit Manager」でコンプライアンス証拠を自動収集してレポート化できます' },
        { speaker: 'suzuki', text: '「Human in the Loop」も入れておけ。ワシがチェックする仕組みだ。最終判断はワシが下す' },
        { speaker: 'tanaka', text: '実は「Human in the Loop」は重要な概念です。AIが自動判断するだけでなく、重要な決定に人間が関与するプロセスです——採用・審査・医療では特に必須です' },
        { speaker: 'suzuki', text: '（胸を張って）やっぱりワシが必要だったか！！' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: 'EU AI法（AI Act）で「高リスクAI」に分類される用途として正しいのはどれですか？',
        options: ['音楽プレイリストの推薦', '採用選考・雇用評価のAI', 'ゲームNPCのAI', 'スパムメールフィルタ'],
        answer: 1,
        explanation: '正解はB（採用選考AI）。EU AI Actでは採用・信用評価・医療診断・重要インフラ管理などを「高リスクAI」に分類し、厳格な透明性・説明可能性・人間の監視要件を課します。音楽推薦・ゲームAI・スパムフィルタは最小リスクカテゴリです。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '（後日）監査に合格しました。Clarify・Macie・Audit Managerの証拠が決め手でした' },
        { speaker: 'tanaka', text: '責任あるAI8次元・バイアス対策・コンプライアンス——難関審査を乗り越えました！' },
        { speaker: 'you', text: 'AIは作るだけでなく「正しく使う」ことがいかに重要か、身に染みました' },
        { speaker: 'suzuki', text: '（胸を張って）もちろん！ワシが倫理を重視しろと指示してきた結果だ！次はモニタリングだ、準備せよ！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission 13: モニタリング（第13章）
  ───────────────────────────────────── */
  {
    id: 'mission-13',
    number: 13,
    title: 'プロダクションを守り抜け！',
    subtitle: 'CloudWatch・CloudTrail・Model Monitor',
    category: 'practice',
    difficulty: 'hard',
    questionCount: 3,
    badge: { icon: '📡', label: 'モニタリングマスター', color: '#10b981' },
    audioUrl: 'https://drive.google.com/file/d/1CbanjYLt34vmwtDx6ItQFJ5BywODrx-f/preview',
    intro: [
      { speaker: 'tanaka', text: 'いよいよ本番稼働です！おめでとうございます。でも本番は「作って終わり」ではないですよ' },
      { speaker: 'you', text: '本番後に何が必要なんですか？' },
      { speaker: 'tanaka', text: 'モニタリングです。システムが正常か・コストが適正か・AIモデルの精度が劣化していないかを常に監視します' },
      { speaker: 'suzuki', text: '（緊張した様子で）そういえば…昨夜システムが遅くなったという報告があったが、何か問題か？' },
      { speaker: 'tanaka', text: '「Amazon CloudWatch」でメトリクスを確認します。CPU使用率・メモリ・レイテンシなどのリソース状況をリアルタイムで監視し、しきい値超過でアラームを発報できます' },
      { speaker: 'you', text: '昨夜どこかで大量リクエストが来たのかもしれません。「CloudWatch Logs」でアプリのエラーログを見てみましょう' },
      { speaker: 'tanaka', text: '「誰がいつ何をしたか」という操作ログは「AWS CloudTrail」です。AWSへの全APIコール（誰がいつどこからS3にアクセスしたか等）を自動で記録・監査できます' },
      { speaker: 'suzuki', text: '（ぎょっとする）すべてが記録されているのか…！ワシが昨夜AWSのコンソールを…あー、あーあー、いや問題ない' },
      { speaker: 'you', text: 'AIモデル自体の精度が落ちた場合はどう検知するんですか？' },
      { speaker: 'tanaka', text: '「SageMaker Model Monitor」です。本番の入力データが学習時データと乖離していないか（データドリフト）、モデルの精度が低下していないかを自動で継続監視します' },
      { speaker: 'you', text: '季節変動で製品のデザインが変わると、工場の不良品検知モデルが劣化しそうですね' },
      { speaker: 'tanaka', text: '正確な観察です。「SageMaker Clarify」で本番でもバイアスを継続監視できます。さらに「AWS Config」でAWSリソースの設定変更を追跡して、意図しない設定変更を検知できます' },
    ],
    concepts: [
      {
        term: 'Amazon CloudWatch（インフラ監視）',
        definition: 'AWSリソースとアプリケーションの監視サービス。\n【メトリクス】CPU使用率・メモリ・ネットワーク・レイテンシ等の時系列データ\n【アラーム】メトリクスがしきい値を超えたらSNSで通知・Auto Scalingをトリガー\n【ログ】アプリケーションのエラーログ・アクセスログを収集・検索（CloudWatch Logs）\n【ダッシュボード】複数メトリクスをまとめて可視化',
      },
      {
        term: 'AWS CloudTrail（操作監査ログ）',
        definition: 'AWSアカウント内の全APIコールを記録する監査サービス。\n【記録内容】誰が（IAMユーザー/ロール）・いつ・どこから・何のAPIを呼んだか\n【用途】セキュリティインシデント調査・コンプライアンス監査・変更管理\n【デフォルト】90日間のイベント履歴を自動保存（S3への長期保存は別途設定）\nCloudWatchはリソースの「状態」を監視、CloudTrailは「操作」を記録——役割の違いを覚える',
      },
      {
        term: 'SageMaker Model Monitor（モデル品質監視）',
        definition: '本番稼働中のMLモデルを継続的に監視するサービス。\n【データドリフト監視】本番の入力データの分布が学習時と乖離していないか検出。工場の製品変更・季節変動でモデルが劣化するリスクを早期発見\n【モデル品質監視】予測精度の継続的な追跡\n【バイアスドリフト】SageMaker Clarifyと連携して本番でのバイアスを継続監視\nアラートを設定して自動再学習パイプラインをトリガー可能',
      },
      {
        term: 'AWS Config（リソース設定管理）',
        definition: 'AWSリソースの設定を継続的に記録・評価するサービス。\n【設定変更追跡】「誰かがS3バケットをパブリックに変更した」「セキュリティグループが変更された」を検知\n【コンプライアンスルール】「S3の暗号化が有効か」「IAMにMFAが設定されているか」を自動チェック\n【タイムライン】リソースの設定変更の歴史を可視化\nCloudTrailは「操作ログ」、Configは「設定の状態と変化」を管理',
      },
      {
        term: 'MLシステムのモニタリング全体像',
        definition: '本番MLシステムでは複数レイヤーを同時監視する必要がある。\n【インフラ】CloudWatch：CPU/メモリ/レイテンシ/エラー率\n【セキュリティ操作】CloudTrail：誰が何をしたか\n【設定変更】AWS Config：リソース設定の意図しない変化\n【モデル品質】Model Monitor：データドリフト・精度劣化\n【バイアス】SageMaker Clarify：公平性の継続監視\n劣化を検知したら自動再学習パイプライン（SageMaker Pipelines）でモデルを更新',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: 'CloudWatch・CloudTrail・Model Monitor・Config——本番システムを守るモニタリング体制が完成しました！' },
      { speaker: 'you', text: '「作って終わり」ではなく「運用してなんぼ」なんですね' },
      { speaker: 'sato', text: '（連絡が来る）田村です。システムが安定稼働しています。現場の作業員からも好評です。ありがとうございました' },
      { speaker: 'suzuki', text: '（目が潤んでいる）よ、よしよし……ワシの指導の賜物だな。誰も泣いていないぞ、断じて' },
      { speaker: 'tanaka', text: '全13章を制覇しました！次はいよいよAIF-C01試験本番です！！' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: 'いよいよ本番稼働です！おめでとうございます。でも本番は「作って終わり」ではないですよ' },
        { speaker: 'you', text: '本番後に何が必要なんですか？' },
        { speaker: 'tanaka', text: 'モニタリングです。システムが正常か・コストが適正か・AIモデルの精度が劣化していないかを常に監視します' },
        { speaker: 'suzuki', text: '（緊張した様子で）そういえば…昨夜システムが遅くなったという報告があったが、何か問題か？' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '「Amazon CloudWatch」でメトリクスを確認します。CPU使用率・メモリ・レイテンシなどをリアルタイムで監視し、しきい値超過でアラームを発報できます' },
        { speaker: 'you', text: '昨夜どこかで大量リクエストが来たのかもしれません。「CloudWatch Logs」でエラーログを見てみましょう' },
        { speaker: 'tanaka', text: '「誰がいつ何をしたか」という操作ログは「AWS CloudTrail」です。全APIコールを自動記録・監査できます' },
        { speaker: 'suzuki', text: '（ぎょっとする）すべてが記録されているのか…！ワシが昨夜AWSのコンソールを…あー、あーあー、いや問題ない' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: 'Amazon CloudWatch（インフラ監視）',
        definition: 'AWSリソースとアプリケーションの監視サービス。\n【メトリクス】CPU使用率・メモリ・ネットワーク・レイテンシの時系列データ\n【アラーム】しきい値超過でSNS通知・Auto Scalingをトリガー\n【ログ】アプリのエラーログ・アクセスログを収集・検索（CloudWatch Logs）\n【ダッシュボード】複数メトリクスをまとめて可視化',
        examTip: 'CloudWatchはリソースの「状態（State）」を監視。CloudTrailは「操作（Action）」を記録。この役割の違いが最頻出。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'AIモデル自体の精度が落ちた場合はどう検知するんですか？' },
        { speaker: 'tanaka', text: '「SageMaker Model Monitor」です。本番の入力データが学習時データと乖離していないか（データドリフト）、モデルの精度が低下していないかを自動で継続監視します' },
        { speaker: 'you', text: '季節変動で製品のデザインが変わると、不良品検知モデルが劣化しそうですね' },
        { speaker: 'tanaka', text: '正確な観察です！それが「データドリフト」です。Model Monitorが検知したら自動再学習パイプラインをトリガーできます' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'AWS CloudTrail（操作監査ログ）',
        definition: 'AWSアカウント内の全APIコールを記録する監査サービス。\n【記録内容】誰が（IAMユーザー/ロール）・いつ・どこから・何のAPIを呼んだか\n【用途】セキュリティインシデント調査・コンプライアンス監査・変更管理\n【保存】デフォルト90日間のイベント履歴（S3への長期保存は別途設定）\n\nCloudWatch＝リソースの「状態」、CloudTrail＝「操作」を記録',
        examTip: '「不審なアクセスがあった→誰がいつ操作したか→CloudTrail」。「レイテンシが上がった→システム状態の確認→CloudWatch」。',
      },
      /* Scene 06 */
      { type: 'quiz', question: 'AWSアカウントで「誰かが本番S3バケットのオブジェクトを削除した」という操作を調査するサービスはどれですか？',
        options: ['Amazon CloudWatch', 'AWS CloudTrail', 'SageMaker Model Monitor', 'AWS Config'],
        answer: 1,
        explanation: '正解はB（CloudTrail）。CloudTrailは「誰が・いつ・何のAPIを呼んだか」を記録する操作監査ログです。S3の削除操作（DeleteObject API）の実行者・日時・送信元IPを特定できます。CloudWatchはリソース状態監視、Model MonitorはMLモデル品質監視です。',
      },
      /* Scene 07 */
      { type: 'concept', term: 'SageMaker Model Monitor / AWS Config',
        definition: '【SageMaker Model Monitor】本番MLモデルを継続監視\n・データドリフト：本番入力データの分布が学習時と乖離→早期発見\n・モデル品質：予測精度の継続追跡\n・バイアスドリフト：Clarifyと連携して本番のバイアスを監視\n\n【AWS Config】AWSリソースの設定変更を継続記録・評価\n・「S3バケットがパブリックになった」「セキュリティグループが変更された」を検知\n・コンプライアンスルールの自動チェック',
        examTip: 'Model Monitor＝MLモデルの品質劣化を検知（データドリフト）。Config＝インフラ設定の変更を検知。「モデルの精度低下→Model Monitor」「設定変更→Config」。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: 'さらに「AWS Config」でAWSリソースの設定変更を追跡します。「S3バケットのアクセス制御が変更された」「セキュリティグループが意図せず変更された」を即座に検知できます' },
        { speaker: 'you', text: 'CloudWatchはリソース状態、CloudTrailは操作履歴、Model Monitorはモデル品質、ConfigはAWSリソース設定——4つが連携して守るんですね' },
        { speaker: 'sato', text: '（連絡が来る）田村です。システムが安定稼働しています。現場の作業員からも好評です。ありがとうございました' },
        { speaker: 'suzuki', text: '（目が潤んでいる）よ、よしよし……ワシの指導の賜物だな。誰も泣いていないぞ、断じて' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: '大木製造の不良品検知AIが「夏季の新デザイン製品」に対して精度が下がり始めた。これを自動検知するサービスはどれですか？',
        options: ['Amazon CloudWatch（メトリクス監視）', 'AWS CloudTrail（操作ログ）', 'SageMaker Model Monitor（データドリフト検知）', 'AWS Config（設定変更追跡）'],
        answer: 2,
        explanation: '正解はC（Model Monitor）。新デザイン製品→入力画像の分布が学習時と乖離（データドリフト）→Model Monitorが検知してアラート。CloudWatchはCPU等のインフラ監視、CloudTrailは操作ログ、ConfigはAWS設定変更の追跡です。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: 'CloudWatch・CloudTrail・Model Monitor・Config——4つの監視ツールの役割が明確になりました！' },
        { speaker: 'tanaka', text: '「作って終わり」ではなく「運用してなんぼ」。本番MLシステムを守るモニタリング体制が完成しました！' },
        { speaker: 'you', text: '全13章を走り切りました。最初は「AIのAの字もわからない」だったのに…' },
        { speaker: 'tanaka', text: '全13章を制覇しました！次はいよいよAIF-C01試験本番です！！' },
      ]},
    ],
  },

  /* ─────────────────────────────────────
     Mission FINAL: AIF-C01 総合試験
  ───────────────────────────────────── */
  {
    id: 'mission-final',
    number: 14,
    title: 'AIF-C01 認定試験本番！',
    subtitle: '全知識を結集して一発合格を掴め',
    category: 'mixed',
    difficulty: 'mixed',
    questionCount: 5,
    badge: { icon: '🏆', label: 'AWS AI認定者', color: '#fbbf24' },
    intro: [
      { speaker: 'tanaka', text: '試験前日です。全13ミッションを完走した力は本物です。最後に試験のポイントを整理しましょう' },
      { speaker: 'you', text: '5つのドメインとその配点をもう一度確認したいです' },
      { speaker: 'tanaka', text: '① 基盤モデルの応用・生成AI（28%）② 生成AIの基礎（24%）③ AI・ML基礎（20%）④ 責任あるAI（14%）⑤ AIセキュリティ（14%）。合計100%、合格ラインは700点/1000点（70%）です' },
      { speaker: 'suzuki', text: '（珍しく真剣な顔で）○○、今まで散々言ってきたが…お前の成長は本物だ。今日だけは認めてやる' },
      { speaker: 'you', text: '（部長が…？）あ、ありがとうございます！' },
      { speaker: 'tanaka', text: '試験でよく出るサービスの使い分けを確認します。入力→出力の形式で覚えてください。画像→分析：Rekognition、文書→テキスト：Textract、音声→テキスト：Transcribe、テキスト→音声：Polly、テキスト→感情分析：Comprehend' },
      { speaker: 'you', text: '生成AI系は？' },
      { speaker: 'tanaka', text: 'BedrockはAPIで基盤モデルを使う・RAG（Knowledge Base）・ガードレール・Agents。Amazon Qはエンドユーザー向けAIアシスタント（Q Business・Q Developer）。SageMakerはMLパイプライン全体を管理する基盤です' },
      { speaker: 'you', text: '責任あるAIとセキュリティの合計28%は要注意ですね' },
      { speaker: 'tanaka', text: '責任あるAIは公平性・透明性・説明可能性の3つが特に頻出。Clarifyでバイアス検出とSHAP値。セキュリティは責任共有モデル（AWSが守る/ユーザーが守る）とIAM最小権限が最重要です' },
      { speaker: 'sato', text: '（メッセージが届く）田村です。○○さんが試験に挑戦されると伺いました。これまでのご説明はいつもわかりやすかった。実力は十分です。応援しています' },
      { speaker: 'you', text: '田村さんから！ありがとうございます！' },
      { speaker: 'tanaka', text: '○○さん、全ミッションをクリアした実力があります。自信を持って行ってらっしゃい！' },
    ],
    concepts: [
      {
        term: '試験ドメインと配点（5領域）',
        definition: '① 基盤モデルの応用・生成AI  ██████████  28%  ← 最重要\n② 生成AIの基礎             ████████    24%\n③ AI・ML基礎               ██████      20%\n④ 責任あるAI               ████        14%\n⑤ AIセキュリティ            ████        14%\n────────────────────────────\n合格ライン：700 / 1000点（70%）\n問題数：85問（スコア対象65問+プレテスト20問）',
        diagram: '試験ドメインと配点\n────────────────────────────\n基盤モデル応用・生成AI ██████████ 28%\n生成AIの基礎          ████████   24%\nAI・ML基礎            ██████     20%\n責任あるAI            ████       14%\nAIセキュリティ         ████       14%\n────────────────────────────\n合格ライン：700 / 1000点（70%）',
      },
      {
        term: 'AWSサービス使い分けマップ',
        definition: '【入力→出力で覚える】\n画像/動画 → 分析：Amazon Rekognition\n文書/PDF → テキスト：Amazon Textract\n音声 → テキスト：Amazon Transcribe\nテキスト → 音声：Amazon Polly\nテキスト → 感情/エンティティ：Amazon Comprehend\nテキスト → 生成/回答：Amazon Bedrock（Claude等）\n社内ドキュメント → 検索Q&A：Amazon Kendra / Q Business\n推薦・レコメンド → Amazon Personalize',
      },
      {
        term: '生成AI・Bedrock重点（合計52%）',
        definition: '最も出題比率が高い領域を確実に押さえる。\n【LLM/FM】基盤モデル・プロンプトエンジニアリング（Zero/Few/CoT）・ハルシネーション\n【RAG】仕組み（エンベディング・ベクターDB・検索→生成）とハルシネーション対策としての効果\n【Bedrock】モデルカタログ・Knowledge Base・Guardrails・Agents・推論パラメータ（Temperature）\n【ファインチューニング vs RAG vs プロンプト】コスト・適切なシナリオの選択',
      },
      {
        term: '責任あるAI（14%）重点ポイント',
        definition: '8次元：公平性・透明性・説明可能性・プライバシー・堅牢性・安全性・制御性・持続可能性\n【バイアス】原因（学習データの偏り）・事例（Amazon採用AI2018年廃止）・検出（SageMaker Clarify）\n【説明可能性（XAI）】SHAP値でなぜその予測をしたか説明\n【Human in the Loop】重要な判断に人間が関与するプロセス。採用・医療・審査で必須\n【Guardrails】Bedrockのコンテンツフィルタ・PIIマスキング',
      },
      {
        term: 'セキュリティ・ML基礎（34%）重点ポイント',
        definition: '【責任共有モデル】AWSが守る：物理インフラ・ネットワーク。ユーザーが守る：IAM設定・データ暗号化・アプリセキュリティ\n【IAM最小権限】必要最小限の権限のみ付与。ロールを使い、ルートアカウントは使わない\n【AI/ML基礎】教師あり/なし/強化学習・過学習と対策・評価指標（精度/適合率/再現率）\n【SageMaker】Data Wrangler・Ground Truth・4つのデプロイオプション・Model Monitor\n【モニタリング】CloudWatch（状態）・CloudTrail（操作）・Config（設定）の違い',
      },
    ],
    outro: [
      { speaker: 'tanaka', text: '全ミッション制覇、本当におめでとうございます！！全部の知識が繋がりましたね！' },
      { speaker: 'you', text: 'テックブリッジに入社してから、まさかここまで成長できるとは！横田先輩、本当にありがとうございます！' },
      { speaker: 'suzuki', text: '（目が少し潤んでいる）ま、まあ…ワシの指導の賜物だな。感謝してもらって当然だ' },
      { speaker: 'sato', text: '（メッセージが届く）田村です。合格されたんですね。おめでとうございます。次はMLA-C01という上位資格があります。期待しています' },
      { speaker: 'you', text: '田村さんらしい激励だ（笑）よし、次も頑張ります！' },
      { speaker: 'tanaka', text: '本当に良いお客様・良いチームに恵まれました。お疲れ様でした！' },
    ],
    scenes: [
      /* Scene 01 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '試験前日です。全13ミッションを完走した力は本物です。最後に試験のポイントを整理しましょう' },
        { speaker: 'you', text: '5つのドメインと配点をもう一度確認したいです' },
        { speaker: 'tanaka', text: '① 基盤モデルの応用・生成AI（28%）② 生成AIの基礎（24%）③ AI・ML基礎（20%）④ 責任あるAI（14%）⑤ AIセキュリティ（14%）。合格ラインは700点/1000点（70%）です' },
        { speaker: 'suzuki', text: '（珍しく真剣な顔で）○○、今まで散々言ってきたが…お前の成長は本物だ。今日だけは認めてやる' },
        { speaker: 'you', text: '（部長が…？）あ、ありがとうございます！' },
      ]},
      /* Scene 02 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '試験でよく出るサービスの使い分けを確認します。「入力→出力の形式」で覚えてください' },
        { speaker: 'you', text: '画像・音声・テキスト系を整理してください' },
        { speaker: 'tanaka', text: '画像分析：Rekognition、文書テキスト抽出：Textract、音声→テキスト：Transcribe、テキスト→音声：Polly、テキスト感情分析：Comprehend、翻訳：Translate' },
        { speaker: 'you', text: 'TranscribeとPollyを逆に答えそうで怖いです' },
        { speaker: 'tanaka', text: '「Transcribe＝書き起こし（文字に起こす）」「Polly＝おしゃべり（話す）」この語呂で覚えましょう' },
      ]},
      /* Scene 03 */
      { type: 'concept', term: '試験ドメインと配点（5領域）',
        definition: '① 基盤モデルの応用・生成AI  ██████████  28%  ← 最重要\n② 生成AIの基礎             ████████    24%\n③ AI・ML基礎               ██████      20%\n④ 責任あるAI               ████        14%\n⑤ AIセキュリティ            ████        14%\n────────────────────\n合格ライン：700 / 1000点（70%）\n問題数：85問（スコア対象65問＋プレテスト20問）',
        examTip: '生成AI関連（①＋②）だけで52%。Bedrock・RAG・プロンプトエンジニアリング・ハルシネーションを最優先で押さえる。',
      },
      /* Scene 04 */
      { type: 'dialogue', lines: [
        { speaker: 'you', text: '生成AI系は？' },
        { speaker: 'tanaka', text: 'BedrockはAPIで基盤モデルを使う・RAG（Knowledge Base）・ガードレール・Agents。Amazon QはエンドユーザーAIアシスタント（Q Business・Q Developer）。SageMakerはMLパイプライン全体の基盤です' },
        { speaker: 'you', text: '責任あるAIとセキュリティの合計28%は要注意ですね' },
        { speaker: 'tanaka', text: '責任あるAIは公平性・透明性・説明可能性の3つが特に頻出。Clarifyでバイアス検出とSHAP値。セキュリティは責任共有モデルとIAM最小権限が最重要です' },
      ]},
      /* Scene 05 */
      { type: 'concept', term: 'AWSサービス使い分けマップ',
        definition: '【入力→出力で覚える】\n画像/動画 → 分析：Amazon Rekognition\n文書/PDF → テキスト：Amazon Textract\n音声 → テキスト：Amazon Transcribe\nテキスト → 音声：Amazon Polly\nテキスト → 感情/エンティティ：Amazon Comprehend\nテキスト → 生成/回答：Amazon Bedrock（Claude等）\n社内ドキュメント → 検索Q&A：Amazon Q Business\nリアルタイム推薦：Amazon Personalize\nリアルタイムデータ：Amazon Kinesis',
        examTip: 'TranscribeとPollyを逆に覚えるのが最も多い失点ポイント。「Transcribe＝書き起こし」「Polly＝おしゃべり」で確実に区別。',
      },
      /* Scene 06 */
      { type: 'quiz', question: '試験での頻出問題。「工場の音声アナウンスを自動でテキスト化し、多言語に翻訳後、現地語で読み上げたい」。正しいサービスの流れはどれですか？',
        options: ['Polly → Translate → Transcribe', 'Transcribe → Translate → Polly', 'Comprehend → Translate → Rekognition', 'Textract → Comprehend → Polly'],
        answer: 1,
        explanation: '正解はB。Transcribe（音声→テキスト）→ Translate（テキスト翻訳）→ Polly（テキスト→音声）。この3つの組み合わせは試験の定番パターンです。',
      },
      /* Scene 07 */
      { type: 'concept', term: '生成AI・Bedrock重点（合計52%）',
        definition: '最も出題比率が高い領域を確実に押さえる。\n\n【LLM/FM】基盤モデル・プロンプトエンジニアリング（Zero/Few/CoT）・ハルシネーション対策\n【RAG】仕組み（エンベディング→ベクターDB→検索→生成）とハルシネーション対策としての効果\n【Bedrock】モデルカタログ・Knowledge Base・Guardrails・Agents・Temperature\n【手法選択】コスト順：プロンプト → RAG → ファインチューニング',
        examTip: '「最もコストが低い手法→プロンプトエンジニアリング」「最新情報参照→RAG」「スタイル変更→ファインチューニング」の判断問題が必ず出る。',
      },
      /* Scene 08 */
      { type: 'dialogue', lines: [
        { speaker: 'sato', text: '（メッセージが届く）田村です。○○さんが試験に挑戦されると伺いました。これまでのご説明はいつもわかりやすかった。実力は十分です。応援しています' },
        { speaker: 'you', text: '田村さんから！ありがとうございます！' },
        { speaker: 'tanaka', text: '「責任あるAI8次元」「SageMaker Clarify＝バイアス検出＋SHAP値」「CloudWatch＝状態、CloudTrail＝操作」「マルチAZ＝高可用性」——これが最後の確認ポイントです' },
        { speaker: 'you', text: '全部言えます！準備万端です！' },
      ]},
      /* Scene 09 */
      { type: 'quiz', question: '本番直前の総確認。「ユーザーのデータ暗号化はAWSとユーザーどちらの責任か、また採用AIのバイアス検出に使うサービスは何か」——正しい組み合わせはどれですか？',
        options: ['AWSの責任 ／ Amazon Rekognition', 'ユーザーの責任 ／ SageMaker Clarify', 'AWSの責任 ／ SageMaker Clarify', 'ユーザーの責任 ／ Amazon Macie'],
        answer: 1,
        explanation: '正解はB。責任共有モデルでデータ暗号化はユーザー責任（AWSは物理インフラが担当）。採用AIのバイアス検出とSHAP値（説明可能性）はSageMaker Clarifyが担当。MacieはS3内PII検出です。',
      },
      /* Scene 10 */
      { type: 'dialogue', lines: [
        { speaker: 'tanaka', text: '○○さん、全ミッションをクリアした実力があります。自信を持って行ってらっしゃい！' },
        { speaker: 'you', text: 'テックブリッジに入社してから、まさかここまで成長できるとは！横田先輩、本当にありがとうございます！' },
        { speaker: 'suzuki', text: '（目が少し潤んでいる）ま、まあ…ワシの指導の賜物だな。行ってこい！！' },
        { speaker: 'sato', text: '（メッセージが届く）田村です。合格されたんですね。おめでとうございます。次はMLA-C01という上位資格があります。期待しています' },
        { speaker: 'you', text: '田村さんらしい（笑）よし、次も頑張ります！' },
      ]},
    ],
  },
];

/* ===== ミッション用問題の取得 ===== */
export const getMissionQuestions = (mission: Mission) => {
  if (mission.category === 'mixed') {
    const cats: QuestionCategory[] = ['ai-basics', 'ml-fundamentals', 'aws-services', 'ethics', 'practice'];
    return cats.map((cat) => {
      const pool = allQuestions.filter((q) => q.category === cat);
      return pool[Math.floor(pool.length / 2)];
    }).filter(Boolean);
  }

  let pool = allQuestions.filter((q) => q.category === mission.category);
  if (mission.difficulty !== 'mixed') {
    const filtered = pool.filter((q) => q.difficulty === mission.difficulty);
    if (filtered.length >= mission.questionCount) pool = filtered;
  }
  const offset = (mission.number - 1) * mission.questionCount;
  const sliced = pool.slice(offset, offset + mission.questionCount);
  return sliced.length >= mission.questionCount ? sliced : pool.slice(0, mission.questionCount);
};

/* ===== 進捗管理（localStorage） ===== */
const progressKey = (userId: string) => `clf-c02-mission-progress-${userId}`;

export const loadProgress = (userId: string = 'guest'): string[] => {
  try { return JSON.parse(localStorage.getItem(progressKey(userId)) ?? '[]'); } catch { return []; }
};

export const saveProgress = (userId: string = 'guest', completed: string[]): void => {
  localStorage.setItem(progressKey(userId), JSON.stringify(completed));
};

export const isMissionAvailable = (index: number, completed: string[]): boolean => {
  if (index === 0) return true;
  return completed.includes(MISSIONS[index - 1].id);
};
