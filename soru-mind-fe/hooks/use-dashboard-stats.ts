"use client";

import { useState, useEffect } from "react";
import { useQuestionHistory, MathQuestion } from "@/hooks/use-question-history";

const STUDY_TIME_KEY = "soru_mind_study_time";

export function useDashboardStats() {
  const { history } = useQuestionHistory();
  const [studyTimeSeconds, setStudyTimeSeconds] = useState(0);

  // Load study time
  useEffect(() => {
    const time = localStorage.getItem(STUDY_TIME_KEY);
    if (time) {
      setStudyTimeSeconds(parseInt(time, 10));
    }
  }, []); // Note: this only leads on mount. We might want it to refresh if user navigates back to dashboard.
  // Ideally, dashboard should refetch this when focused, but simpler for now.

  const calculateStats = () => {
    const totalQuestions = history.length;
    const totalCorrect = history.filter(q => q.status === 'correct').length;
    const totalWrong = history.filter(q => q.status === 'wrong').length;
    const totalEmpty = history.filter(q => q.status === 'empty' || !q.status).length;
    const answeredCount = totalCorrect + totalWrong;
    
    const successRate = answeredCount > 0 ? Math.round((totalCorrect / answeredCount) * 100) : 0;

    // Distribution Data
    const distribution = [
      { name: "Doğru", value: totalCorrect, color: "#4ADE80" },
      { name: "Yanlış", value: totalWrong, color: "#F87171" },
      { name: "Boş", value: totalEmpty, color: "#9EA2B7" },
    ];

    // Topic Performance
    // Group by topic, calculate score (optional: average?)
    // For now, let's just count correct answers per topic as a score proxy or calculate accuracy
    const topicMap = new Map<string, { total: number; correct: number }>();
    
    history.forEach(q => {
      if (!topicMap.has(q.topic)) {
        topicMap.set(q.topic, { total: 0, correct: 0 });
      }
      const entry = topicMap.get(q.topic)!;
      entry.total += 1;
      if (q.status === 'correct') {
        entry.correct += 1;
      }
    });

    const topicPerformance = Array.from(topicMap.entries()).map(([name, stats]) => ({
      name,
      score: Math.round((stats.correct / stats.total) * 100)
    }));
    
    // Sort topic performance? Or map to specific subjects if needed. 
    // We'll return it raw for now.

    // Daily Performance (Last 7 Days)
    // We need dates. history items have `timestamp`.
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const dailyMap = new Map<string, { total: number; correct: number; dayIndex: number }>();
    
    // Initialize last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      // Key can be simplified, but let's assume we want to order them correctly 
      // Actually Recharts just needs an array.
      // Let's create an array of objects first with date strings
    }
    
    // Simpler approach for daily:
    // 1. Create array for last 7 days with 0 stats
    // 2. Iterate history, find matching day, update stats
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('tr-TR'), // e.g. "30.12.2025" or similar
        name: days[d.getDay()],
        total: 0,
        correct: 0,
        accuracy: 0
      };
    });

    history.forEach(q => {
      if (!q.timestamp) return;
      const qDate = new Date(q.timestamp).toLocaleDateString('tr-TR');
      const dayStat = last7Days.find(d => d.date === qDate);
      if (dayStat) {
        dayStat.total += 1;
        if (q.status === 'correct') {
          dayStat.correct += 1;
        }
      }
    });

    // Calculate final accuracy
    const dailyPerformance = last7Days.map(d => ({
      name: d.name,
      accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0
    }));

    // Formatting Study Time
    const hours = Math.floor(studyTimeSeconds / 3600);
    const minutes = Math.floor((studyTimeSeconds % 3600) / 60);
    const formattedStudyTime = `${hours}s ${minutes}d`;
    
    // Estimate daily average (simplistic: Total / 1 for now, or just track separate days later)
    // For now: "Günlük ort: ..." can be placeholder or simple math
    
    return {
      totalQuestions,
      totalCorrect,
      totalEmpty, // added this
      answeredCount, // added this
      successRate,
      studyTime: formattedStudyTime,
      studyTimeSeconds,
      dailyPerformance,
      topicPerformance,
      distribution
    };
  };

  return calculateStats();
}
