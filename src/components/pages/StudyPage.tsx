import { useState, useEffect, lazy, Suspense } from 'react';
import { useQuestionsStore } from '../../hooks/useQuestionsStore';
import { categoryLabels } from '../../data/clf-c02-questions';
import { useNavigation, type StudyTab } from '../../contexts/NavigationContext';
import type { QuestionCategory } from '../../types/index';

// missions.ts / study-notes.ts は大きいので、タブが選択されたときだけロード
const MissionMode = lazy(() =>
  import('./MissionMode').then((m) => ({ default: m.MissionMode }))
);
const LearningTab = lazy(() =>
  import('./LearningTab').then((m) => ({ default: m.LearningTab }))
);
const TermsTab = lazy(() =>
  import('./TermsTab').then((m) => ({ default: m.TermsTab }))
);

const TabFallback = () => (
  <p style={{ padding: 'var(--s-6) 0', textAlign: 'center',
    fontSize: '0.875rem', color: 'var(--kg-ink-3)' }}>
    読み込み中…
  </p>
);

const DIFFICULTY_CHIPS = [
  { value: 'all'    as const, label: 'すべて' },
  { value: 'easy'   as const, label: '初級' },
  { value: 'medium' as const, label: '中級' },
  { value: 'hard'   as const, label: '上級' },
];

const DIFFICULTY_LABEL: Record<string, string> = { easy: '初級', medium: '中級', hard: '上級' };

/* 難易度バッジ色 */
const DIFF_COLOR: Record<string, string> = {
  easy:   'var(--kg-success)',
  medium: 'var(--kg-warn)',
  hard:   'var(--kg-error)',
};
const DIFF_BG: Record<string, string> = {
  easy:   'var(--kg-correct-bg)',
  medium: 'var(--kg-warn-bg)',
  hard:   'var(--kg-wrong-bg)',
};

/* ドメイン別配色 */
const DOMAIN_COLOR: Record<string, string> = {
  '基盤モデルの応用':               'var(--kg-accent)',
  '生成AIの基礎':                   'var(--kg-accent-soft)',
  'AI・機械学習の基礎':             'var(--kg-ink-2)',
  '責任あるAI':                     'var(--kg-warn)',
  'AIセキュリティ・コンプライアンス': 'var(--kg-error)',
};

export const StudyPage = () => {
  const { initialStudyTab, clearInitialStudyTab, initialMissionId, clearInitialMissionId } = useNavigation();
  const [activeTab, setActiveTab] = useState<StudyTab>(initialStudyTab ?? 'overview');
  const {
    questions,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    categories,
  } = useQuestionsStore();

  useEffect(() => {
    if (initialStudyTab) clearInitialStudyTab();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleCategoryChange = (cat: QuestionCategory | 'all') => {
    setSelectedCategory(cat); setCurrentIndex(0); setShowExplanation(false);
  };
  const handleDifficultyChange = (diff: 'all' | 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(diff); setCurrentIndex(0); setShowExplanation(false);
  };

  return (
    <div className="fade-in">
      {/* ── セグメント ── */}
      <div className="study-tabs" style={{ marginBottom: 'var(--s-4)' }}>
        {(['overview', 'learn', 'mission', 'questions', 'terms'] as const).map((tab) => {
          const labels: Record<typeof tab, string> = { overview: '概要', learn: '学習', mission: 'ミッション', questions: '問題', terms: '用語' };
          return (
            <button
              key={tab}
              className={`study-tab${activeTab === tab ? ' study-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' ? (
        <OverviewTab />
      ) : activeTab === 'learn' ? (
        <Suspense fallback={<TabFallback />}><LearningTab /></Suspense>
      ) : activeTab === 'mission' ? (
        <Suspense fallback={<TabFallback />}>
          <MissionMode initialMissionId={initialMissionId} onMissionStarted={clearInitialMissionId} />
        </Suspense>
      ) : activeTab === 'terms' ? (
        <Suspense fallback={<TabFallback />}><TermsTab /></Suspense>
      ) : (
        <QuestionsTab
          questions={questions}
          currentIndex={currentIndex}
          showExplanation={showExplanation}
          categories={categories}
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          onCategoryChange={handleCategoryChange}
          onDifficultyChange={handleDifficultyChange}
          onPrev={() => { setCurrentIndex((i) => Math.max(0, i - 1)); setShowExplanation(false); }}
          onNext={() => { setCurrentIndex((i) => Math.min(questions.length - 1, i + 1)); setShowExplanation(false); }}
          onToggleExplanation={() => setShowExplanation((v) => !v)}
        />
      )}
    </div>
  );
};

/* ===== 概要タブ ===== */
const OverviewTab = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>

    {/* AWS 認定資格マップ */}
    <section>
      <p className="eyebrow">certification map</p>
      <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>AWS認定資格の全体マップ</h2>
      <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', margin: '0 0 var(--s-4)', lineHeight: 1.85 }}>
        AWSの認定資格は4つのレベルに分類されます。CLF-C02はFoundationalレベル（入門）に位置する資格で、AWSクラウドの基礎知識を証明する入門資格です。
      </p>

      {[
        { level: 'FOUNDATIONAL',  label: '入門', cards: [
          { code: 'CLF-C02', name: 'Cloud Practitioner', desc: 'クラウド基礎全般', current: true },
          { code: 'AIF-C01', name: 'AI Practitioner',    desc: 'AI/ML基礎' },
        ]},
        { level: 'ASSOCIATE', label: '中級', cards: [
          { code: 'SAA-C03', name: 'Solutions Architect', desc: 'クラウド設計' },
          { code: 'DVA-C02', name: 'Developer',           desc: '開発・デプロイ' },
          { code: 'SOA-C02', name: 'SysOps Admin',        desc: '運用・管理' },
          { code: 'DEA-C01', name: 'Data Engineer',       desc: 'データ処理' },
          { code: 'MLA-C01', name: 'ML Engineer',         desc: 'AI/ML実装', next: true },
        ]},
        { level: 'PROFESSIONAL', label: '上級', cards: [
          { code: 'SAP-C02', name: 'Solutions Architect Pro', desc: '高度な設計' },
          { code: 'DOP-C02', name: 'DevOps Pro',              desc: '運用自動化' },
        ]},
        { level: 'SPECIALTY', label: '専門', cards: [
          { code: 'SCS-C02', name: 'Security',    desc: 'セキュリティ' },
          { code: 'ANS-C01', name: 'Networking',  desc: 'ネットワーク' },
          { code: 'DBS-C01', name: 'Database',    desc: 'データベース' },
        ]},
      ].map(({ level, label, cards }) => (
        <div key={level} style={{ marginBottom: 'var(--s-4)' }}>
          <p style={{
            fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
            letterSpacing: '0.14em', color: 'var(--kg-accent-soft)',
            textTransform: 'uppercase', margin: '0 0 var(--s-2)',
          }}>
            {level} <span style={{ color: 'var(--kg-ink-3)', fontWeight: 400 }}>/ {label}</span>
          </p>
          <div style={{ display: 'flex', gap: 'var(--s-2)', overflowX: 'auto',
            paddingBottom: 'var(--s-1)', scrollSnapType: 'x mandatory' }}>
            {cards.map(({ code, name, desc, current, next }: {
              code: string; name: string; desc: string; current?: boolean; next?: boolean;
            }) => (
              <div key={code} style={{
                flexShrink: 0, scrollSnapAlign: 'start',
                padding: 'var(--s-3) var(--s-3)',
                border: current
                  ? `2px solid var(--kg-accent)`
                  : next
                    ? `1px solid var(--kg-accent-soft)`
                    : `1px solid var(--kg-rule)`,
                borderRadius: 'var(--r-1)',
                background: current ? 'var(--kg-selected-bg)' : 'var(--kg-paper)',
                minWidth: 90, maxWidth: 120,
              }}>
                {current && (
                  <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.625rem', fontWeight: 700,
                    color: 'var(--kg-accent)', margin: '0 0 var(--s-1)', letterSpacing: '0.04em' }}>
                    ★ いまここ
                  </p>
                )}
                <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.625rem', fontWeight: 700,
                  color: current ? 'var(--kg-accent)' : next ? 'var(--kg-accent-soft)' : 'var(--kg-ink-3)',
                  margin: '0 0 var(--s-1)' }}>
                  {code}
                </p>
                <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.75rem', fontWeight: 700,
                  color: 'var(--kg-ink)', margin: '0 0 2px', lineHeight: 1.3 }}>
                  {name}
                </p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--kg-ink-3)', margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>

    {/* 試験基本情報 */}
    <section>
      <p className="eyebrow">exam specs</p>
      <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>試験基本情報</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-2)' }}>
        {[
          { label: '合格スコア', value: '700 / 1000' },
          { label: '問題数',     value: '65 問' },
          { label: '試験時間',   value: '90 分' },
          { label: '受験料',     value: '300 USD' },
          { label: '有効期限',   value: '3 年' },
          { label: '言語',       value: '日本語対応' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            padding: 'var(--s-3) var(--s-3)',
            border: '1px solid var(--kg-rule)',
            borderRadius: 'var(--r-1)',
            background: 'var(--kg-paper-2)',
          }}>
            <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 400,
              color: 'var(--kg-ink-3)', margin: '0 0 var(--s-1)', letterSpacing: '0.04em' }}>
              {label}
            </p>
            <p style={{ fontFamily: 'var(--font-en)', fontSize: '1rem', fontWeight: 700,
              color: 'var(--kg-ink)', margin: 0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* 試験ドメイン */}
    <section>
      <p className="eyebrow">domains</p>
      <h2 style={{ marginBottom: 'var(--s-4)', color: 'var(--kg-ink)' }}>試験ドメインと出題範囲</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        {[
          { name: '基盤モデルの応用',             pct: 28,
            items: ['Amazon Bedrock', 'RAG', 'プロンプトエンジニアリング', 'ファインチューニング', 'エージェント'] },
          { name: '生成AIの基礎',                 pct: 24,
            items: ['LLMの仕組み', '生成AIユースケース', 'ハルシネーション対策', 'トークン・コスト'] },
          { name: 'AI・機械学習の基礎',           pct: 20,
            items: ['教師あり/なし/強化学習', '過学習と対策', 'モデル評価指標', 'MLOps基礎'] },
          { name: '責任あるAI',                   pct: 14,
            items: ['バイアスと公平性', 'XAI/SHAP', 'SageMaker Clarify', 'AIガバナンス'] },
          { name: 'AIセキュリティ・コンプライアンス', pct: 14,
            items: ['責任共有モデル', 'IAM最小権限', 'AWS Artifact', 'AWS Config'] },
        ].map(({ name, pct, items }) => {
          const clr = DOMAIN_COLOR[name] ?? 'var(--kg-accent)';
          return (
            <div key={name} style={{ borderLeft: `3px solid ${clr}`, paddingLeft: 'var(--s-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--s-1)' }}>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--kg-ink)', margin: 0, lineHeight: 1.4 }}>{name}</p>
                <p style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '0.875rem', color: clr, margin: 0 }}>{pct}%</p>
              </div>
              <div style={{ height: 3, background: 'var(--kg-rule-soft)', borderRadius: 'var(--r-1)',
                overflow: 'hidden', marginBottom: 'var(--s-2)' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: clr }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-1)' }}>
                {items.map((item) => (
                  <span key={item} style={{
                    fontFamily: 'var(--font-jp)', fontSize: '0.6875rem',
                    padding: '0.15rem var(--s-2)',
                    border: '1px solid var(--kg-rule)',
                    borderRadius: 'var(--r-1)',
                    color: 'var(--kg-ink-2)',
                    background: 'var(--kg-paper)',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>

  </div>
);

/* ===== 問題タブ ===== */
interface QuestionsTabProps {
  questions: ReturnType<typeof useQuestionsStore>['questions'];
  currentIndex: number;
  showExplanation: boolean;
  categories: readonly QuestionCategory[];
  selectedCategory: QuestionCategory | 'all';
  selectedDifficulty: 'all' | 'easy' | 'medium' | 'hard';
  onCategoryChange: (cat: QuestionCategory | 'all') => void;
  onDifficultyChange: (diff: 'all' | 'easy' | 'medium' | 'hard') => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleExplanation: () => void;
}

const QuestionsTab = ({
  questions, currentIndex, showExplanation,
  categories, selectedCategory, selectedDifficulty,
  onCategoryChange, onDifficultyChange, onPrev, onNext, onToggleExplanation,
}: QuestionsTabProps) => {
  if (questions.length === 0) {
    return (
      <>
        <FilterSection {...{ categories, selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange }} />
        <div style={{ marginTop: 'var(--s-4)', padding: 'var(--s-6) var(--s-4)',
          border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--kg-ink-3)', margin: 0 }}>
            該当する問題がありません。フィルターを変更してください。
          </p>
        </div>
      </>
    );
  }

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const diffClr = DIFF_COLOR[question.difficulty] ?? 'var(--kg-ink-3)';
  const diffBg  = DIFF_BG[question.difficulty]  ?? 'var(--kg-paper-2)';

  return (
    <>
      <FilterSection {...{ categories, selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange }} />

      {/* 進捗 */}
      <div style={{ marginBottom: 'var(--s-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 'var(--s-1)' }}>
          <span style={{ fontFamily: 'var(--font-en)', fontSize: '0.75rem', color: 'var(--kg-ink-3)' }}>
            {currentIndex + 1} / {questions.length}
          </span>
          <div style={{ display: 'flex', gap: 'var(--s-1)' }}>
            <span style={{
              fontFamily: 'var(--font-en)', fontSize: '0.625rem', fontWeight: 700,
              padding: '0.15rem 0.4rem', borderRadius: 'var(--r-1)',
              color: diffClr, background: diffBg, border: `1px solid ${diffClr}`,
            }}>
              {DIFFICULTY_LABEL[question.difficulty]}
            </span>
            <span style={{
              fontFamily: 'var(--font-en)', fontSize: '0.625rem', fontWeight: 700,
              padding: '0.15rem 0.4rem', borderRadius: 'var(--r-1)',
              color: 'var(--kg-accent)', background: 'var(--kg-selected-bg)',
              border: '1px solid var(--kg-accent)',
            }}>
              {categoryLabels[question.category] ?? question.category}
            </span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 問題カード */}
      <div className="card" style={{ marginBottom: 'var(--s-3)' }}>
        <p style={{
          fontFamily: 'var(--font-jp)', fontWeight: 700, fontSize: '1rem',
          color: 'var(--kg-ink)', lineHeight: 1.7, marginBottom: 'var(--s-4)',
        }}>
          {question.question}
        </p>

        {question.options.map((option, idx) => {
          const isCorrect = idx === question.correctAnswer;
          const cls = showExplanation ? (isCorrect ? ' option-correct' : ' option-wrong') : '';
          return (
            <div key={idx} className={`option-item${cls}`} style={{ cursor: 'default' }}>
              <strong className="option-letter">{String.fromCharCode(65 + idx)}.</strong>
              <span style={{ flex: 1, color: 'var(--kg-ink)', fontFamily: 'var(--font-jp)' }}>{option}</span>
              {showExplanation && (
                <span style={{ flexShrink: 0, fontSize: '0.6875rem', fontWeight: 700,
                  color: isCorrect ? 'var(--kg-success)' : 'var(--kg-error)' }}>
                  {isCorrect ? '✓ 正解' : '✗ 誤り'}
                </span>
              )}
            </div>
          );
        })}

        <button className="btn btn-secondary" onClick={onToggleExplanation}
          style={{ width: '100%', marginTop: 'var(--s-3)' }}>
          {showExplanation ? '解説を隠す ▲' : '解説を表示 ▼'}
        </button>

        {showExplanation && (
          <div style={{
            marginTop: 'var(--s-3)', padding: 'var(--s-3) var(--s-4)',
            borderLeft: '3px solid var(--kg-accent)',
            background: 'var(--kg-paper-2)',
          }}>
            <p style={{ fontFamily: 'var(--font-jp)', color: 'var(--kg-ink-2)',
              lineHeight: 1.85, margin: 0, fontSize: '0.875rem' }}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* ナビ */}
      <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
        <button className="btn btn-secondary" onClick={onPrev}
          disabled={currentIndex === 0}
          style={{ flex: 1, opacity: currentIndex === 0 ? 0.35 : 1 }}>
          ← 前へ
        </button>
        <button className="btn btn-primary" onClick={onNext}
          disabled={currentIndex === questions.length - 1}
          style={{ flex: 1, opacity: currentIndex === questions.length - 1 ? 0.35 : 1 }}>
          次へ →
        </button>
      </div>
    </>
  );
};

/* ===== フィルター ===== */
interface FilterSectionProps {
  categories: readonly QuestionCategory[];
  selectedCategory: QuestionCategory | 'all';
  selectedDifficulty: 'all' | 'easy' | 'medium' | 'hard';
  onCategoryChange: (cat: QuestionCategory | 'all') => void;
  onDifficultyChange: (diff: 'all' | 'easy' | 'medium' | 'hard') => void;
}

const FilterSection = ({
  categories, selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange,
}: FilterSectionProps) => (
  <div style={{ marginBottom: 'var(--s-3)' }}>
    <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
      letterSpacing: '0.08em', color: 'var(--kg-ink-3)', textTransform: 'uppercase',
      margin: '0 0 var(--s-2)' }}>
      分野
    </p>
    <div className="chip-scroll" style={{ marginBottom: 'var(--s-3)' }}>
      <button className={`chip${selectedCategory === 'all' ? ' chip-active' : ''}`}
        onClick={() => onCategoryChange('all')}>すべて</button>
      {categories.map((cat) => (
        <button key={cat}
          className={`chip${selectedCategory === cat ? ' chip-active' : ''}`}
          onClick={() => onCategoryChange(cat)}>
          {categoryLabels[cat] ?? cat}
        </button>
      ))}
    </div>

    <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
      letterSpacing: '0.08em', color: 'var(--kg-ink-3)', textTransform: 'uppercase',
      margin: '0 0 var(--s-2)' }}>
      難易度
    </p>
    <div className="chip-scroll">
      {DIFFICULTY_CHIPS.map(({ value, label }) => (
        <button key={value}
          className={`chip${selectedDifficulty === value ? ' chip-active' : ''}`}
          onClick={() => onDifficultyChange(value)}>
          {label}
        </button>
      ))}
    </div>
  </div>
);
