"use client";

import { useQuery } from "@tanstack/react-query";

import { MathQuestion } from "@/hooks/use-question-history";

// Remove the local interface definition and use the imported one

async function fetchMathQuestion(): Promise<MathQuestion> {
  const response = await fetch("http://localhost:3000/math-question/generate");
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export function useMathQuestion() {
  return useQuery({
    queryKey: ["math-question"],
    queryFn: fetchMathQuestion,
    // enabled: true by default
  });
}
