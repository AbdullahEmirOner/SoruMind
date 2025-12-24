"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingAnimation } from "@/components/predict/loading-animation";
import { QuestionCard } from "@/components/predict/question-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PredictSlugPage({ params }: { params: { slug: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // The user requested to fetch from http://localhost:3000/math-question/generate
      const response = await fetch("http://localhost:3000/math-question/generate");
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setQuestion(data);
    } catch (err) {
      console.error("Failed to fetch question:", err);
      setError("Soru getirilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleNextQuestion = () => {
    fetchQuestion();
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/predict" 
          className="inline-flex items-center text-sm text-sm-text-muted hover:text-sm-accent transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Konu Seçimine Dön
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {isLoading ? (
          <LoadingAnimation />
        ) : error ? (
           <div className="max-w-md mx-auto w-full">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium mb-2">
                 <AlertCircle className="h-4 w-4" />
                 Hata
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                <Button onClick={fetchQuestion} variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tekrar Dene
                </Button>
              </div>
            </div>
           </div>
        ) : question ? (
          <QuestionCard 
            question={question} 
            onNext={handleNextQuestion} 
          />
        ) : null}
      </div>
    </div>
  );
}
