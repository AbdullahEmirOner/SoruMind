import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: 1,
    topic: "Doğrusal Denklemler",
    difficulty: "Zor",
    predictedProbability: "%92",
    time: "15 dk",
  },
  {
    id: 2,
    topic: "DNA ve Genetik Kod",
    difficulty: "Orta",
    predictedProbability: "%88",
    time: "10 dk",
  },
  {
    id: 3,
    topic: "Paragrafta Anlam",
    difficulty: "Kolay",
    predictedProbability: "%85",
    time: "5 dk",
  },
  {
    id: 4,
    topic: "Elektrik Yükleri",
    difficulty: "Zor",
    predictedProbability: "%82",
    time: "12 dk",
  },
  {
    id: 5,
    topic: "Milli Uyanış",
    difficulty: "Orta",
    predictedProbability: "%78",
    time: "8 dk",
  },
];

export function UpcomingQuestions() {
  return (
    <Card className="col-span-4 lg:col-span-2 bg-sm-surface border-sm-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm-text">Tahmin Edilen Sorular</CardTitle>
        <Button variant="link" className="text-sm-accent hover:text-sm-accent-hover p-0 h-auto">
          Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between rounded-lg border border-sm-border bg-sm-surface-light p-3 hover:bg-sm-surface/80 transition-colors cursor-pointer group"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-sm-text group-hover:text-sm-accent transition-colors">
                  {q.topic}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      q.difficulty === "Zor"
                        ? "bg-red-500/10 text-red-400"
                        : q.difficulty === "Orta"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {q.difficulty}
                  </Badge>
                  <span className="text-xs text-sm-text-muted">{q.time}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-sm-accent">{q.predictedProbability}</p>
                <p className="text-xs text-sm-text-muted">Olasılık</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
