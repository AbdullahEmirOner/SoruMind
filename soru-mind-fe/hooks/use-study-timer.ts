"use client";

import { useState, useEffect, useCallback } from "react";

const STUDY_TIME_KEY = "soru_mind_study_time"; // stored in seconds

export function useStudyTimer() {
  const [isActive, setIsActive] = useState(false);
  
  // Load initial time lazily to avoid hydration mismatch, though for components we usually use useEffect
  // But here we just want to track it.
  
  // Actually, we don't need to return the time constantly for the hook consumer unless they want to display it.
  // The dashboard needs the TOTAL time. The counter just needs to increment it.

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        const storedTime = localStorage.getItem(STUDY_TIME_KEY);
        const currentTime = storedTime ? parseInt(storedTime, 10) : 0;
        localStorage.setItem(STUDY_TIME_KEY, (currentTime + 1).toString());
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const startTimer = useCallback(() => setIsActive(true), []);
  const stopTimer = useCallback(() => setIsActive(false), []);

  return { startTimer, stopTimer };
}
