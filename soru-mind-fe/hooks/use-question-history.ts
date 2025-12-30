"use client";

import { useState, useCallback, useEffect } from "react";

const HISTORY_KEY = "soru_mind_question_history";

export interface MathQuestion {
  text: string;
  options: string[];
  correctAnswer: number | string;
  explanation: string;
  topic: string;
  difficulty: string;
  timestamp?: number;
  status?: 'correct' | 'wrong' | 'empty';
  // Keep flexible for additional fields if needed
  [key: string]: any;
}

export function useQuestionHistory() {
  const [history, setHistory] = useState<MathQuestion[]>([]);

  useEffect(() => {
    // Load initial history
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  const saveHistory = useCallback((newHistory: MathQuestion[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, []);

  const addToHistory = useCallback(
    (question: MathQuestion) => {
      // Prevent duplicates based on question text
      const isDuplicate = history.some((h) => h.text === question.text);
      if (isDuplicate) return;

      const questionWithTimestamp = {
        ...question,
        timestamp: Date.now(),
      };

      const newHistory = [questionWithTimestamp, ...history].slice(0, 50); // Limit to 50 items
      saveHistory(newHistory);
    },
    [history, saveHistory]
  );

  const updateHistoryStatus = useCallback((questionText: string, status: 'correct' | 'wrong' | 'empty') => {
    setHistory((prev) => {
      const newHistory = prev.map((item) => 
        item.text === questionText ? { ...item, status } : item
      );
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history update", error);
      }
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  return {
    history,
    addToHistory,
    updateHistoryStatus,
    clearHistory,
  };
}
