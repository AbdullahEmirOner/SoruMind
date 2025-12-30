"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function TopicStrengthChart() {
  const { topicPerformance } = useDashboardStats();

  return (
    <Card className="col-span-4 lg:col-span-2 bg-sm-surface border-sm-border">
      <CardHeader>
        <CardTitle className="text-sm-text">Konu Başarısı</CardTitle>
      </CardHeader>
      <CardContent>
        {topicPerformance.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            Veri bulunamadı
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topicPerformance} layout="vertical">
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#9EA2B7"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80} // Increased width for longer topic names
              />
              <Tooltip
                cursor={{ fill: "#1A1D27" }}
                contentStyle={{ backgroundColor: "#131620", borderColor: "#2A2D3A", color: "#E4E6EB" }}
                itemStyle={{ color: "#E4E6EB" }}
                formatter={(value: number) => [`%${value}`, "Başarı"]}
              />
              <Bar dataKey="score" fill="#675CFF" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
