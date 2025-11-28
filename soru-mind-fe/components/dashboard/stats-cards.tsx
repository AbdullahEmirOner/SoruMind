import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, CheckCircle2, Clock, FileText } from "lucide-react";

const stats = [
  {
    title: "Tahmini Başarı",
    value: "%84",
    description: "Geçen haftaya göre +%2.5",
    icon: BrainCircuit,
    color: "text-sm-accent",
  },
  {
    title: "Tamamlanan Testler",
    value: "12",
    description: "Bu hafta 4 test",
    icon: FileText,
    color: "text-blue-400",
  },
  {
    title: "Doğru Cevaplar",
    value: "148",
    description: "%82 başarı oranı",
    icon: CheckCircle2,
    color: "text-green-400",
  },
  {
    title: "Çalışma Süresi",
    value: "14s 30d",
    description: "Günlük ort: 2s",
    icon: Clock,
    color: "text-orange-400",
  },
];

export function StatsCards() {
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
