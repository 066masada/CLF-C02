import { useState, useCallback, useRef } from 'react';
import type { Question, QuizResult } from '../types/index';

export const useQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  // ref は selectAnswer で同期的に更新し、stale closure 問題を回避する
  const answersRef = useRef<(number | null)[]>([]);
  const [startTime] = useState(Date.now());

  const selectAnswer = useCallback((questionIndex: number, answerIndex: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = answerIndex;
      answersRef.current = updated;
      return updated;
    });
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const calculateScore = useCallback(
    (questions: Question[]): { score: number; results: QuizResult[] } => {
      const currentAnswers = answersRef.current;
      let score = 0;
      const results: QuizResult[] = [];

      questions.forEach((question, index) => {
        const selected = currentAnswers[index];
        const correct = selected === question.correctAnswer;
        if (correct) score++;

        results.push({
          userId: '',
          questionId: question.id,
          selected: selected ?? -1,
          correct,
          timeSpent: 0,
          timestamp: Date.now(),
        });
      });

      return { score, results };
    },
    [],
  );

  const reset = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    answersRef.current = [];
  }, []);

  return {
    currentQuestionIndex,
    answers,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    calculateScore,
    reset,
    startTime,
  };
};
