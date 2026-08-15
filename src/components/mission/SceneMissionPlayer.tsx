import { useState, useMemo } from 'react';
import type { Mission } from '../../data/missions';
import { CHARACTERS } from '../../data/missions';
import { SceneHeader } from './SceneHeader';
import { SceneDialogue } from './SceneDialogue';
import { SceneConcept } from './SceneConcept';
import { SceneQuiz } from './SceneQuiz';

interface SceneMissionPlayerProps {
  mission: Mission;
  playerName: string;
  onComplete: () => void;
  onBackToMap: () => void;
}

export const SceneMissionPlayer = ({
  mission, playerName, onComplete, onBackToMap,
}: SceneMissionPlayerProps) => {
  const scenes = mission.scenes!;
  const [sceneIndex,   setSceneIndex]   = useState(0);
  const [lineIndex,    setLineIndex]    = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizShowAns,  setQuizShowAns]  = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizTotal,    setQuizTotal]    = useState(0);
  const [isDone,       setIsDone]       = useState(false);

  const currentScene = scenes[sceneIndex];
  const isLastScene  = sceneIndex === scenes.length - 1;

  /* このミッションに登場するキャラクター一覧（順序保持・重複除去） */
  const castKeys = useMemo(() => {
    const seen = new Set<string>();
    for (const sc of scenes) {
      if (sc.type === 'dialogue') {
        for (const l of sc.lines) {
          if (!seen.has(l.speaker)) seen.add(l.speaker);
        }
      }
    }
    return [...seen];
  }, [scenes]);

  const advanceScene = () => {
    if (isLastScene) {
      onComplete();
      setIsDone(true);
    } else {
      setSceneIndex((i) => i + 1);
      setLineIndex(0);
      setQuizSelected(null);
      setQuizShowAns(false);
    }
  };

  /* 完了画面 — SceneHeader は表示しない（進捗が誤表示になるため） */
  if (isDone) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', margin: '0 0 var(--s-2)' }}>{mission.badge.icon}</p>
          <p style={{ fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--kg-ink-3)', margin: '0 0 var(--s-1)' }}>
            mission complete
          </p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: mission.badge.color, margin: '0 0 var(--s-3)' }}>
            {mission.badge.label}
          </p>
          <p style={{ fontFamily: 'var(--font-en)', fontWeight: 700, fontSize: '2rem',
            color: 'var(--kg-ink)', lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>
            {correctCount}
            <span style={{ fontSize: '0.9375rem', fontWeight: 400, color: 'var(--kg-ink-3)', marginLeft: 'var(--s-2)' }}>
              / {quizTotal} 問正解
            </span>
          </p>
        </div>
        <button className="btn btn-primary" onClick={onBackToMap} style={{ width: '100%' }}>
          マップに戻る →
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in scene-grid">
      {/* 左: メインコンテンツ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)', minWidth: 0 }}>
        <SceneHeader mission={mission} sceneIndex={sceneIndex} total={scenes.length} onBack={onBackToMap} />

        {currentScene.type === 'dialogue' && (
          <SceneDialogue
            lines={currentScene.lines}
            lineIndex={lineIndex}
            playerName={playerName}
            isLastScene={isLastScene}
            onNext={() => {
              if (lineIndex + 1 < currentScene.lines.length) setLineIndex((i) => i + 1);
              else advanceScene();
            }}
          />
        )}

        {currentScene.type === 'concept' && (
          <SceneConcept scene={currentScene} isLastScene={isLastScene} onNext={advanceScene} />
        )}

        {currentScene.type === 'quiz' && (
          <SceneQuiz
            scene={currentScene}
            selected={quizSelected}
            showAnswer={quizShowAns}
            isLastScene={isLastScene}
            onSelect={(idx) => {
              const correct = idx === currentScene.answer;
              setQuizSelected(idx);
              setQuizShowAns(true);
              setQuizTotal((t) => t + 1);
              if (correct) setCorrectCount((c) => c + 1);
            }}
            onNext={advanceScene}
          />
        )}
      </div>

      {/* 右: PC サイドレール */}
      <aside className="scene-rail">
        {/* シーン進捗 */}
        <div style={{
          border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)',
          padding: 'var(--s-4)', background: 'var(--kg-paper)',
          marginBottom: 'var(--s-4)',
        }}>
          <p style={{
            fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--kg-ink-3)', margin: '0 0 var(--s-3)',
          }}>scene progress</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-2)' }}>
            {scenes.map((sc, i) => {
              const done = i < sceneIndex;
              const now  = i === sceneIndex;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--s-2)',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? 'var(--kg-accent)' : now ? 'var(--kg-paper-3)' : 'transparent',
                    border: `1.5px solid ${done ? 'var(--kg-accent)' : now ? 'var(--kg-accent)' : 'var(--kg-rule)'}`,
                    color: done ? '#fff' : now ? 'var(--kg-accent)' : 'var(--kg-ink-4)',
                    fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: done ? 'var(--kg-ink-3)' : now ? 'var(--kg-ink)' : 'var(--kg-ink-4)',
                    fontWeight: now ? 700 : 400,
                  }}>
                    {sc.type === 'dialogue' ? '会話' : sc.type === 'quiz' ? 'クイズ' : '解説'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 登場人物 */}
        <div style={{
          border: '1px solid var(--kg-rule)', borderRadius: 'var(--r-1)',
          padding: 'var(--s-4)', background: 'var(--kg-paper)',
        }}>
          <p style={{
            fontFamily: 'var(--font-en)', fontSize: '0.6875rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--kg-ink-3)', margin: '0 0 var(--s-3)',
          }}>characters</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
            {castKeys.map((key) => {
              const c = CHARACTERS[key];
              if (!c) return null;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-2)' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: c.align === 'right' ? 'var(--kg-accent)' : 'var(--kg-paper-3)',
                    border: `1px solid ${c.align === 'right' ? 'transparent' : 'var(--kg-rule)'}`,
                    color: c.align === 'right' ? '#fff' : 'var(--kg-ink)',
                    fontFamily: 'var(--font-jp)', fontSize: '0.875rem', fontWeight: 700,
                  }}>
                    {c.initial}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--kg-ink)' }}>
                      {c.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--kg-ink-3)' }}>
                      {c.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};
