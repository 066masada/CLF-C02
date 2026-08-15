import { useState, useMemo } from 'react';
import { questions, questionsByCategory } from '../data/clf-c02-questions';
import type { QuestionCategory } from '../types/index';

const ALL_CATEGORIES = ['ai-basics', 'ml-fundamentals', 'aws-services', 'ethics', 'practice'] as const;

export const useQuestionsStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredQuestions = useMemo(() => {
    let result = selectedCategory === 'all' ? questions : (questionsByCategory[selectedCategory] ?? questions);
    if (selectedDifficulty !== 'all') {
      result = result.filter((q) => q.difficulty === selectedDifficulty);
    }
    return result;
  }, [selectedCategory, selectedDifficulty]);

  return {
    questions: filteredQuestions,
    allQuestions: questions,
    categories: ALL_CATEGORIES,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
  };
};
