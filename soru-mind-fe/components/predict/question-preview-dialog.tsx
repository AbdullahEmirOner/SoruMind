"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MathRenderer } from "@/components/common/math-renderer";
import { cn, formatExplanation } from "@/lib/utils";
import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { MathQuestion } from "@/hooks/use-question-history";

interface QuestionPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: MathQuestion | null;
}

export function QuestionPreviewDialog({
  open,
  onOpenChange,
  question,
}: QuestionPreviewDialogProps) {
  if (!question) return null;

  // Helper to determine correct index for preview
  const getCorrectIndex = (q: MathQuestion): number => {
    if (typeof q.correctAnswer === "number") {
      return q.correctAnswer;
    }
    const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };
    return map[q.correctAnswer] ?? -1;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Soru Ön İzleme</DialogTitle>
          <DialogDescription>
            Çözdüğünüz sorunun detayları ve verdiğiniz cevap.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-lg text-sm-text leading-relaxed">
            <MathRenderer content={question.text} />
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const correctIndex = getCorrectIndex(question);
              const isCorrect = index === correctIndex;
              const isSelected = question.userAnswer === index;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                    isCorrect
                      ? "border-green-500/50 bg-green-500/10"
                      : isSelected && !isCorrect
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-sm-border bg-sm-surface-light/50"
                  )}
                >
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border border-primary flex items-center justify-center",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-slate-400"
                    )}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1 text-sm-text font-normal">
                    <MathRenderer content={option} />
                  </div>
                  {isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                  )}
                  {isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-sm-surface-light p-4 border border-sm-border">
            <h4 className="font-medium text-sm-text mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-sm-accent" />
              Çözüm Açıklaması
            </h4>
            <div className="text-sm text-sm-text-muted leading-relaxed tracking-wide whitespace-pre-wrap">
              <MathRenderer content={formatExplanation(question.explanation)} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
