"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function PerformanceChart() {
  const { dailyPerformance } = useDashboardStats();

  return (
    <Card className="col-span-4 bg-sm-surface border-sm-border">
      <CardHeader>
        <CardTitle className="text-sm-text">Başarı Artışı (Son 7 Gün)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dailyPerformance}>
            <XAxis
              dataKey="name"
              stroke="#9EA2B7"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9EA2B7"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#131620", borderColor: "#2A2D3A", color: "#E4E6EB" }}
              itemStyle={{ color: "#E4E6EB" }}
              formatter={(value: number) => [`%${value}`, "Başarı"]}
            />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#675CFF"
              strokeWidth={2}
              dot={{ fill: "#675CFF" }}
              activeDot={{ r: 6, fill: "#7A70FF" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
