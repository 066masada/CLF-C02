import { useState, useCallback, useEffect } from 'react';
import { MISSIONS, getMissionQuestions, loadProgress, saveProgress, type Mission } from '../../data/missions';
import { saveMissionProgress, loadMissionProgressFromFirebase } from '../../hooks/useFirebase';
import type { Question } from '../../types/index';
import { useUser } from '../../contexts/UserContext';
import { MissionMap } from '../mission/MissionMap';
import { MissionPlayer } from '../mission/MissionPlayer';
import { SceneMissionPlayer } from '../mission/SceneMissionPlayer';

type View  = 'map' | 'playing';
type Phase = 'intro' | 'concepts' | 'quiz' | 'complete';

interface QuizState {
  index: number;
  selected: number | null;
  showAnswer: boolean;
  correctCount: number;
}

interface MissionModeProps {
  initialMissionId?: string | null;
  onMissionStarted?: () => void;
}

export const MissionMode = ({ initialMissionId, onMissionStarted }: MissionModeProps) => {
  const { user } = useUser();
  const playerName = user?.displayName ?? 'あなた';
  const userId     = user?.userId ?? 'guest';

  // localStorage を初期値として使い、Firebase から取得できたら上書き
  const [completed, setCompleted] = useState<string[]>(() => loadProgress(userId));

  useEffect(() => {
    setCompleted(loadProgress(userId));
    // Firebase から最新の進捗を非同期で取得
    loadMissionProgressFromFirebase(userId).then((firebaseProgress) => {
      if (firebaseProgress.length > 0) {
        // localStorage と Firebase のマージ（どちらかにあれば完了扱い）
        setCompleted((local) => {
          const merged = Array.from(new Set([...local, ...firebaseProgress]));
          if (merged.length !== local.length) {
            saveProgress(userId, merged);
          }
          return merged;
        });
      }
    });
  }, [userId]);

  const [view, setView]                   = useState<View>('map');
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [phase, setPhase]                 = useState<Phase>('intro');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [quiz, setQuiz]                   = useState<QuizState>({ index: 0, selected: null, showAnswer: false, correctCount: 0 });
  const [missionQuestions, setMissionQuestions] = useState<Question[]>([]);

  const startMission = useCallback((mission: Mission) => {
    setActiveMission(mission);
    setPhase('intro');
    setDialogueIndex(0);
    setQuiz({ index: 0, selected: null, showAnswer: false, correctCount: 0 });
    setMissionQuestions(getMissionQuestions(mission) as Question[]);
    setView('playing');
  }, []);

  useEffect(() => {
    if (!initialMissionId) return;
    const mission = MISSIONS.find((m) => m.id === initialMissionId);
    if (mission) {
      startMission(mission);
      onMissionStarted?.();
    }
  // initialMissionId は初回マウント時の一度限りの値なので deps に含めない
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setCompleted((prev) => {
      if (prev.includes(missionId)) return prev;
      const next = [...prev, missionId];
      saveProgress(userId, next);
      saveMissionProgress(userId, next); // Firebase にも非同期保存
      return next;
    });
  }, [userId]);

  const resetMission = useCallback(() => {
    saveProgress(userId, []);
    saveMissionProgress(userId, []);
    setCompleted([]);
  }, [userId]);

  const backToMap = () => {
    setView('map');
    setActiveMission(null);
  };

  if (view === 'map' || !activeMission) {
    return <MissionMap completed={completed} onStart={startMission} onReset={resetMission} />;
  }

  /* シーン型ミッション */
  if (activeMission.scenes && activeMission.scenes.length > 0) {
    return (
      <SceneMissionPlayer
        mission={activeMission}
        playerName={playerName}
        onComplete={() => completeMission(activeMission.id)}
        onBackToMap={backToMap}
      />
    );
  }

  /* 旧来の4フェーズ型ミッション */
  return (
    <MissionPlayer
      mission={activeMission}
      phase={phase}
      dialogueIndex={dialogueIndex}
      quiz={quiz}
      questions={missionQuestions}
      playerName={playerName}
      onNextDialogue={() => setDialogueIndex((i) => i + 1)}
      onEndDialogue={() => setPhase('concepts')}
      onEndConcepts={() => setPhase('quiz')}
      onSelectAnswer={(idx) => {
        const q = missionQuestions[quiz.index];
        const isCorrect = idx === q.correctAnswer;
        setQuiz((s) => ({ ...s, selected: idx, showAnswer: true, correctCount: s.correctCount + (isCorrect ? 1 : 0) }));
      }}
      onNextQuestion={() => {
        if (quiz.index + 1 >= missionQuestions.length) {
          completeMission(activeMission.id);
          setPhase('complete');
        } else {
          setQuiz((s) => ({ ...s, index: s.index + 1, selected: null, showAnswer: false }));
        }
      }}
      onBackToMap={backToMap}
    />
  );
};
