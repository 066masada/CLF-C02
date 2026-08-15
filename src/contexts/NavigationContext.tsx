import { createContext, useContext, useState, type ReactNode } from 'react';

export type Screen = 'home' | 'study' | 'quiz' | 'ranking' | 'admin';
export type StudyTab = 'overview' | 'learn' | 'questions' | 'mission' | 'terms';

interface NavigateParams {
  quizInitialCount?: number;
  initialStudyTab?: StudyTab;
  initialMissionId?: string;
  initialQuizQuestionIds?: string[];
}

interface NavigationContextType {
  screen: Screen;
  navigate: (screen: Screen, params?: NavigateParams) => void;
  quizInitialCount: number | null;
  clearQuizInitialCount: () => void;
  initialStudyTab: StudyTab | null;
  clearInitialStudyTab: () => void;
  initialMissionId: string | null;
  clearInitialMissionId: () => void;
  initialQuizQuestionIds: string[] | null;
  clearInitialQuizQuestionIds: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<Screen>('home');
  const [quizInitialCount, setQuizInitialCount] = useState<number | null>(null);
  const [initialStudyTab, setInitialStudyTab] = useState<StudyTab | null>(null);
  const [initialMissionId, setInitialMissionId] = useState<string | null>(null);
  const [initialQuizQuestionIds, setInitialQuizQuestionIds] = useState<string[] | null>(null);

  const navigate = (s: Screen, params?: NavigateParams) => {
    if (params?.quizInitialCount !== undefined) setQuizInitialCount(params.quizInitialCount);
    if (params?.initialStudyTab !== undefined) setInitialStudyTab(params.initialStudyTab);
    if (params?.initialMissionId !== undefined) setInitialMissionId(params.initialMissionId);
    if (params?.initialQuizQuestionIds !== undefined) setInitialQuizQuestionIds(params.initialQuizQuestionIds);
    setScreen(s);
  };

  return (
    <NavigationContext.Provider value={{
      screen,
      navigate,
      quizInitialCount,
      clearQuizInitialCount: () => setQuizInitialCount(null),
      initialStudyTab,
      clearInitialStudyTab: () => setInitialStudyTab(null),
      initialMissionId,
      clearInitialMissionId: () => setInitialMissionId(null),
      initialQuizQuestionIds,
      clearInitialQuizQuestionIds: () => setInitialQuizQuestionIds(null),
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};
