import type { Question } from '../types/index';

/* =====================================================
   TODO: CLF-C02 (AWS Certified Cloud Practitioner) の問題データをここに追加してください。
   このファイルは AIF-C01 版アプリ（src/data/aif-c01-questions.ts）から
   構造だけを引き継いだ空のテンプレートです。

   参考：CLF-C02 の出題ドメイン（AWS公式試験ガイドより）
     Domain 1: Cloud Concepts               (24%)
     Domain 2: Security and Compliance      (30%)
     Domain 3: Cloud Technology and Services(34%)
     Domain 4: Billing, Pricing, and Support(12%)

   下記の questionsByCategory / categoryLabels / radarCategoryLabels の
   キーは AIF-C01 の暫定値（ai-basics 等）のままです。
   実際のカテゴリ構成に合わせて types/index.ts の QuestionCategory と
   併せて書き換えてください。
===================================================== */

export const questions: Question[] = [];

export const questionsByCategory = {
  'ai-basics': questions.filter((q) => q.category === 'ai-basics'),
  'ml-fundamentals': questions.filter((q) => q.category === 'ml-fundamentals'),
  'aws-services': questions.filter((q) => q.category === 'aws-services'),
  'ethics': questions.filter((q) => q.category === 'ethics'),
  'practice': questions.filter((q) => q.category === 'practice'),
};

export const categoryLabels: Record<string, string> = {
  'ai-basics': 'カテゴリ1（仮）',
  'ml-fundamentals': 'カテゴリ2（仮）',
  'aws-services': 'カテゴリ3（仮）',
  'ethics': 'カテゴリ4（仮）',
  'practice': '実践問題',
};

// レーダーチャート用の短縮ラベル（スペース節約のため categoryLabels より短い）
export const radarCategoryLabels: Record<string, string> = {
  'ai-basics': 'カテゴリ1',
  'ml-fundamentals': 'カテゴリ2',
  'aws-services': 'カテゴリ3',
  'ethics': 'カテゴリ4',
  'practice': '実践問題',
};
