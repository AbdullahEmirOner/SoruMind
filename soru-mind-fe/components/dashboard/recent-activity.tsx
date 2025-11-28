import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: "TEST-1023",
    topic: "Matematik - Cebirsel İfadeler",
    score: "18/20",
    status: "Tamamlandı",
    date: "Bugün, 10:30",
  },
  {
    id: "TEST-1022",
    topic: "Fen Bilimleri - Basınç",
    score: "15/20",
    status: "Tamamlandı",
    date: "Dün, 16:15",
  },
  {
    id: "TEST-1021",
    topic: "Türkçe - Dil Bilgisi",
    score: "-",
    status: "Devam Ediyor",
    date: "Dün, 14:00",
  },
  {
    id: "TEST-1020",
    topic: "İnkılap Tarihi - 1. Dünya Savaşı",
    score: "19/20",
    status: "Tamamlandı",
    date: "26 Kas, 11:00",
  },
];

export function RecentActivity() {
  return (
    <Card className="col-span-4 bg-sm-surface border-sm-border">
      <CardHeader>
        <CardTitle className="text-sm-text">Son Test Aktiviteleri</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-sm-border hover:bg-transparent">
              <TableHead className="text-sm-text-muted">Test ID</TableHead>
              <TableHead className="text-sm-text-muted">Konu</TableHead>
              <TableHead className="text-sm-text-muted">Puan</TableHead>
              <TableHead className="text-sm-text-muted">Durum</TableHead>
              <TableHead className="text-right text-sm-text-muted">Tarih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id} className="border-sm-border hover:bg-sm-surface-light/50">
                <TableCell className="font-medium text-sm-text">{activity.id}</TableCell>
                <TableCell className="text-sm-text-muted">{activity.topic}</TableCell>
                <TableCell className="text-sm-text">{activity.score}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`border-0 ${
                      activity.status === "Tamamlandı"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm-text-muted">{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
