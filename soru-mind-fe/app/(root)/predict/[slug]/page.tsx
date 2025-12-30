"use client";

import { LoadingAnimation } from "@/components/predict/loading-animation";
import { QuestionCard } from "@/components/predict/question-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, AlertCircle, History, MoreVertical, ExternalLink, Copy, Search, BookOpen } from "lucide-react";
import Link from "next/link";
import { useMathQuestion } from "@/hooks/use-math-question";
import { useQuestionHistory, MathQuestion } from "@/hooks/use-question-history";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuestionPreviewDialog } from "@/components/predict/question-preview-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, MinusCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { SessionStats } from "@/components/predict/session-stats";
import { useStudyTimer } from "@/hooks/use-study-timer";
import { apiClient } from "@/lib/api-client";
import { MathRenderer } from "@/components/common/math-renderer";
import { cn } from "@/lib/utils";

export default function PredictSlugPage({ params }: { params: { slug: string } }) {
  const { data, isLoading, isFetching, error, refetch } = useMathQuestion();
  const { history, addToHistory, updateHistoryStatus } = useQuestionHistory();
  const [displayedQuestion, setDisplayedQuestion] = useState<MathQuestion | null>(null);
  const [loadingSimilar, setLoadingSimilar] = useState<string | null>(null);
  
  // Preview State
  const [previewQuestion, setPreviewQuestion] = useState<MathQuestion | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { startTimer, stopTimer } = useStudyTimer();

  // Start timer on mount, stop on unmount
  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  // When new data arrives from the API, update display and save to history
  useEffect(() => {
    if (data) {
      setDisplayedQuestion(data);
      // New questions default to 'empty' status implicitly until answered
      addToHistory({ ...data, status: 'empty' });
    }
  }, [data, addToHistory]);

  const handleNextQuestion = () => {
    refetch();
  };

  const handleResult = (status: 'correct' | 'wrong' | 'empty', userAnswer?: number) => {
    if (displayedQuestion) {
      updateHistoryStatus(displayedQuestion.text, status, userAnswer);
    }
  };

  const handleHistorySelect = (q: MathQuestion) => {
    setDisplayedQuestion(q);
  };
  
  const handlePreview = (q: MathQuestion) => {
    setPreviewQuestion(q);
    setIsPreviewOpen(true);
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Intl.DateTimeFormat('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const handleGenerateSimilar = async (item: MathQuestion) => {
    try {
      setLoadingSimilar(item.text); // Use text as ID for loading state
      const newQuestion = await apiClient.generateQuestionFromContext({
        topic: item.topic,
        details: `Benzer soru üret: ${item.text}`,
      });
      
      // Convert DTO to MathQuestion format
      const mathQuestion: MathQuestion = {
        ...newQuestion,
        timestamp: Date.now(),
        status: 'empty',
      };
      
      setDisplayedQuestion(mathQuestion);
      addToHistory(mathQuestion);
      
    } catch (err) {
      console.error("Failed to generate similar question:", err);
      // Optionally show toast here
    } finally {
      setLoadingSimilar(null);
    }
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
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <History className="mr-2 h-4 w-4" />
              Geçmiş
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-4">
              <SheetTitle className="text-sm-text">Soru Geçmişi</SheetTitle>
              <SheetDescription>
                Çözdüğünüz son soruları burada bulabilirsiniz.
              </SheetDescription>
            </SheetHeader>

            <SessionStats />

            <div className="mt-6 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">Henüz geçmiş yok.</p>
              ) : (
                <>
                  {history.map((item, index) => (
                    <DropdownMenu key={index}>
                      <DropdownMenuTrigger asChild>
                        <div 
                          className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex flex-col gap-1 group relative overflow-hidden"
                        >
                          <div className="flex justify-between items-center z-10">
                             <div className="flex items-center gap-2">
                               {item.status === 'correct' ? (
                                 <CheckCircle2 className="h-4 w-4 text-green-500" />
                               ) : item.status === 'wrong' ? (
                                 <XCircle className="h-4 w-4 text-red-500" />
                               ) : (
                                 <MinusCircle className="h-4 w-4 text-slate-300" />
                               )}
                               <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                 item.difficulty === 'Zor' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                 item.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                               }`}>
                                 {item.difficulty}
                               </span>
                             </div>
                             <span className="text-[10px] text-muted-foreground">
                               {formatTime(item.timestamp)}
                             </span>
                          </div>
                          
                          <p className="text-sm font-medium line-clamp-2 mt-1 px-1">
                            {item.topic}
                          </p>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem onClick={() => handlePreview(item)}>
                          <Search className="mr-2 h-4 w-4" />
                          Ön İzleme
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleHistorySelect(item)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Soruya Git
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleGenerateSimilar(item)}
                          disabled={loadingSimilar === item.text}
                        >
                          {loadingSimilar === item.text ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                          )}
                          Benzer Soru Üret
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Preview Dialog */}
        <QuestionPreviewDialog 
          open={isPreviewOpen} 
          onOpenChange={setIsPreviewOpen} 
          question={previewQuestion} 
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {(isLoading || isFetching) ? (
          <LoadingAnimation history={history} />
        ) : error ? (
           <div className="max-w-md mx-auto w-full">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium mb-2">
                 <AlertCircle className="h-4 w-4" />
                 Hata
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-red-600 dark:text-red-400">{(error as Error).message || "Bir hata oluştu"}</p>
                <Button onClick={() => refetch()} variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tekrar Dene
                </Button>
              </div>
            </div>
           </div>
        ) : displayedQuestion ? (
          <QuestionCard 
            question={displayedQuestion} 
            onNext={handleNextQuestion} 
            onResult={handleResult}
          />
        ) : null}
      </div>
    </div>
  );
}
