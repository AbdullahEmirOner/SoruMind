"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

export function QuestionDistributionChart() {
  const { distribution, totalQuestions } = useDashboardStats();

  return (
    <Card className="col-span-4 lg:col-span-2 bg-sm-surface border-sm-border">
      <CardHeader>
        <CardTitle className="text-sm-text">Performans Dağılımı</CardTitle>
      </CardHeader>
      <CardContent>
        {totalQuestions === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
             Henüz veri yok
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#131620", borderColor: "#2A2D3A", color: "#E4E6EB" }}
                itemStyle={{ color: "#E4E6EB" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
