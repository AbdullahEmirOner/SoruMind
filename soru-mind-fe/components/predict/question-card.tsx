"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MathRenderer } from "@/components/common/math-renderer";

interface QuestionProps {
  question: {
    text: string;
    options: string[];
    correctAnswer: number | string; // Supporting both number (index) or string (letter)
    explanation: string;
    topic: string;
    difficulty: string;
  };
  onNext: () => void;
}

export function QuestionCard({ question, onNext }: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Helper to determine if the answer is correct
  // Backend might send "C" (index 2) or numeric index directly
  const getCorrectIndex = (): number => {
    if (typeof question.correctAnswer === 'number') {
      return question.correctAnswer;
    }
    // Map A, B, C, D, E to 0, 1, 2, 3, 4
    const map: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
    return map[question.correctAnswer] ?? -1;
  };

  // Helper to ensure math content has delimiters
  const processMathContent = (content: string) => {
    // Check if content starts with option letter like "A) ", "B) ", etc.
    const optionMatch = content.match(/^([A-E]\)\s*)/);
    const prefix = optionMatch ? optionMatch[1] : '';
    const mainContent = prefix ? content.substring(prefix.length) : content;
    
    // If it looks like a math option (contains ^ or \ or {) and doesn't have delimiters, wrap it.
    const hasLatexChars = /[\^\\{}]/.test(mainContent);
    const hasDelimiters = /(\$|\\\(|\\\[)/.test(mainContent);
    
    if (hasLatexChars && !hasDelimiters) {
      return prefix + `$${mainContent}$`;
    }
    return content;
  };

  const correctIndex = getCorrectIndex();

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setIsSubmitted(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-sm-surface border-sm-border max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b border-sm-border pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg text-sm-text">
              {question.topic}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-sm-text-muted">
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  question.difficulty === "Zor"
                    ? "bg-red-500/10 text-red-400"
                    : question.difficulty === "Orta"
                    ? "bg-yellow-500/10 text-yellow-400"
                    : "bg-green-500/10 text-green-400"
                )}
              >
                {question.difficulty}
              </span>
              <span>•</span>
              <span>Soru Tahmini</span>
            </div>
          </div>
          <HelpCircle className="h-5 w-5 text-sm-text-muted" />
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="text-lg text-sm-text leading-relaxed">
             <MathRenderer content={question.text} />
          </div>

          <RadioGroup
            value={selectedOption?.toString()}
            onValueChange={(val) =>
              !isSubmitted && setSelectedOption(parseInt(val))
            }
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                  isSubmitted && index === correctIndex
                    ? "border-green-500/50 bg-green-500/10"
                    : isSubmitted &&
                      selectedOption === index &&
                      index !== correctIndex
                    ? "border-red-500/50 bg-red-500/10"
                    : selectedOption === index
                    ? "border-sm-accent bg-sm-surface-light"
                    : "border-sm-border hover:bg-sm-surface-light/50 cursor-pointer"
                )}
                onClick={() => !isSubmitted && setSelectedOption(index)}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  className="border-sm-text-muted text-sm-accent"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-sm-text font-normal w-full"
                >
                  <MathRenderer content={processMathContent(option)} />
                </Label>
                {isSubmitted && index === correctIndex && (
                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                )}
                {isSubmitted &&
                  selectedOption === index &&
                  index !== correctIndex && (
                    <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  )}
              </div>
            ))}
          </RadioGroup>

          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-sm-surface-light p-4 border border-sm-border"
              >
                <h4 className="font-medium text-sm-text mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-sm-accent" />
                  Çözüm Açıklaması
                </h4>
                <div className="text-sm text-sm-text-muted">
                   <MathRenderer content={question.explanation} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-end pt-4 border-t border-sm-border">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="bg-sm-accent hover:bg-sm-accent-hover text-white"
            >
              Cevabı Kontrol Et
            </Button>
          ) : (
            <Button
              onClick={onNext}
              className="bg-sm-surface-light hover:bg-sm-border text-sm-text border border-sm-border"
            >
              Yeni Soru Üret <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
