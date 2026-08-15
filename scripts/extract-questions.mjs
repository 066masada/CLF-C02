#!/usr/bin/env node
/**
 * CLF-C02 問題抽出スクリプト
 *
 * 使い方:
 *   cd scripts && npm install  (初回のみ)
 *   node extract-questions.mjs <画像ファイル1.png> [画像ファイル2.png ...]
 *
 * 例:
 *   node extract-questions.mjs ../screenshots/page01.png ../screenshots/page02.png
 *
 * 出力: TypeScript Question オブジェクトを標準出力に表示
 *       → src/data/clf-c02-questions.ts の適切な位置に貼り付けてください
 *
 * 環境変数:
 *   ANTHROPIC_API_KEY  Claude API キー（必須）
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_FILE = path.resolve(__dirname, '../src/data/clf-c02-questions.ts');

const client = new Anthropic();

// -----------------------------------------------------------------------
// カテゴリとIDプレフィックスの対応
// -----------------------------------------------------------------------
const ID_PREFIX = {
  'cloud-concepts':      'cc',
  'security-compliance': 'sec',
  'cloud-technology':    'tech',
  'billing-support':     'bill',
};

// -----------------------------------------------------------------------
// Claude への指示
// -----------------------------------------------------------------------
const SYSTEM_PROMPT = `あなたはAWS CLF-C02（AWS Certified Cloud Practitioner）試験問題の抽出専門家です。
提供されたスクリーンショットから、試験問題・選択肢・正解・解説を正確に抽出してください。

必ずJSON配列のみを出力してください（コードブロック不要）。

出力スキーマ（Question[]）:
[
  {
    "question": "問題文（完全なテキスト）",
    "options": ["選択肢A本文", "選択肢B本文", "選択肢C本文", "選択肢D本文"],
    "correctAnswer": 0,
    "explanation": "正解の解説文",
    "category": "cloud-concepts | security-compliance | cloud-technology | billing-support",
    "difficulty": "easy | medium | hard",
    "tags": ["キーワード1", "キーワード2"]
  }
]

ルール:
- options は A/B/C/D などの記号を除いたテキストのみを含める
- correctAnswer は 0始まりのインデックス（Aなら0, Bなら1, Cなら2, Dなら3）
- category は問題の内容から最適なものを選ぶ:
    cloud-concepts      → クラウドの価値提案、経済性、主要な設計原則
    security-compliance → 責任共有モデル、IAM、コンプライアンス、セキュリティサービス
    cloud-technology    → AWSのデプロイ方法、グローバルインフラ、コアAWSサービス
    billing-support     → 請求・コスト管理、料金モデル、サポートプラン
- difficulty は easy/medium/hard で主観的に判断
- tags は問題のキーワードを2〜4個（英語推奨）
- スクリーンショットに複数の問題があれば全て抽出すること
- 問題が見つからない場合は空配列 [] を返す`;

// -----------------------------------------------------------------------
// 画像 → Questions 抽出
// -----------------------------------------------------------------------
async function extractFromImage(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');

  const ext = path.extname(imagePath).toLowerCase();
  const mediaType =
    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
    ext === '.webp'                   ? 'image/webp' :
    ext === '.gif'                    ? 'image/gif'  :
                                        'image/png';

  const stream = await client.messages.stream({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: 'このスクリーンショットから問題を全て抽出してください。JSON配列のみ出力してください。',
          },
        ],
      },
    ],
  });

  const message = await stream.finalMessage();

  // text ブロックを結合
  const text = message.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
    .trim();

  // JSON パース（コードブロックが含まれる場合も考慮）
  let raw = text;
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) raw = fenceMatch[1].trim();

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    throw new Error(`JSON解析失敗:\n${e.message}\n\nClaude出力:\n${text}`);
  }
}

// -----------------------------------------------------------------------
// 既存ファイルから ID の最大番号を読み取る
// -----------------------------------------------------------------------
function readExistingMaxIds() {
  const maxIds = {
    'cloud-concepts':      0,
    'security-compliance': 0,
    'cloud-technology':    0,
    'billing-support':     0,
  };

  if (!fs.existsSync(QUESTIONS_FILE)) return maxIds;

  const content = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
  const idPattern = /id:\s*['"]([a-z]+-\d+)['"]/g;

  for (const match of content.matchAll(idPattern)) {
    const id = match[1];
    for (const [cat, prefix] of Object.entries(ID_PREFIX)) {
      if (id.startsWith(prefix + '-')) {
        const num = parseInt(id.slice(prefix.length + 1), 10);
        if (!isNaN(num) && num > maxIds[cat]) maxIds[cat] = num;
      }
    }
  }

  return maxIds;
}

// -----------------------------------------------------------------------
// Question → TypeScript 文字列
// -----------------------------------------------------------------------
function escapeTs(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
}

function questionToTs(q, id) {
  const opts = q.options
    .map(o => `      '${escapeTs(o)}'`)
    .join(',\n');

  const tags = q.tags
    .map(t => `'${escapeTs(t)}'`)
    .join(', ');

  const desc = q.tags[0]
    ? `${q.tags[0]}に関する問題`
    : q.question.slice(0, 30) + '...';

  return `  {
    id: '${id}',
    category: '${q.category}',
    difficulty: '${q.difficulty}',
    question: '${escapeTs(q.question)}',
    description: '${escapeTs(desc)}',
    options: [
${opts},
    ],
    correctAnswer: ${q.correctAnswer},
    explanation: '${escapeTs(q.explanation)}',
    tags: [${tags}],
    verified: true,
  },`;
}

// -----------------------------------------------------------------------
// バリデーション
// -----------------------------------------------------------------------
const VALID_CATEGORIES = new Set(Object.keys(ID_PREFIX));
const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);

function validate(q, index) {
  const errors = [];
  if (!q.question) errors.push('question が空');
  if (!Array.isArray(q.options) || q.options.length !== 4) errors.push('options が4択ではない');
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3)
    errors.push('correctAnswer が 0-3 の範囲外');
  if (!q.explanation) errors.push('explanation が空');
  if (!VALID_CATEGORIES.has(q.category)) errors.push(`category '${q.category}' が無効`);
  if (!VALID_DIFFICULTIES.has(q.difficulty)) errors.push(`difficulty '${q.difficulty}' が無効`);
  if (errors.length > 0) {
    console.error(`  [警告] 問題${index + 1}にエラー: ${errors.join(', ')}`);
    return false;
  }
  return true;
}

// -----------------------------------------------------------------------
// メイン
// -----------------------------------------------------------------------
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(`
使い方:
  node scripts/extract-questions.mjs <画像ファイル1> [画像ファイル2] ...

例:
  node scripts/extract-questions.mjs screenshots/page01.png screenshots/page02.png
`);
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('エラー: ANTHROPIC_API_KEY 環境変数が設定されていません');
  process.exit(1);
}

const maxIds = readExistingMaxIds();
const counters = { ...maxIds };
const allResults = [];

for (const imgPath of args) {
  const absPath = path.resolve(process.cwd(), imgPath);
  if (!fs.existsSync(absPath)) {
    console.error(`ファイルが見つかりません: ${absPath}`);
    continue;
  }

  process.stderr.write(`処理中: ${path.basename(absPath)} ... `);
  try {
    const questions = await extractFromImage(absPath);
    process.stderr.write(`${questions.length}問 抽出\n`);
    allResults.push({ file: path.basename(absPath), questions });
  } catch (e) {
    process.stderr.write(`エラー\n`);
    console.error(`  ${e.message}`);
  }
}

if (allResults.length === 0 || allResults.every(r => r.questions.length === 0)) {
  console.error('抽出できた問題がありませんでした。');
  process.exit(1);
}

// -----------------------------------------------------------------------
// 出力
// -----------------------------------------------------------------------
console.log(`\n// ========================================`);
console.log(`// 以下を src/data/clf-c02-questions.ts の`);
console.log(`// 対応するカテゴリ配列の末尾に追加してください`);
console.log(`// ========================================\n`);

let totalExtracted = 0;
let totalValid = 0;

for (const { file, questions } of allResults) {
  if (questions.length === 0) continue;
  console.log(`// --- ${file} から抽出 ---`);

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    totalExtracted++;
    if (!validate(q, i)) continue;
    totalValid++;

    const cat = q.category;
    counters[cat]++;
    const prefix = ID_PREFIX[cat];
    const id = `${prefix}-${String(counters[cat]).padStart(3, '0')}`;

    console.log(questionToTs(q, id));
  }
  console.log('');
}

console.error(`\n完了: ${totalExtracted}問 抽出 / ${totalValid}問 出力`);
if (totalExtracted !== totalValid) {
  console.error(`  (${totalExtracted - totalValid}問はバリデーションエラーで除外)`);
}
