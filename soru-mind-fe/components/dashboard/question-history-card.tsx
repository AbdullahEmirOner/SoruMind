"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, History, Clock } from "lucide-react";
import { useQuestionHistory, MathQuestion } from "@/hooks/use-question-history";
import { QuestionPreviewDialog } from "@/components/predict/question-preview-dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MathRenderer } from "@/components/common/math-renderer";

export function QuestionHistoryCard() {
  const { history } = useQuestionHistory();
  const [previewQuestion, setPreviewQuestion] = useState<MathQuestion | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const displayHistory = history.slice(0, 5);

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Intl.DateTimeFormat("tr-TR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  const handlePreview = (question: MathQuestion) => {
    setPreviewQuestion(question);
    setIsPreviewOpen(true);
  };

  return (
    <Card className="col-span-4 lg:col-span-3 bg-sm-surface border-sm-border flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm-text flex items-center gap-2">
          <History className="h-5 w-5 text-sm-accent" />
          Son Sorular
        </CardTitle>
        <Link href="/predict/matematik">
          <Button variant="ghost" size="sm" className="text-sm-text-muted hover:text-sm-text">
            Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {displayHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
            <History className="h-10 w-10 text-sm-text-muted/50" />
            <p className="text-sm-text-muted">Henüz hiç soru çözmediniz.</p>
            <Link href="/predict">
              <Button size="sm" className="bg-sm-accent hover:bg-sm-accent-hover text-white">
                Soru Çözmeye Başla
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-sm-border hover:bg-sm-surface-light transition-colors group"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] h-5 ${
                        item.status === "correct"
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          : item.status === "wrong"
                          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          : "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20"
                      }`}
                    >
                      {item.status === "correct" ? "Doğru" : item.status === "wrong" ? "Yanlış" : "Boş"}
                    </Badge>
                    <span className="text-[10px] text-sm-text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-sm-text truncate max-w-[200px]">
                    {item.topic}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-sm-text-muted hover:text-sm-accent"
                    onClick={() => handlePreview(item)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <QuestionPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        question={previewQuestion}
      />
    </Card>
  );
}
