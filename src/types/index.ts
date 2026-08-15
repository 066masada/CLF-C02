export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionCategory = 'ai-basics' | 'ml-fundamentals' | 'aws-services' | 'ethics' | 'practice';

export interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  question: string;
  description: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tags: string[];
  verified: boolean;
}

export interface UserRecord {
  userId: string;
  displayName: string;
  email?: string;
  createdAt: number;
}

export interface QuizResult {
  userId: string;
  questionId: string;
  selected: number;
  correct: boolean;
  timeSpent: number;
  timestamp: number;
}

export interface StudyProgress {
  userId: string;
  categoryStats: Record<QuestionCategory, CategoryStat>;
  totalQuestionsAnswered: number;
  correctCount: number;
  lastStudyAt: number;
}

export interface CategoryStat {
  total: number;
  correct: number;
  avgTimePerQuestion: number;
  lastStudiedAt: number;
}

export interface QuizAnswer {
  questionId: string;
  selected: number;
  correct: boolean;
}

export interface QuizSession {
  sessionId: string;
  userId: string;
  displayName: string;
  score: number;
  total: number;
  accuracy: number;
  category: QuestionCategory | 'mixed';
  answers: QuizAnswer[];
  timestamp: number;
}

export interface UserStats {
  userId: string;
  displayName: string;
  totalAnswered: number;
  totalCorrect: number;
  sessionCount: number;
  categoryStats: Partial<Record<QuestionCategory, { total: number; correct: number }>>;
  difficultyStats: Partial<Record<QuestionDifficulty, { total: number; correct: number }>>;
  lastUpdated: number;
}

