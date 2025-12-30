"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, CheckCircle2, Clock, FileText } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function StatsCards() {
  const { totalQuestions, totalCorrect, successRate, studyTime } = useDashboardStats();

  const stats = [
    {
      title: "Tahmini Başarı",
      value: `%${successRate}`,
      description: "Genel başarı oranı",
      icon: BrainCircuit,
      color: "text-sm-accent",
    },
    {
      title: "Tamamlanan Testler",
      value: totalQuestions.toString(),
      description: "Çözülen Soru Sayısı",
      icon: FileText,
      color: "text-blue-400",
    },
    {
      title: "Doğru Cevaplar",
      value: totalCorrect.toString(),
      description: `%${successRate} başarı oranı`,
      icon: CheckCircle2,
      color: "text-green-400",
    },
    {
      title: "Çalışma Süresi",
      value: studyTime,
      description: "Toplam süre",
      icon: Clock,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-sm-surface border-sm-border hover:border-sm-accent/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-sm-text-muted">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sm-text">{stat.value}</div>
            <p className="text-xs text-sm-text-muted">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
