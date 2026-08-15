import { useState } from 'react';
import { studyNotes } from '../../data/study-notes';
import type { StudyNote, StudySection } from '../../data/study-notes';

const IMPORTANCE_COLOR: Record<string, string> = {
  A: 'var(--kg-error)',
  B: 'var(--kg-warn)',
  C: 'var(--kg-success)',
};
const IMPORTANCE_LABEL: Record<string, string> = {
  A: '重要度 A（最重要）',
  B: '重要度 B（重要）',
  C: '重要度 C（参考）',
};

export const LearningTab = () => {
  const [selectedChapter, setSelectedChapter] = useState(studyNotes[0]?.id ?? '');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const note = studyNotes.find((n) => n.id === selectedChapter);
  const allIds = note?.sections.map((s) => s.id) ?? [];
  const allExpanded = allIds.length > 0 && allIds.every((id) => expandedSections.has(id));

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setExpandedSections(allExpanded ? new Set() : new Set(allIds));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>

      {/* 章セレクター */}
      <div>
        <p style={{
          fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
          letterSpacing: '0.08em', color: 'var(--kg-ink-3)', textTransform: 'uppercase',
          margin: '0 0 var(--s-2)',
        }}>
          chapter
        </p>
        <div className="chip-scroll">
          {studyNotes.map((n) => (
            <button
              key={n.id}
              className={`chip${selectedChapter === n.id ? ' chip-active' : ''}`}
              onClick={() => { setSelectedChapter(n.id); setExpandedSections(new Set()); }}
            >
              第{n.chapter}章
            </button>
          ))}
        </div>
      </div>

      {note && (
        <>
          {/* 全開き/全閉じトグル */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={toggleAll}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0',
                fontSize: '0.75rem', color: 'var(--kg-accent)', fontFamily: 'var(--font-jp)',
                fontWeight: 700, letterSpacing: '0.02em',
              }}
            >
              {allExpanded ? '全て閉じる ▲' : '全て開く ▼'}
            </button>
          </div>
          <ChapterContent note={note} expandedSections={expandedSections} onToggle={toggleSection} />
        </>
      )}

      {studyNotes.length === 0 && (
        <div style={{ padding: 'var(--s-6) var(--s-4)', textAlign: 'center',
          border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--kg-ink-3)', margin: 0 }}>
            学習コンテンツを準備中です
          </p>
        </div>
      )}
    </div>
  );
};

/* ===== 章コンテンツ ===== */
const ChapterContent = ({
  note, expandedSections, onToggle,
}: { note: StudyNote; expandedSections: Set<string>; onToggle: (id: string) => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>

    {/* ヘッダー */}
    <div style={{
      padding: 'var(--s-4)',
      background: 'var(--kg-selected-bg)',
      border: '1px solid var(--kg-accent)',
      borderRadius: 'var(--r-1)',
    }}>
      <p style={{
        fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 600,
        color: 'var(--kg-accent-soft)', letterSpacing: '0.08em',
        textTransform: 'uppercase', margin: '0 0 var(--s-1)',
      }}>
        {note.part} / 第{note.chapter}章
      </p>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--kg-ink)', margin: '0 0 var(--s-2)' }}>
        {note.title}
      </h2>
      <span style={{
        display: 'inline-block',
        fontFamily: 'var(--font-en)', fontSize: '0.625rem', fontWeight: 700,
        padding: '0.15rem 0.5rem',
        border: `1px solid ${IMPORTANCE_COLOR[note.importance]}`,
        color: IMPORTANCE_COLOR[note.importance],
        borderRadius: 'var(--r-1)',
        marginBottom: 'var(--s-2)',
      }}>
        {IMPORTANCE_LABEL[note.importance]}
      </span>
      <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', margin: 0, lineHeight: 1.75 }}>
        {note.summary}
      </p>
    </div>

    {/* セクション一覧 */}
    {note.sections.map((section) => (
      <SectionCard
        key={section.id}
        section={section}
        expanded={expandedSections.has(section.id)}
        onToggle={() => onToggle(section.id)}
      />
    ))}
  </div>
);

/* ===== セクションカード ===== */
const SectionCard = ({
  section, expanded, onToggle,
}: { section: StudySection; expanded: boolean; onToggle: () => void }) => (
  <div style={{ border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)', overflow: 'hidden' }}>
    {/* タイトルバー（タップで展開） */}
    <button
      onClick={onToggle}
      style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--s-3) var(--s-4)',
        background: 'var(--kg-paper)',
        border: 'none', cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--kg-ink)', lineHeight: 1.4 }}>
        {section.title}
      </span>
      <span style={{ flexShrink: 0, marginLeft: 'var(--s-2)', color: 'var(--kg-ink-3)', fontSize: '0.75rem' }}>
        {expanded ? '▲' : '▼'}
      </span>
    </button>

    {expanded && (
      <div style={{ borderTop: '1px solid var(--kg-rule)' }}>

        {/* 本文 */}
        <div style={{ padding: 'var(--s-4)', background: 'var(--kg-paper-2)' }}>
          {section.body.split('\n').map((line, i) => (
            line === '' ? <br key={i} /> :
            <p key={i} style={{
              fontSize: '0.875rem', color: 'var(--kg-ink)', lineHeight: 1.85, margin: '0 0 var(--s-2)',
              fontWeight: line.startsWith('【') ? 600 : 400,
            }}>
              {line}
            </p>
          ))}
        </div>

        {/* 階層図 */}
        {section.hierarchy && (
          <div style={{ padding: 'var(--s-4)', borderTop: '1px solid var(--kg-rule)' }}>
            <p className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>概念の階層構造</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              {section.hierarchy.map((h, idx) => (
                <div key={h.level} style={{
                  paddingLeft: `calc(var(--s-3) * ${idx})`,
                  borderLeft: idx > 0 ? '2px solid var(--kg-rule)' : 'none',
                  marginLeft: idx > 0 ? `calc(var(--s-3) * ${idx - 1})` : 0,
                }}>
                  <div style={{
                    padding: 'var(--s-3)',
                    border: '1px solid var(--kg-rule)',
                    borderRadius: 'var(--r-1)',
                    background: idx === 0 ? 'var(--kg-paper-2)' : 'var(--kg-paper)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--s-1)' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--kg-accent)' }}>{h.level}</span>
                      <span style={{
                        fontSize: '0.625rem', fontWeight: 700,
                        padding: '0.1rem 0.4rem',
                        border: '1px solid var(--kg-rule)',
                        borderRadius: 'var(--r-1)',
                        color: 'var(--kg-ink-3)',
                      }}>{h.label}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', margin: '0 0 var(--s-1)', lineHeight: 1.7 }}>{h.desc}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--kg-ink-3)', margin: 0 }}>
                      <span style={{ fontWeight: 600 }}>例：</span>{h.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 現実世界の例 */}
        {section.realWorld && (
          <div style={{
            padding: 'var(--s-4)',
            borderTop: '1px solid var(--kg-rule)',
            background: 'var(--kg-correct-bg)',
            borderLeft: '3px solid var(--kg-success)',
          }}>
            <p style={{
              fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
              letterSpacing: '0.08em', color: 'var(--kg-success)',
              textTransform: 'uppercase', margin: '0 0 var(--s-2)',
            }}>
              real world example
            </p>
            {section.realWorld.split('\n').map((line, i) => (
              line === '' ? <br key={i} /> :
              <p key={i} style={{
                fontSize: '0.8125rem', color: 'var(--kg-ink)', lineHeight: 1.85, margin: '0 0 var(--s-1)',
                fontWeight: line.startsWith('【') || line.startsWith('📚') || line.startsWith('✏️') || line.startsWith('💡') || line.startsWith('🤳') || line.startsWith('🎵') || line.startsWith('🚗') || line.startsWith('💬') ? 600 : 400,
              }}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* タイムライン */}
        {section.timeline && (
          <div style={{ padding: 'var(--s-4)', borderTop: '1px solid var(--kg-rule)' }}>
            <p className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>AI の歴史</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
              {section.timeline.map((item) => (
                <div key={item.period} style={{
                  borderLeft: `3px solid ${item.boom ? 'var(--kg-accent)' : 'var(--kg-rule)'}`,
                  paddingLeft: 'var(--s-3)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--s-2)', marginBottom: 'var(--s-1)' }}>
                    <span style={{
                      fontFamily: 'var(--font-en)', fontSize: '0.75rem', fontWeight: 700,
                      color: item.boom ? 'var(--kg-accent)' : 'var(--kg-ink-3)',
                    }}>
                      {item.period}
                    </span>
                    {item.boom && (
                      <span style={{
                        fontSize: '0.625rem', fontWeight: 700,
                        padding: '0.1rem 0.4rem',
                        background: 'var(--kg-selected-bg)',
                        border: '1px solid var(--kg-accent)',
                        color: 'var(--kg-accent)',
                        borderRadius: 'var(--r-1)',
                      }}>
                        {item.boom}次ブーム
                      </span>
                    )}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--kg-ink)', margin: '0 0 var(--s-1)' }}>
                    {item.label}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 'var(--s-4)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {item.events.map((ev, i) => (
                      <li key={i} style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', lineHeight: 1.7 }}>{ev}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* キーワード */}
        {section.keyTerms && (
          <div style={{ padding: 'var(--s-4)', borderTop: '1px solid var(--kg-rule)' }}>
            <p className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>key terms</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
              {section.keyTerms.map((kt) => (
                <div key={kt.term} style={{
                  padding: 'var(--s-3)',
                  border: '1px solid var(--kg-rule)',
                  borderRadius: 'var(--r-1)',
                  background: 'var(--kg-paper)',
                }}>
                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--kg-ink)' }}>{kt.term}</span>
                    {kt.reading && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--kg-ink-3)', marginLeft: 'var(--s-2)' }}>
                        {kt.reading}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--kg-ink-2)', margin: 0, lineHeight: 1.7 }}>
                    {kt.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 試験のポイント */}
        {section.examTip && (
          <div style={{
            padding: 'var(--s-4)',
            borderTop: '1px solid var(--kg-rule)',
            background: 'var(--kg-wrong-bg)',
            borderLeft: '3px solid var(--kg-warn)',
          }}>
            <p style={{
              fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
              letterSpacing: '0.08em', color: 'var(--kg-warn)',
              textTransform: 'uppercase', margin: '0 0 var(--s-2)',
            }}>
              exam tip
            </p>
            {section.examTip.split('\n').map((line, i) => (
              line === '' ? <br key={i} /> :
              <p key={i} style={{
                fontSize: '0.8125rem', color: 'var(--kg-ink)', lineHeight: 1.85, margin: '0 0 var(--s-1)',
              }}>
                {line}
              </p>
            ))}
          </div>
        )}

      </div>
    )}
  </div>
);
